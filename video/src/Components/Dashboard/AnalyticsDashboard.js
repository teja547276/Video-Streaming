import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';
import './AnalyticsDashboard.css';
import Sidenavbar from '../Sidenavbar/Sidenavbar';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsDashboard = ({sideNavbar}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        likesDislikes: [],
        mostWatched: [],
        uploadHistory: {}
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                
                // Fetch all analytics data
                const [viewsRes, likesRes, watchedRes, historyRes] = await Promise.all([
                    axios.get('http://localhost:4000/api/analytics/views', { withCredentials: true }),
                    axios.get('http://localhost:4000/api/analytics/likes-dislikes', { withCredentials: true }),
                    axios.get('http://localhost:4000/api/analytics/most-watched', { withCredentials: true }),
                    axios.get('http://localhost:4000/api/analytics/upload-history', { withCredentials: true })
                ]);
                
                setStats({
                    totalViews: viewsRes.data.totalViews,
                    likesDislikes: likesRes.data.stats,
                    mostWatched: watchedRes.data.videos,
                    uploadHistory: historyRes.data.uploadHistory
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                toast.error('Failed to load analytics data');
                setLoading(false);
            }
        };
        
        fetchAnalytics();
    }, []);

    const renderOverview = () => (
        <div className="analytics-overview">
            <div className="stat-cards">
                <div className="stat-card">
                    <h3>Total Views</h3>
                    <p>{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Videos</h3>
                    <p>{stats.likesDislikes.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Avg. Views</h3>
                    <p>{stats.likesDislikes.length > 0 
                        ? Math.round(stats.totalViews / stats.likesDislikes.length).toLocaleString() 
                        : 0}</p>
                </div>
            </div>
            
            <div className="charts-row">
                <div className="chart-container">
                    <h3>Most Watched Videos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.mostWatched.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="chart-container">
                    <h3>Top Videos by Engagement</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.likesDislikes.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="title" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="likes" fill="#82ca9d" />
                            <Bar dataKey="dislikes" fill="#ff8042" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const renderLikesDislikes = () => (
        <div className="analytics-section">
            <h2>Likes & Dislikes Analytics</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats.likesDislikes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="title" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="likes" fill="#82ca9d" />
                        <Bar dataKey="dislikes" fill="#ff8042" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="stats-table">
                <table>
                    <thead>
                        <tr>
                            <th>Video</th>
                            <th>Likes</th>
                            <th>Dislikes</th>
                            <th>Like/Dislike Ratio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.likesDislikes.map((video, index) => (
                            <tr key={index}>
                                <td>{video.title}</td>
                                <td>{video.likes}</td>
                                <td>{video.dislikes}</td>
                                <td>{video.likeDislikeRatio.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderMostWatched = () => (
        <div className="analytics-section">
            <h2>Most Watched Videos</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={stats.mostWatched}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="views"
                            nameKey="title"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {stats.mostWatched.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className="stats-table">
                <table>
                    <thead>
                        <tr>
                            <th>Video</th>
                            <th>Views</th>
                            <th>Upload Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.mostWatched.map((video, index) => (
                            <tr key={index}>
                                <td>{video.title}</td>
                                <td>{video.views}</td>
                                <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderUploadHistory = () => {
        const historyData = Object.entries(stats.uploadHistory).map(([monthYear, data]) => ({
            monthYear,
            count: data.count,
            views: data.views
        }));

        return (
            <div className="analytics-section">
                <h2>Upload History Timeline</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={historyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="monthYear" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" />
                            <Line type="monotone" dataKey="views" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="timeline-details">
                    {Object.entries(stats.uploadHistory).map(([monthYear, data]) => (
                        <div key={monthYear} className="timeline-month">
                            <h3>{monthYear}</h3>
                            <p>Videos Uploaded: {data.count}</p>
                            <p>Total Views: {data.views}</p>
                            <div className="month-videos">
                                {data.videos.map((video, index) => (
                                    <div key={index} className="video-item">
                                        <span>{video.title}</span>
                                        <span>{video.views} views</span>
                                        <span>{new Date(video.date).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading analytics...</div>;
    }

    return (
        <div className="analytics-dashboard">
              <Sidenavbar sideNavbar={sideNavbar}/>
            <div className="analytics-header">
                <h1>Channel Analytics</h1>
                <div className="analytics-tabs">
                    <button 
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={activeTab === 'likes' ? 'active' : ''}
                        onClick={() => setActiveTab('likes')}
                    >
                        Likes/Dislikes
                    </button>
                    <button 
                        className={activeTab === 'watched' ? 'active' : ''}
                        onClick={() => setActiveTab('watched')}
                    >
                        Most Watched
                    </button>
                    <button 
                        className={activeTab === 'history' ? 'active' : ''}
                        onClick={() => setActiveTab('history')}
                    >
                        Upload History
                    </button>
                </div>
            </div>
            
            <div className="analytics-content">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'likes' && renderLikesDislikes()}
                {activeTab === 'watched' && renderMostWatched()}
                {activeTab === 'history' && renderUploadHistory()}
            </div>
            
            <ToastContainer />
        </div>
    );
};

export default AnalyticsDashboard;