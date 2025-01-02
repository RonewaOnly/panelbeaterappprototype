import e from "express";
import path from "path"; 
import fs from "fs";
import bodyParser from "body-parser";
const app = e(); 

app.use(e.json());
//I want the app to read documents and images from the public folder
app.use(e.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
} )