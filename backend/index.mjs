import express from "express";  // Corrected the import statement
import path from "path";
import fs from "fs";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport, { Passport } from 'passport';
import cors from "cors";

import { initialize, close } from "./src/dbConfig.mjs";
import PanelOwner from "./src/models/user.mjs";



const app = express();  // Initialized Express correctly
initialize();//this is the connecting to the database.

// Middleware configuration
app.use(express.json());  // To parse JSON requests
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded form data

// Static files served from the 'public' folder
app.use(express.static(path.join("./frontend/", "public")));  // Serve static files from 'public'

// CORS setup to allow cross-origin requests
app.use(cors());

// Body parser setup for handling larger requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

// Cookie parser to parse cookies in request headers
app.use(cookieParser());

// Session management using express-session
app.use(session({
    secret: 'secrets',
    saveUninitialized: false,  // Do not create a session until something is stored
    resave: false,  // Do not save session if unmodified
    cookie: {
        maxAge: 60000 * 60 * 2,  // Set cookie expiry (2 hours in ms)
        secure: false  // Set to `true` if using HTTPS
    },
    store: null
}));

// Passport.js initialization for authentication
app.use(passport.initialize());
app.use(passport.session());

// Basic route
app.get('/', async (req, res) => {
    res.send('Hello World!');

    await initialize();  // Initialize the connection pool

    //Close the connection pool after 10 seconds
    setTimeout(async () => {
        await close();
    }, 10000);

});
//login using passport-local
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req
    , res) => {
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.post('/register', async (req, res) => {
    const { body } = req;
    try {
        var user = new PanelOwner(body);
        await PanelOwner.registerPanelOwner(user);
        res.status(200).json({ message: 'Registration successful' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Registration failed' });

    }


});
//search for panel with email as a parameter
// Custom function to remove circular references
function removeCircularReferences(obj) {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;  // Avoid circular reference
            }
            seen.add(value);
        }
        return value;
    }));
}

app.get('/search', async (req, res) => {
    const { query } = req;
    try {
        const panel = await PanelOwner.getPanelOwnerByEmail(query.email);
        const safePanel = removeCircularReferences(panel); // Remove circular references
        console.log("data from endpoint:", safePanel.length);  // Now log the safePanel
        res.status(200).send({ data: safePanel[8] });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Search failed' });
    }
});

app.get('/user/:email', async (req, res) => {
    const email = req.params.email;
    try {
        var user = await PanelOwner.getPanelOwner(email);

        res.json({ message: 'User found', data: user });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: 'User not found' });
    }

})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});




















// Server listening on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
