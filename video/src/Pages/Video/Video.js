import React,{useState,useEffect} from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import {Link } from 'react-router-dom'
import './Video.css'
import { useParams } from 'react-router-dom'//for fetching URL
import {toast, ToastContainer } from 'react-toastify'
import axios from 'axios';//IF it is imported definately you have to import UseEffect
import { colors } from '@mui/material';
const Video = () => {
    const [message,setMessage]=useState("");
    const [data,setData]=useState(null);
    const [videoURL,setVideoURL]=useState("");//It is For getting Video URL dynamically
    const [comments,setComments]=useState([]);
const [isFollow,setisFollow]=useState(false);
    const {id}=useParams();
const [isLike,setisLike]=useState(false);

    //console.log(id);
    //console.log(message);

//console.log(message)

const fetchVedioById=async()=>{
   //await axios.get('http://localhost:4000/api/getvideobyid/678f5138ad141e778372af63')
   await axios.get(`http://localhost:4000/api/getvideobyid/${id}`).then((res)=>{
   console.log(res);
  console.log(res.data.video)
    setData(res.data.video);
    setVideoURL(res?.data?.video?.videoLink);
    //console.log(videoURL);
   }).catch(err=>{
    console.log("Error Fetching Video :",err);
   })
}
const getCommentByVideoID=async()=>{//fetch from data (videoID->data?._id ) or paramsID($(id))
    await axios.get(`http://localhost:4000/commentapi/comment/${id}`).then((res)=>{
        //console.log(res);
        setComments(res.data.comments);//for Rendering 
    }).catch(err=>{
        console.log(err);
    })
}

const handleLike = async () => {
  try {

      const res = await axios.put(`http://localhost:4000/api/like/${id}`, {}, { withCredentials: true });
      console.log(res);
      setData((prevData) => ({ ...prevData, likes: res.data.likes, dislikes: res.data.dislikes }));
      setisLike(true);
  } catch (error) {
      console.error("Error liking video:", error);
      toast.error("Error liking the video");
  }
};

const handleDislike = async () => {
  try {
      const res = await axios.put(`http://localhost:4000/api/dislike/${id}`, {}, { withCredentials: true });
      console.log(res);
      setData((prevData) => ({ ...prevData, likes: res.data.likes, dislikes: res.data.dislikes }));
      setisLike(false);
  } catch (error) {
      console.error("Error disliking video:", error);
      toast.error("Error disliking the video");
  }
};


const incrementViewCount = async () => {
  try {
      const res = await axios.put(`http://localhost:4000/api/view/${id}`, {}, { withCredentials: true });
      setData((prevData) => ({ ...prevData, views: res.data.views }));
  } catch (error) {
      console.error("Error incrementing view count:", error);
  }
};

  useEffect(()=>{
    fetchVedioById();//first this function is rendered after useEffect
    getCommentByVideoID();
    incrementViewCount();

  },[id])

  const handleComment=async()=>{
    const body={
      "message":message,
      "video":id,

    }
   await  axios.post("http://localhost:4000/commentapi/comment",body,{withCredentials:true}).then((res)=>{
   console.log(res);
    const newComment=res.data.comment;
    setComments([newComment,...comments]);
    setMessage("");
   }).catch(err=>{
    console.log(err);
    toast.error("Please Login to Comment ");
   })
  }
  
  const handleFollow = async () => {
    try {
        const res = await axios.put(`http://localhost:4000/auth/follow/${data?.user?._id}`, {}, { withCredentials: true });
        console.log(res);
        setisFollow(true);
        toast.success("Followed successfully!");
    } catch (error) {
        console.error("Error following user:", error);
        toast.error("Error following user.");
    }
};

const handleUnfollow = async () => {
    try {
        const res = await axios.put(`http://localhost:4000/auth/unfollow/${data?.user?._id}`, {}, { withCredentials: true });
        console.log(res);
        setisFollow(false);
        toast.success("Unfollowed successfully!");
    } catch (error) {
        console.error("Error unfollowing user:", error);
        toast.error("Error unfollowing user.");
    }
};

  
  return (
    <div className='video'>
       <div className='video-post-section'>
        <div className='video-youtube'> 

         {videoURL && <video width="400" controls autoPlay className='video-youtube-video'>
            <source src={videoURL} type="video/mp4"/>
            <source src={videoURL} type="video/webm"/>
       
            Your browser does not support the video tag.
         </video>


         }
         </div>
            {/*1<source src={"https://res.cloudinary.com/mashhuudanny/video/upload/v1720350210/xo81mxhcvjckkw1tdp62.mp4"} type="video/webm"/>
            <source src={"https://res.cloudinary.com/mashhuudanny/video/upload/v1720350210/xo81mxhcvjckkw1tdp62.mp4"} type="video/webm"/>*/}
            {/*2<source src={videoURL} type="video/mp4"/>
            <source src={videoURL} type="video/webm"/>*/}
        
         
        
                 <div className='video-youtube-about'> 
                           <div className='video-youtube-title'>{data?.title}</div>
                       <div className='youtube-profile-block'>
                          <div className='youtube-profile-block-left'>
                            {/*
                              <Link to={'/user/7868'} className='youtube-profile-block-left-imag'>
                                <img  className ='youtube-profile-block-left-image'src={"https://bing.com/th/id/OIP.hA04LwcrDABDbCzqGof8iQHaHa?rs=1&pid=ImgDetMain"} alt="eroor"/>
                              </Link>*/}
                              <Link to={`/user/${data?.user?._id}`} className='youtube-profile-block-left-imag'>
                                <img  className ='youtube-profile-block-left-image'src={data?.user?.profilePic} alt="eroor"/>
                              </Link>
                              {/*
                              <div className='youtube-video-subview'>
                                  <div className='youtube-post-profile-name'>{"User-1"}</div>
                                  <div className='youtube-post-profile-subs'>{"2024-07-09"}</div>
                              </div>
                              */}
                              <div className='youtube-video-subview'>
                                  <div className='youtube-post-profile-name'>{data?.user?.userName}</div>
                                  <div className='youtube-post-profile-subs'>{data?.user?.createdAt.slice(0,10)}</div>
                              </div>
                            
                              <div className='subscribe-youtube'onClick={isFollow? handleUnfollow:handleFollow}>
                               {isFollow? "Following":"Follow"}
                              </div>
                       </div>
                       <div className='youtube-video-like-block'>
                          <div className='youtube-video-like-block-like' onClick={handleLike}>
                               {
                                isLike?<FavoriteBorderIcon sx={{backgroundColor:"red"}}/> :<FavoriteBorderIcon/>
                               } 
                                <div className='youtube-video-like-block-likes'>{data?.likes}</div>                       
                          </div>
                          <div className='youtube-video-divider'></div>
                          <div className='youtube-video-like-block' onClick={handleDislike}>
                            <ThumbDownOutlinedIcon/>{data?.dislikes}
                          </div>

                       </div>
                   </div>
                {/*
                             
                                <div className='youtube-video-about'>
                    <div>2024-09-25</div>
                    <div>This is Video streaming channel</div>
                 
                   </div>
                */}

                <div className='youtube-video-about'>
                    <div>{data?.createdAt.slice(0,10)}</div>
                    <div>{data?.description}</div>
                 
                </div>
                   <div className='youtube-comment-section' >
                      <div className='youtube-comment-section-title'>{comments.length} Comments</div>
                         <div className='youtube-self-comment'>
                          <img className='video-youtube-self-comment-profile' src='https://th.bing.com/th/id/OIP.Wy2uo_y-ttULYs4chLmqSAAAAA?rs=1&pid=ImgDetMain'/>
                          <div className='add-comment'>
                            <input type='text' value={message} onChange={(e)=>{setMessage(e.target.value)}} className='add-comment-input' placeholder='Add cooment'/>
                            <div className='cancel-submit-comment'>
                                  <div className='cancel-comment'>Cancel</div>
                                   <div className='cancel-comment' onClick={handleComment}>Comment</div>
                            </div>
                          </div>
                         </div>
                         <div className='youtube-other-comments'>
                            {comments.map((item,index)=>(
                                            <div className='youtube-self-comment' key={index}>
                           <        img className='video-youtube-self-comment-profile' src={item?.user?.profilePic} alt="profile"/>
                                      <div className='others-comment-section'>
                                           <div className='other-comment-section-header'>
                                                <div className='channel-name-comment'>{item?.user?.channelName}</div>
                                                <div className='comment-timing-others'>{item?.createdAt.slice(0,10)}</div>
                                           </div>
                                           <div className='other-comment-section-comment'>
                                           {item?.message}
                                           </div>
                                      </div>
                                </div>
                              
                            ))

                            }
                            
                         </div>
                   </div>
                 </div>
       </div>
       
       <ToastContainer/>
    </div>
    
  )
}

export default Video