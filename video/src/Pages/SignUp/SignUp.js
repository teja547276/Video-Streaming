import React,{useState} from 'react'
import './SignUp.css'
import Box from '@mui/material/Box'
import  LinearProgress from '@mui/material/LinearProgress'
//npm i react-toastify is used for posting the details especially in case of signUp and Login
import YouTubeIcon from '@mui/icons-material/YouTube'
import {Link} from 'react-router-dom'
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Trending
import axios from'axios'
import {toast,ToastContainer} from 'react-toastify'
const SignUp = () => {
  const [uploadedImageUrl,setUploadedImageUrl]=useState("https://th.bing.com/th/id/OIP.Wy2uo_y-ttULYs4chLmqSAAAAA?rs=1&pid=ImgDetMain")
  const [signUpField,setSignUpField]=useState({"channelName":"","userName":"","password":"","about":"","profilePic":uploadedImageUrl})
 const [progress,setProgress]=useState(false);
  const handleInputField=(event,name)=>{
     setSignUpField({
      ...signUpField,[name]:event.target.value
     })

  }
  console.log(signUpField)
  const uploadImage=async (e)=>{
    console.log("Uploading");
   const files=e.target.files;
 const data= new FormData(); 
 data.append('file',files[0]);
 //video-streaming
 data.append('upload_preset','video-stream')
 try{
const response =await axios.post("https://api.cloudinary.com/v1_1/dujjgu584/image/upload",data)
console.log(response)
const imageUrl=response.data.url;
setUploadedImageUrl(imageUrl);
setSignUpField({
  ...signUpField,"profilePic":imageUrl
})
 }catch(err){
  console.log(err);
 }
  }
  //dujjgu584
   const handleSignUP=async()=>{
   setProgress(true);
    axios.post('http://localhost:4000/auth/signup',signUpField).then((res)=>{
      console.log(res);
      toast.success(res.data.message)
      setProgress(false);
    }).catch(err=>{
      console.log(err);
    })//SignUPfield contains all details it must be post 
   }//backend

  return (
    <div className='sign-up'>
        <div className='sign-up-card'>
            <div className='sign-up-title'>
            <WhatshotIcon sx={{fontSize:"54px"}} className='login-youtube-img'/>
            Sign-Up
            </div>
      <div className='sign-up-inpts'>
        <input type='text' className='sign-up-inpts-channel'value={signUpField.channelName} onChange={(e)=>handleInputField(e,"channelName")} placeholder='Channel Name' />
        <input type='text' className='sign-up-inpts-channel' value={signUpField.userName} onChange={(e)=>handleInputField(e,"userName")} placeholder='User Name' />
        <input type='password' className='sign-up-inpts-channel'value={signUpField.password} onChange={(e)=>handleInputField(e,"password")} placeholder='Password' />
        <input type='text' className='sign-up-inpts-channel'value={signUpField.about} onChange={(e)=>handleInputField(e,"about")}  placeholder='About Your Channel' />
        <div className='image-upload-sign-up'>
          <input type='file'onChange={(e)=>uploadImage(e)}  accept="image/*"/>
            <div className='image-upload-div'>
               <img src={uploadedImageUrl} className='image-default-sign-up' alt='error'/>
            </div>

        </div>
        <div className='sign-up-buttons'>
           <div className='sign-up-btn'onClick={handleSignUP}>SignUP</div>
           <Link to={'/'} className='sign-up-btn'>Home</Link>

        </div>
     {progress &&   <Box src={{width:'100%'}}>
          <LinearProgress/>
        </Box>
     }
      </div>
        </div>
  <ToastContainer/>
    </div>
  )
}

export default SignUp