
import  { useState} from 'react';
import { Route , Routes } from 'react-router-dom';
import './App.css'
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Video from './Pages/Video/Video';
import Profile from './Pages/Profile/Profile';
import VideoUpload from './Pages/VideoUpload/VideoUpload';
import SignUp from './Pages/SignUp/SignUp';
import AnalyticsDashboard from './Components/Dashboard/AnalyticsDashboard';
//import axios from 'axios';
import UserVideos from './Components/UserVideos/UserVideos'

function App() {
  const [sideNavbar,setSideNavbar]=useState(true);
  // useEffect(()=>{
  //   axios.get('http://localhost:4000/api/allvideo').then(res=>{
  //     console.log(res);
  //   }).catch(err=>{
  //     console.log(err);
  //   })
 // })//1
const setSideNavbarFunc=(value)=>{
setSideNavbar(value)
}
  return (
    <div className="App">
      
      <Navbar setSideNavbarFunc={setSideNavbarFunc} sideNavbar={sideNavbar}/>
      <Routes>
        <Route path = '/' element={<Home sideNavbar={sideNavbar}/>}/>
        <Route path='/watch/:id' element={<Video/>}/>
        <Route path='/user/:id' element={<Profile sideNavbar={sideNavbar}/>}/>
        < Route path='/:id/upload' element={<VideoUpload/>}/>
        <Route path='/signup'element={<SignUp/>}/>

            // Add this to your routes configuration
<Route path="/analytics" element={<AnalyticsDashboard sideNavbar={sideNavbar} />} />
<Route path="/your-videos" element={<UserVideos sideNavbar={sideNavbar}/>} />
// Add this route to your existing routes

      </Routes>

      

   
    </div>
  );
}

export default App;
