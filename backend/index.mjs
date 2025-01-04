import express from "express";
import path from "path";
import fs from "fs";
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

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const reactAppURL = 'http://localhost:3001'; // Replace with the actual URL of your React app


// Initialize database connection once
await initialize();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files configuration
app.use(express.static(path.join(__dirname, '../src/views')));
app.use(express.static(path.join(process.cwd(), 'src', 'views')));


console.log(path.join(process.cwd(), 'src', 'view'));

// View engine setup
app.engine('jsx', createEngine());
app.set('view engine', 'jsx');

// CORS setup
app.use(cors());

// Body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Session management
app.use(session({
    secret: 'secrets',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 2,
        secure: process.env.NODE_ENV === 'production' // Only use secure in production
    },
    // Add a proper session store for production
    store: process.env.NODE_ENV === 'production' ? /* add your session store here */ undefined : undefined
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Login route
app.post('/login', 
    (req, res, next) => {
        console.log("Request body:", req.body);
        next();
    },
    passport.authenticate("local", {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })
);

app.get('/login', (req, res) => {
    const filePath = path.join(process.cwd(), '..','src', 'view', 'login.jsx'); // Corrected path

    res.redirect(reactAppURL + '/login');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).send('File not found');
      }
    });

    
    
});

// Registration route
app.post('/register', async (req, res) => {
    const { body } = req;
    try {
        const user = new PanelOwner(body);
        await PanelOwner.registerPanelOwner(user);
        res.status(200).json({ message: 'Registration successful' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ 
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Search route
app.get('/search', async (req, res) => {
    const { query } = req;
    try {
        const panel = await PanelOwner.getPanelOwnerByEmail(query.email);
        if (!panel || !panel.length) {
            return res.status(404).json({ message: 'No results found' });
        }
        const safePanel = removeCircularReferences(panel);
        res.status(200).json({ data: safePanel });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ 
            message: 'Search failed',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// User route
app.get('/user/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const user = await PanelOwner.getPanelOwner(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User found', data: user });
    } catch (err) {
        console.error('User lookup error:', err);
        res.status(500).json({ 
            message: 'Error finding user',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Circular reference removal utility
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Graceful shutdown handler
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    await close();
    process.exit(0);
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});