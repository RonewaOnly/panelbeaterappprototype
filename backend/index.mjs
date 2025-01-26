import express from "express";
import path from "path";
import session from "express-session";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from 'passport';
import cors from "cors";
import './src/schema/local-schema.mjs';
import { initialize, close } from "./src/dbConfig.mjs";
import PanelOwner from "./src/models/user.mjs";
import { createEngine } from "express-react-views";
import jwt from 'jsonwebtoken';
import flash from 'connect-flash';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from "http";
import { Server } from "socket.io";
import ChatSpace from "./src/routes/chat-room.mjs";
import multer from "multer";
import sanitize from "sanitize-filename";
import fs from "fs";
import { customerInteractions } from "../src/controller/customerDump copy.mjs";


// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
        credentials: true,
      },
});

const reactAppURL = process.env.REACT_APP_URL || 'http://localhost:3001';

// Initialize database connection once
// Initialize database connection
(async () => {
    try {
        await initialize();
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Failed to initialize database:", error);
        process.exit(1); // Exit the process if the database fails to initialize
    }
})();
// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const corsOptions = {
    origin: reactAppURL,
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware configuration
app.use(express.json({ limit: '5mb' })); // Explicit size limit
app.use(express.urlencoded({ extended: true }));

//this is the route to use for the chat space or room
// Initialize ChatSpace
const chatRouter = ChatSpace(io);

// Use the chat router
app.use("/chat", chatRouter);
// Static files configuration with security headers
app.use(express.static(path.join(__dirname, '../src/views'), {
    setHeaders: (res, path, stat) => {
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('X-Frame-Options', 'DENY');
    }
}));

// View engine setup
app.engine('jsx', createEngine());
app.set('view engine', 'jsx');
app.set('views', path.join(process.cwd(), 'src', 'views'));

// Body parser setup with explicit limits
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '1mb' }));

// Cookie parser with signed cookies
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'development-secret';
app.use(cookieParser(COOKIE_SECRET));

// Session configuration
const SESSION_SECRET = process.env.SESSION_SECRET || 'development-session-secret';
const sessionConfig = {
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    name: 'sessionId', // Custom session cookie name
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7200000 // 2 hours in milliseconds
    }
};

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath,{recursive:true}); // Create directory if it doesn't exist
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = sanitize(file.originalname); // Remove invalid characters

      cb(null, `${Date.now()}-${sanitizedFilename}`);
    },
  });
  
  const upload = multer({ storage });

  const uploadPath = path.join(__dirname, "uploads");
console.log("Upload path:", uploadPath);

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRATION || '1h';

// Authentication middleware
const authenticateJWT = (req, res, next) => {
    const token = req.session.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/login', (req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
        next()},
    passport.authenticate("local", { failureFlash: true }), // authenticate first
    (req, res) => {
        const session = req.session.passport;
        console.log(`session- ${session}`);
        try {
            const user = req.session.passport.user;
            //store the session in a token
            console.error('User:', user);
            const token = jwt.sign(
                session,
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES }
            )
            req.session.token = token;
            console.log('Token after login:', token); // Debugging the token
            res.json({ message: 'Login successful', token,session });
            //res.redirect(reactAppURL + '/');
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Login failed' });
        }
    }
);

// app.get('/login', (req, res) => {
//     res.redirect(reactAppURL + '/login');
// });

app.post('/register', async (req, res) => {
    try {
        // Input validation (add your validation logic here)
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = new PanelOwner(req.body);
        await PanelOwner.registerPanelOwner(user);
        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// Protected routes
app.get('/search', authenticateJWT, async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: 'Email parameter required' });
        }

        const panel = await PanelOwner.getPanelOwnerByEmail(email);
        if (!panel?.length) {
            return res.status(404).json({ message: 'No results found' });
        }

        const safePanel = removeCircularReferences(panel);
        res.status(200).json({ data: safePanel });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({
            message: 'Search failed',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

app.get('/user/:email', authenticateJWT, async (req, res) => {
    try {
        const { email } = req.params;
        const user = await PanelOwner.getPanelOwner(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ data: user });
    } catch (err) {
        console.error('User lookup error:', err);
        res.status(500).json({
            message: 'Error finding user',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
});

// Endpoint to handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
  
      console.log("File received:", req.file);
  
      res.status(200).json({
        message: "File uploaded successfully!",
        file: {
          originalName: req.file.originalname,
          savedAs: req.file.filename,
          location: path.join("uploads", req.file.filename),
        },
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ message: "Error uploading file" });
    }
  });
  
// Endpoint to list all files
app.get("/files", (req, res) => {
    fs.readdir("uploads", (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error reading files." });
        }
        res.json(files);
    });
});

// Endpoint to download a file
app.get("/files/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File not found." });
    }
});

// Endpoint to delete a file
app.delete("/files/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);

    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ error: "Error deleting file." });
            }
            res.json({ message: "File deleted successfully." });
        });
    } else {
        res.status(404).json({ error: "File not found." });
    }
});


// Filter customer interactions by date range
app.post('/api/reports', (req, res) => {
    const { start, end } = req.body;
    if (!start || !end) {
        return res.status(400).json({ error: 'Invalid date range' });
    }

    const filteredData = customerInteractions.filter(interaction => {
        const interactionDate = new Date(interaction.requestDate);
        return interactionDate >= new Date(start) && interactionDate <= new Date(end);
    });

    res.json(filteredData);
});

// Generate a customer report
app.post('/api/generate-report', (req, res) => {
    const { reportData } = req.body;

    console.log('Report data:', reportData);
    if (!reportData || !reportData.length) {
        return res.status(400).json({ error: 'No report data provided' });
    }

    const totalRequests = reportData.length;
    const completedRequests = reportData.filter(r => r.status === 'completed').length;
    const averageResponseTime = (
        reportData.reduce((acc, curr) => acc + curr.responseTime, 0) / totalRequests
    ).toFixed(2);

    const retentionRate = ((completedRequests / totalRequests) * 100).toFixed(2);

    const servicesCategorized = reportData.reduce((acc, curr) => {
        if (!acc[curr.service]) {
            acc[curr.service] = { count: 0, totalSatisfaction: 0 };
        }
        acc[curr.service].count += 1;
        acc[curr.service].totalSatisfaction += curr.satisfaction;
        return acc;
    }, {});

    for (const service in servicesCategorized) {
        servicesCategorized[service].averageSatisfaction = (
            servicesCategorized[service].totalSatisfaction / servicesCategorized[service].count
        ).toFixed(2);
    }

    res.json({
        totalRequests,
        completedRequests,
        averageResponseTime,
        retentionRate,
        servicesCategorized,
    });
});



// Utility function
function removeCircularReferences(obj) {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    }));
}

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Graceful shutdown
const shutdown = async () => {
    console.log('Performing graceful shutdown...');
    try {
        await close();
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;