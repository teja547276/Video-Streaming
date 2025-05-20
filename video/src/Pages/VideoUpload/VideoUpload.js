import React,{useState,useEffect} from 'react'
import './VideoUpload.css'
import YoutubeIcon from '@mui/icons-material/YouTube';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import CircularProgress  from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Trending
const VideoUpload = () => {
  const [inputField,setInputField]=useState({"title":"","description":"","videoLink":"","thumbnail":"","videoType":""});
  const [loader,setLoader]=useState(false);
  const navigate=useNavigate();
   const handleOnChangeInput=(event,name)=>{
    setInputField({
      ...inputField,[name]:event.target.value
    })
   }
   const uploadImage=async (e,type)=>{
    setLoader(true)
    console.log("Uploading");
   const files=e.target.files;
 const data= new FormData(); 
 data.append('file',files[0]);
 //video-streaming
 data.append('upload_preset','video-stream')
 try{
const response =await axios.post(`https://api.cloudinary.com/v1_1/dujjgu584/${type}/upload`,data)
console.log(response)
const url=response.data.url;
setLoader(false)
let val=type=== "image"?"thumbnail":"videoLink";
    setInputField({
      ...inputField,[val]:url
    })

 }catch(err){
  setLoader(false);
  console.log(err);
 }
  }
  console.log(inputField);

  //dujjgu584
   const handleSubmitFunc =async()=>{
    setLoader(true);
    await axios.post("http://localhost:4000/api/video",inputField,{withCredentials:true}).then((res)=>{
      console.log(res);
      setLoader(false);
      navigate('/');
    }).catch(err=>{
      console.log(err);
      setLoader(false);
    })

   }
   useEffect(()=>{
    let isLogin=localStorage.getItem("userId");
    if(isLogin==null){
      
      navigate('/');//Home Page
      alert(" Not Login ")
     
    }
   },[])
  return (
    <div className='video-upload'>
         <div className='upload-box'>
            <div className='upload-video-title'>
                  <WhatshotIcon sx={{fontSize:"54px", color:"red"}}/>
                  Upload Video
            </div>
            <div className='upload-form'>
                <input type='text' value={inputField.title}onChange={(e)=>handleOnChangeInput(e,"title")} placeholder='Title of Video' className='upload-form-input'/>
                <input type='text'value={inputField.description}onChange={(e)=>handleOnChangeInput(e,"description")} placeholder='Description' className='upload-form-input'/>
                <input type='text'value={inputField.videoType}onChange={(e)=>handleOnChangeInput(e,"videoType")} placeholder='Category' className='upload-form-input'/>
                <div>Thumbnail <input type='file' accept="image/*" onChange={(e)=>uploadImage(e,"image")}/></div>
                <div>Video <input type='file' accept="'video/mp4,video/mp3,video/webm,video/*'" onChange={(e)=>uploadImage(e,"video")} /></div>
                {
              loader && <Box sx={{display:'flex'}}>
                <CircularProgress/>

              </Box>
            }
            </div>
           
            <div className='upload-butns'>
                <div className='upload-butns-form' onClick={handleSubmitFunc}>Upload</div>
                <Link to ='/'className='upload-butns-form'>Go Home</Link>
            </div>
         </div>
    </div>
  )
}

export default VideoUpload