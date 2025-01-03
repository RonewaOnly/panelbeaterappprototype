import express from "express";  // Corrected the import statement
import path from "path"; 
import fs from "fs";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import { initialize,close } from "./dbConfig";

const app = express();  // Initialized Express correctly

// Middleware configuration
app.use(express.json());  // To parse JSON requests
app.use(express.urlencoded({ extended: true }));  // To parse URL-encoded form data

// Static files served from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));  // Serve static files from 'public'

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
app.get('/', (req, res) => {
    res.send('Hello World!');
    initialize();  // Initialize the connection pool

});

// Server listening on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
