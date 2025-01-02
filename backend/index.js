import e from "express";
import path from "path"; 
import fs from "fs";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
const app = e(); 

app.use(e.json());
//I want the app to read documents and images from the public folder
app.use(e.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(session({
    secret: 'secrets',
    saveUninitialized: false, // Do not create a session until something is stored
    resave: false, // Do not save session if unmodified
    cookie: {
        maxAge: 60000 * 60 *120 +7,
        secure: false // Set to `true` if using HTTPS
    },
    store: null
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
} )