const User=require('../Modals/User');
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");


const cookieOptions={
   httpOnly :true,
   secure:false,//set to true in Production
   sameSite:'Lax'
}
exports.signUp=async(req,res)=>{
 try{

    const {channelName,userName,about,profilePic,password}=req.body;
      const isExist=await User.findOne({userName:userName});
     // console.log(isExist);
     if(isExist){
        res.status(400).json({error:"Username Already Exits Please try with other name"});
     }else{
    let updatedPass=await bcrypt.hash(password,10);//hashed for encryption 
    const user=new User({channelName,userName,about,profilePic,password:updatedPass})
   await user.save();
      res.status(201).json({message:"User Registered Successfully",success:"yes",data:user});

     }
 }catch(err){
  res.status(400).json({error:"Server Error"});
 }
}
exports.signIn=async(req,res)=>{
    try{
           const {userName,password}=req.body;//geting from body
             const user=await User.findOne({userName});
             if(user && await bcrypt.compare(password,user.password)){
                     const tokens=jwt.sign({userId:user._id},'Its_My_Secret_Key')
                       res.cookie('tokens',tokens,cookieOptions);//save token in cookie
                    res.status(201).json({message:"Logged in Successsfully",success:"true",tokens,user});
             }else{
                res.status(400).json({error:"Invalid Credentials"})
             }
    }catch(error){
        res.status(401).json({error:"Server Error"});

    }
}
exports.logout=async(req ,res)=>{
   res.clearCookie('tokens',cookieOptions).json({message : 'Logged Out Successfully'});
}//"tokens" Same Name 

exports.followUser = async (req, res) => {
    try {
        const { id } = req.params; // ID of the user to follow
        const userId = req.userId; // ID of the logged-in user (from JWT token)

        // Check if the user is trying to follow themselves
        if (id === userId) {
            return res.status(400).json({ error: "You cannot follow yourself." });
        }

        // Add the user to the logged-in user's following list
        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                following: {
                    userId: id,
                    followedAt: Date.now()
                }
            }
        });

        // Add the logged-in user to the target user's followers list
        await User.findByIdAndUpdate(id, {
            $addToSet: {
                followers: {
                    userId: userId,
                    followedAt: Date.now()
                }
            }
        });

        res.status(200).json({ message: "Followed successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { id } = req.params; // ID of the user to unfollow
        const userId = req.userId; // ID of the logged-in user (from JWT token)

        // Remove the user from the logged-in user's following list
        await User.findByIdAndUpdate(userId, {
            $pull: {
                following: { userId: id }
            }
        });

        // Remove the logged-in user from the target user's followers list
        await User.findByIdAndUpdate(id, {
            $pull: {
                followers: { userId: userId }
            }
        });

        res.status(200).json({ message: "Unfollowed successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
};
exports.getUserActivity = async (req, res) => {
    try {
      const userId = req.user._id; // From auth middleware
  
      // Fetch user's videos
      const videos = await Video.find({ user: userId });
      const totalLikes = videos.reduce((sum, video) => sum + (video.likes || 0), 0);
  
      // Fetch total comments across all videos
      const videoIds = videos.map((video) => video._id);
      const comments = await Comment.find({ video: { $in: videoIds } });
      const totalComments = comments.length;
  
      // Fetch user creation date
      const user = await User.findById(userId);
  
      res.status(200).json({
        success: true,
        totalLikes,
        totalComments,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error('Error fetching user activity:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  };

  
 