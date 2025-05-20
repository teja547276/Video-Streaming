const express=require("express")
const mongoose= require("mongoose");
//videoBackend
const app=express();
mongoose.connect('mongodb://localhost:27017/DataBase')
.then(()=>console.log('DB connected to our server')).catch(err=>{
    console.log(err)
});