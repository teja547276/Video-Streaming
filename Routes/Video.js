const express=require('express');
const router=express.Router();
const VideoController=require('../Controllers/Video')
const auth=require('../Middleware/Authentication');

router.post('/video',auth,VideoController.uploadVideo);//because authenticaion req for uploading video of a user
router.get('/allvideo',VideoController.getAllVideo);//no  authentication required because all can see videos//home videos
router.get('/getvideobyid/:id',VideoController.getVideoById);
router.get('/:userid/channel',VideoController.getAllVideoByUserID);


router.put('/like/:id', auth, VideoController.likeVideo);
router.put('/dislike/:id', auth, VideoController.dislikeVideo);
router.put('/view/:id', auth, VideoController.incrementViewCount);

// Add these new routes to your existing Video.js routes file
router.get('/analytics/views', auth, VideoController.getTotalViews);
router.get('/analytics/likes-dislikes', auth, VideoController.getLikesDislikesStats);
router.get('/analytics/most-watched', auth, VideoController.getMostWatchedVideos);
router.get('/analytics/upload-history', auth, VideoController.getUploadHistory);
router.get('/user-videos', auth, VideoController.getUserVideos);
module.exports=router;