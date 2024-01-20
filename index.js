import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from 'url';


const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.emqiwds.mongodb.net/registrationFormDB`,{
    useNewURLParser: true,
    useUnifiedTopology: true
});

const registrationSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const Registration = mongoose.model('Registration',registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register",async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        const existingUser = await Registration.findOne({
            email:email
        });
        if(!existingUser){
            const registerationData = new Registration({
                name,
                email,
                password
            });
            await registerationData.save();
            res.redirect("/success");
        }else{
            console.log("User already registered");
            res.redirect("/error");
        }
    }
    catch(err){
        console.log(err);
        res.redirect("/error");
    }
});

app.get("/success",(req,res)=>{
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error",(req,res)=>{
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});