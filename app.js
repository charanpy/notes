const express=require("express");
const app=express();
require("dotenv").config();
const bP=require("body-parser");
const ejs=require("ejs");
var Alert = require("js-alert");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');

app.use(session({
    secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
    resave: false,
    saveUninitialized: true
    }));




app.use(flash());

const cors = require('cors');
app.use(cors())
app.use(bP.json())
app.use(bP.urlencoded({extended:true}));



const authenticate=require('./routers/login');
const register=require('./routers/register');
const notes=require('./routers/notes')
app.set('view engine', 'ejs');

app.use(express.static(__dirname+"/public"))
app.use('/',authenticate)
app.use('/register',register)
app.use("/notes",notes)
const mongo=require('./routers/mongoose');


/*app.get("/notes",(req,res)=>{
    Notes.find({},(err,foundUser)=>{
        if(err){
            console.log(err)
        }
        else{
            res.render('index',{items:foundUser})
        }
    })
})

app.get("/post",(req,res)=>{
    res.render("notes");

})*/


   app.listen(3000,()=>{
    console.log('Notes App Started');
})