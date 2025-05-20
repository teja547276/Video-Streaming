var express=require("express");
var app=express();
var port =4000;
const cookieParser=require('cookie-parser');
const cors =require('cors');
app.use(cors({
    origin:'http://localhost:3000', ///for conneting front end 
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");

app.use(cors({
  origin: "https://video1-streaming.vercel.app"
}));


require('./Connection/Connect');

const AuthRoutes=require('./Routes/User');
const Videoroutes=require('./Routes/Video');
const CommentRoutes=require('./Routes/Comment');

app.use('/auth',AuthRoutes);
app.use('/api',Videoroutes);
app.use('/commentapi',CommentRoutes);
app.listen(port,()=>console.log("our project running on port 4000"));
