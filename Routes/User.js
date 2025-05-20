// Backend/Routes/User.js
const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/User');
const auth=require('../Middleware/Authentication');
router.post("/signup", UserController.signUp);
router.post('/login', UserController.signIn);
router.post('/logout', UserController.logout);
router.put('/follow/:id',auth, UserController.followUser); // Follow a user
router.put('/unfollow/:id',auth, UserController.unfollowUser); // Unfollow a user


module.exports = router;