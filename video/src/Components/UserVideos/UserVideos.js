import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserVideos.css';
import Sidenavbar from '../Sidenavbar/Sidenavbar';

const UserVideos = ({sideNavbar}) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/user-videos', {
                    withCredentials: true
                });
                setVideos(res.data.videos);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user videos:', error);
                setLoading(false);
            }
        };

        fetchUserVideos();
    }, []);
    // Add this useEffect at the top of your component
useEffect(() => {
  document.body.classList.add('user-videos-page');
  return () => {
    document.body.classList.remove('user-videos-page');
  };
}, []);

    if (loading) {
        return <div className="loading">Loading your videos...</div>;
    }

    return (
        <div className="user-videos-container">
              <Sidenavbar sideNavbar={sideNavbar}/>
            <h2>Your Videos</h2>
            
            {videos.length > 0 ? (
                <div className="videos-grid">
                    {videos.map(video => (
                        <div 
                            key={video._id} 
                            className="video-card"
                            onClick={() => navigate(`/video/${video._id}`)}
                        >
                            <div className="thumbnail-container">
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title} 
                                    className="video-thumbnail"
                                />
                                <div className="video-duration">3:45</div> {/* Add actual duration if available */}
                            </div>
                            <div className="video-info">
                                <h3 className="video-title">{video.title}</h3>
                                <p className="video-stats">
                                    {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-videos">
                    <p>You haven't uploaded any videos yet.</p>
                    <button 
                        className="upload-btn"
                        onClick={() => navigate('/763/upload')}
                    >
                        Upload Your First Video
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserVideos;