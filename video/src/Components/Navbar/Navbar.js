import React, { useState, useEffect } from 'react';
import './Navbar.css';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Trending
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { Link, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';

const Navbar = ({ setSideNavbarFunc, sideNavbar }) => {
  const [navbarModal, setNavbarModal] = useState(false);
  const [login, setLogin] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleprofile = () => {
    let userId = localStorage.getItem('userId'); // Refer login.js
    navigate(`/user/${userId}`);
    setNavbarModal(false);
  };

  const setLoginModal = () => {
    setLogin(false);
  };

  const onclickPopOption = (button) => {
    setNavbarModal(false);
    if (button == 'login') {
      setLogin(true);
    } else {
      localStorage.clear();
      getLogoutFunc();
      setTimeout(() => {
        // After logging out
        navigate('/');
        window.location.reload();
      }, 2000);
    }
  };

  const getLogoutFunc = async () => {
    axios
      .post('http://localhost:4000/auth/logout', {}, { withCredentials: true })
      .then((resp) => {
        console.log('Logged Out Successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let userProfilePic = localStorage.getItem('userProfilePic'); // See this in application after console
    setLoggedIn(localStorage.getItem('userId') !== null ? true : false); // Refer Login.js
    if (userProfilePic !== null) setUserPic(userProfilePic);
  }, []);

  const handleClickModal = () => {
    setNavbarModal((prev) => !prev);
  };

  const sidenavbarFunc = () => {
    setSideNavbarFunc(!sideNavbar);
  };

  const handleSearch = () => {
    const searchQuery = document.querySelector('.navbar-Input').value;
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const [userPic, setUserPic] = useState(
    'https://th.bing.com/th/id/OIP.Wy2uo_y-ttULYs4chLmqSAAAAA?rs=1&pid=ImgDetMain'
  );
// Add this useEffect to lock body scroll when modal is open
useEffect(() => {
  if (navbarModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
  return () => {
    document.body.style.overflow = 'auto'; // Cleanup
  };
}, [navbarModal]);
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-Ham" onClick={sidenavbarFunc}>
          <MenuIcon sx={{ color: 'white' }} />
        </div>
        <Link to="/" className="navbar-youtubeImg">
          <WhatshotIcon sx={{ fontSize: '34px' }} className="navbar-youtubeImage" />
          <div className="navbar-title">Video.com</div>
        </Link>
      </div>
      <div className="navbar-middle">
        <div className="navbar-search">
          <input type="text" placeholder="Search" className="navbar-Input" />
          <div className="search-Icon" onClick={handleSearch}>
            <SearchIcon sx={{ color: 'white', fontSize: '28px' }} />
          </div>
        </div>
      </div>
      <div className="navbar-right">
        <Link to="/763/upload">
          <VideoCallIcon sx={{ fontSize: '30px', cursor: 'pointer', color: 'white' }} />
        </Link>
        <img onClick={handleClickModal} src={userPic} className="navbar-right-logo" alt="logo" />
        {navbarModal && (
          <div className="navbar-modal">
            {isLoggedIn && (
              <div className="navbar-modal-option" onClick={handleprofile}>
                Profile
              </div>
            )}
            {!isLoggedIn && (
              <div className="navbar-modal-option" onClick={() => onclickPopOption('login')}>
                Login
              </div>
            )}
            {isLoggedIn && (
              <div className="navbar-modal-option" onClick={() => onclickPopOption('logout')}>
                Logout
              </div>
            )}
          </div>
        )}
      </div>
      {login && <Login setLoginModal={setLoginModal} />}
    </div>
  );
};

export default Navbar;