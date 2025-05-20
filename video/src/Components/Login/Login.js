import React,{useState} from 'react'
import './Login.css'
import YouTubeIcon from '@mui/icons-material/YouTube';
import {Link} from 'react-router-dom'
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Trending
const Login = ({setLoginModal}) => {
  const [loginField,setLoginField]=useState({"userName":"","password":""});
 // console.log(loginField)
 const [ loader ,setLoader]=useState(false);

  const handleOnChangeInput=(event,name)=>{
    setLoginField({
      ...loginField,[name]:event.target.value
    })
  }
  //backend
 const handleLoginFunc=async()=>{
  setLoader(true);//when it is called loader happens
  axios.post("http://localhost:4000/auth/login",loginField,{withCredentials:true}).then((resp=>{
    setLoader(false);
    console.log(resp);
    localStorage.setItem("tokens",resp.data.tokens)//saving token 
    localStorage.setItem("userId",resp.data.user._id)//saving user details
    localStorage.setItem("userProfilePic",resp.data.user.profilePic);
    //The above code is for login but not showing login or not below code check
   window.location.reload();//for loading to home page

    
  })).catch(err=>{
    setLoader(false);
    toast.error("Invalid Credentials");
    console.log(err);

  })
 }
  
  return (
    <div className='login'>
         <div className='login-card'>
             <div className='title-card-login'>
                <WhatshotIcon sx={{  fontSize:"54px",}}className='login-youtube-img'/>
                Login
             </div>
             <div className='login-credentials'>
                  <div className='user-name-login'>
                    < input type='text' className='user-name-login-user-name'value={loginField.userName} onChange={(e)=>handleOnChangeInput(e,"userName")} placeholder='UserName'/>
                  </div>
                  <div className='user-name-login'>
                    < input type='password' className='user-name-login-user-name'value={loginField.password} onChange={(e)=>handleOnChangeInput(e,"password")}  placeholder='Password'/>
                  </div>


             </div>
             <div className='login-buttons'>
                 <div className='login-btn'onClick={handleLoginFunc}>Login</div>
                 <Link to={'/signup'} className='login-btn' onClick={()=>setLoginModal()}>SignUp</Link>
                 <div className='login-btn'onClick={()=>setLoginModal()}>Cancel</div>
             </div>
          { loader && <Box sx={{width :'100%'}}>
              <LinearProgress/>

             </Box>}
         </div>
       <ToastContainer/>

    </div>
  )
}

export default Login