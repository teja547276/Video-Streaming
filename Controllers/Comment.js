const Comment=require('../Modals/Comment');

exports.addComment=async(req,res)=>{
    try{
       //console.log(req.user);
       let {video,message}=req.body;
       const comment= new Comment({user:req.user._id,video,message});
       await comment.save();
       res.status(201).json({
        message:"Success",
        comment
       })
    }catch(error){
        res.status(500).json({error:"server Error"});
    }
}
exports.getCommentByVideoId=async(req,res)=>{
    try{
      const {videoid}=req.params;
      //console.log(videoid);
      const comments =await Comment.find({video:videoid}).populate('user','channelName profilePic userName createdAt');//video referes all videis it is at database
       res.status(201).json({
        message:"Success",
        comments
       })
    }catch(error){
        res.status(500).json({error:"serever error"});
    }
}