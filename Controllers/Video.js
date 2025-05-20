const Video=require('../Modals/Video');
exports.uploadVideo=async (req,res)=>{
          try{
            const {title,description,videoLink,videoType,thumbnail}=req.body;//geting 
            //console.log(req.user);
            const videoUpload=new Video({user:req.user._id,title,description,videoLink,videoType,thumbnail});
            //where is user value becz already user logged in 
           await videoUpload.save();
   //console.log(req.body);
   res.status(201).json({sucess:"true",videoUpload});
     }catch(error){
              res.status(500).json({error:'server error'});

          }
}
exports.getAllVideo=async(req,res)=>{
  try{
        //const videos=await Video.find();for getting all videos...if we want user videos see below
        const videos =await Video.find().populate('user','channelName profilePic userName createdAt ');
//user name is a database and i want all channelname ,profilepic and creation date ..
        res.status(201).json({sucess:"true","videos":videos});
  }catch(error){
      res.status(501).json({error:"Server Error"});
  }
}
exports.getVideoById=async (req,res)=>{
  try{

    let {id}=req.params;
    
    //const video=await Video.findById(id); this is used for video 
    //now i want channel name ,title ,user then use populate
    const video=await Video.findById(id).populate('user','channelName profilePic userName createdAt')
    res.status(201).json({sucess:"true","video":video});
  }catch(error){
    res.status(500).json({errror:"Serever Error"});
  }
}
exports.getAllVideoByUserID=async(req,res)=>{
  try{
        let {userid}=req.params;
        const video=await Video.find({user:userid}).populate('user','channelName profilePic userName createdAt about');
        res.status(201).json({sucess:"true","video":video});
        console.log(video);
  }catch(error){
    res.status(500).json({error:"Server Error"});
  }
}


// Like a video
exports.likeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Check if the user has already liked the video
        if (video.likedBy.includes(userId)) {
            return res.status(400).json({ error: "You have already liked this video" });
        }

        // Remove user from dislikedBy if they previously disliked
        if (video.dislikedBy.includes(userId)) {
            video.dislikedBy.pull(userId);
            video.dislikes -= 1;
        }

        // Add user to likedBy and increment likes
        video.likedBy.push(userId);
        video.likes += 1;

        await video.save();

        res.status(200).json({ success: true, likes: video.likes, dislikes: video.dislikes });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Dislike a video
exports.dislikeVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Check if the user has already disliked the video
        if (video.dislikedBy.includes(userId)) {
            return res.status(400).json({ error: "You have already disliked this video" });
        }

        // Remove user from likedBy if they previously liked
        if (video.likedBy.includes(userId)) {
            video.likedBy.pull(userId);
            video.likes -= 1;
        }

        // Add user to dislikedBy and increment dislikes
        video.dislikedBy.push(userId);
        video.dislikes += 1;

        await video.save();

        res.status(200).json({ success: true, likes: video.likes, dislikes: video.dislikes });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Increment view count
exports.incrementViewCount = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Check if the user has already viewed the video
        if (!video.viewedBy.includes(userId)) {
            video.viewedBy.push(userId);
            video.views += 1;
            await video.save();
        }

        res.status(200).json({ success: true, views: video.views });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};



// Add these methods to your existing Video controller

// Get total views across all videos
exports.getTotalViews = async (req, res) => {
    try {
        const videos = await Video.find({ user: req.user._id });
        const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
        res.status(200).json({ success: true, totalViews });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Get likes/dislikes statistics
exports.getLikesDislikesStats = async (req, res) => {
    try {
        const videos = await Video.find({ user: req.user._id });
        
        const stats = videos.map(video => ({
            videoId: video._id,
            title: video.title,
            likes: video.likes,
            dislikes: video.dislikes,
            likeDislikeRatio: video.likes > 0 ? (video.dislikes / video.likes) : 0
        }));
        
        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Get most watched videos
exports.getMostWatchedVideos = async (req, res) => {
    try {
        const videos = await Video.find({ user: req.user._id })
            .sort({ views: -1 })
            .limit(5)
            .populate('user', 'channelName profilePic');
            
        res.status(200).json({ success: true, videos });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Get upload history timeline
exports.getUploadHistory = async (req, res) => {
    try {
        const videos = await Video.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('title createdAt views');
            
        // Group by month/year
        const uploadHistory = videos.reduce((acc, video) => {
            const date = new Date(video.createdAt);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
            
            if (!acc[monthYear]) {
                acc[monthYear] = {
                    count: 0,
                    views: 0,
                    videos: []
                };
            }
            
            acc[monthYear].count++;
            acc[monthYear].views += video.views || 0;
            acc[monthYear].videos.push({
                title: video.title,
                views: video.views,
                date: video.createdAt
            });
            
            return acc;
        }, {});
        
        res.status(200).json({ success: true, uploadHistory });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

exports.getUserVideos = async (req, res) => {
    try {
        const videos = await Video.find({ user: req.user._id })
            .populate('user', 'channelName profilePic');
        
        res.status(200).json({ success: true, videos });
    } catch (error) {
        console.error('Error fetching user videos:', error);
        res.status(500).json({ error: "Server Error" });
    }
};