const express=require('express');
const bcrypt = require('bcryptjs');
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const fetchUser=require('../middleware/fetchUser');
const JWT_SECRET='Learningaboutjwt';


const router=express.Router();
//Route 1 : Create a user using post "api/auth/createuser" ,No login required
router.post('/createuser',[
    body('name','Name should be at least of 3 characters').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password should be at least of 5 characters').isLength({ min: 5 })
],async (req,res)=>{
    //If there are errors return error
    const errors = validationResult(req);
    let success=false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, 'error': errors.array() });
    }
    //check whether the email exists already
    try {
      let user=await User.findOne({email: req.body.email})
      if(user){
        return res.status(400).json({success, 'error':"Email already in use"});
      }

      //password hashing
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user= await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass
      })
      const data={
        user:{
          id:user._id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success, authToken});

    } catch (error) {
      console.log(error.message);
      success=false;
      res.status(500).json({success, 'error':"Internal server error"});
    }
})

//Route 2: Authenticate a user using post "api/auth/login" ,for login
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
],async (req,res)=>{
  //If there are errors return error
  const errors = validationResult(req);
  let success=false;
  if (!errors.isEmpty()) {
    return res.status(400).json({success, 'error': errors.array()});
  }
  const {email,password}=req.body;
  try {
    let user=await User.findOne({email});
    if(!user){                 //invalid email
      return res.status(400).json({success, "error":"Please enter correct credentials"});
    }
    const passwordCompare=await bcrypt.compare(password,user.password);
    if(!passwordCompare){       //invalid password
      return res.status(400).json({success, "error":"Please enter correct credentials"});
    }
    const data={
      user:{
        id:user._id
      }
    }
    const authToken=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success,authToken});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({success, 'error':"Internal server error"});
  }
})

//Route 3: get details of logged in user "api/auth/getuser" if we have the jwt token;login required
router.post('/getuser',fetchUser,async (req,res)=>{
  try {
    const userID=req.user.id;
    const user=await User.findById(userID).select("-password");   //-password to prevent password from displaying
    res.send(user); 
  } catch (error) {
    console.log(error.message);
    res.status(400).json({success, 'error':"Internal server error"});
  }
})
module.exports=router;