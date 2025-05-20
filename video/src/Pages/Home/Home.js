import React from 'react'
import './Home.css'
import Sidenavbar from '../../Components/Sidenavbar/Sidenavbar'
import Homepage from '../../Components/Homepage/Homepage'

const Home = ({sideNavbar}) => {
  return (
    <div className='Home'>
        <Sidenavbar sideNavbar={sideNavbar}/>
        <Homepage sideNavbar={sideNavbar}/>
    </div>
  )
}

export default Home