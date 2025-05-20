import React, { useEffect } from 'react';
import { useState } from 'react';
import './Homepage.css';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import deeksha from '../Assets/deeksha.jpg';
import Hello from '../Assets/hello.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Homepage = ({ sideNavbar }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/allvideo')
      .then((res) => {
        console.log(res.data.videos);
        setData(res.data.videos);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

 

  const handleCategoryClick = (category) => {
    console.log(`Selected Category: ${category}`);
    // Implement filtering logic here
  };

  return (
    <div className={sideNavbar ? 'home-page' : 'full-home-page'}>
      
      <div className={sideNavbar ? 'home-mainpage' : 'home-mainpage-wto-link'}>
        {data?.map((item, ind) => (
          <Link key={item._id || ind} to={`/watch/${item._id}`} className="youtube-video">
            <div className="youtube-thumbnail-box">
              <img src={item.thumbnail} className="youtube-thumbnail-pic" alt="thumbnail" />
             
            </div>
            <div className="title-box">
              <div className="title-box-profile">
                <img src={item?.user?.profilePic} className="thumbnail-profile" alt="error" />
              </div>
            </div>
            <div className="title-box-title">
              <div className="title-video-title">{item?.title}</div>
              <div className="youtube-channel-name">{item?.user?.channelName}</div>
              <div className="youtube-video-views">
                <RemoveRedEyeRoundedIcon />
                {item?.views}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Homepage;