const express = require('express');
const Models = require('./../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = Models.User;
const router = express.Router();

const isAuth = require('../middlewares/is-auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', async(req, res, next)=>{
  //res.status(201).json(req.body);
  //add new user and return 201
  const salt = await bcrypt.genSalt(10);
  let user = {
    first_name : req.body.first_name,
    last_name : req.body.last_name,
    email : req.body.email,
    password : await bcrypt.hash(req.body.password, salt),
    age: req.body.age,
    address: req.body.address
  };
  created_user = await User.create(user);
  res.status(201).json(created_user);
});

router.post('/login',async(req,res,next)=>{
  const user = await User.findOne({ where : {email : req.body.email }});
  if(user){
     const password_valid = await bcrypt.compare(req.body.password,user.password);
     if(password_valid){
         token = jwt.sign({ "id" : user.id,"email" : user.email,"first_name":user.first_name },'jwtsecret');
         res.status(200).json({ token : token });
     } else {
       res.status(400).json({ error : "Password Incorrect" });
     }
   
   }else{
     res.status(404).json({ error : "User does not exist" });
   }
   
   });

router.put('/update/:id', isAuth, async(req,res,next) => {
  const id = req.params.id;
  updated_user = await User.update(req.body, {
    where: { id: id }
  });
  res.status(201).json(updated_user);
})

module.exports = router;
