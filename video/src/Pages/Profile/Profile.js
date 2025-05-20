import React, {useState,useEffect}from 'react'
import './Profile.css'
import Sidenavbar from '../../Components/Sidenavbar/Sidenavbar'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {Link,useParams} from 'react-router-dom'
import axios from 'axios';
import { ListItem } from '@mui/material';
const Profile = ({sideNavbar}) => {
  const {id}=useParams();
const [data,setData]=useState([]);
const [user,setUser]=useState(null);
const fetchProfileData=async()=>{
  axios.get(`http://localhost:4000/api/${id}/channel`).then((res)=>{
     console.log(res);
     setData(res.data.video);//take care in console
     setUser(res.data.video[0]?.user);//setting videos to the user
  }).catch(err=>{
    console.log(err);
  })
  
}
useEffect(()=>{
  fetchProfileData();
},[])
  return (
    <div className='profile'>
        <Sidenavbar sideNavbar={sideNavbar}/>
         <div className={sideNavbar?'profile-page':'profile-page-inactive'}>
           <div className='profile-top-section'>
            <div className='profile-top-section-profile'>
                 <img className='profile-top-section-img' src={user?.profilePic} alt='error'/>
            </div>
            {/*
                <div className='profile-top-section-about'>
                     <div className='profile-top-section-about-name'>Coding Teja</div>
                     <div className='profile-top-section-about-info'>@teja 3 videos</div>
                     <div className='profile-top-section-info'> About Section of Channel</div>
                </div>
              */}
               <div className='profile-top-section-about'>
                     <div className='profile-top-section-about-name'>{user?.channelName}</div>
                     <div className='profile-top-section-about-info'>{user?.userName} ,{data?.length}videos</div>
                     <div className='profile-top-section-info'>{user?.about}</div>
                </div>
           </div>
           <div className='profile-videos'>
               <div className='profile-videos-title'> Videos &nbsp; <ArrowRightIcon/></div>
                 <div className='profile-videos'>
                {data.map((item,key)=>{
                  return (
                    <Link to ={ `/watch/${item._id}` }className='profile-videos-block'>
                    <div className='profile-video-thumbnail'>
                      < img src={item?.thumbnail}/>
                    </div>
                    <div className='profile-video-block-detail'>

                         <div className='profile-video-block-detail-name'>{item?.title}</div>
                         <div className='profile-video-block-detail-about'>Created at
                          {item?.createdAt.slice(0,10)}</div>
                    </div>
              </Link>
                  )
                })}
                 
                 </div>
           </div>
         </div>
    </div>
  )
}

export default Profile