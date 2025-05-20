import React from 'react';
import './Sidenavbar.css';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import HistoryIcon from '@mui/icons-material/History';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { Link } from 'react-router-dom';
const Sidenavbar = ({ sideNavbar }) => {
  return (
    <div className={sideNavbar ? 'home-side-navbar' : 'home-side-navbar-hide'}>
      <div className={`home-side-navbar-top`}>
        <div className="home-side-navbar-top-option">
      <Link to='/'> <HomeIcon />   
          <div className="home-side-navbar-top-option-title">Home</div>
          </Link>
        </div>
        
      </div>
      <div className="home-sidenavbar-middle">
       
        <Link to="/analytics" className={`home-side-navbar-top-option`}>
          <RecentActorsIcon />
          <div className="home-side-navbar-top-option-title">Dashboard</div>
        </Link>
        
        <Link to="/your-videos" className={`home-side-navbar-top-option`}>
          <SmartDisplayOutlinedIcon />
          <div className="home-side-navbar-top-option-title">Your Videos</div>
        </Link>
       
      </div>
    </div>
  );
};

export default Sidenavbar;