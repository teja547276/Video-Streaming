const express= require("express");
const router=express.Router();
const CommentController=require('../Controllers/Comment');
const auth=require('../Middleware/Authentication')


router.post('/comment',auth,CommentController.addComment);
router.get('/comment/:videoid',CommentController.getCommentByVideoId);//no auth req required becz he sees comment


module.exports=router;