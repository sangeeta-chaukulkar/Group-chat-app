const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const jwt = require('jsonwebtoken');
const Sequelize=require('sequelize');

exports.signup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    User.findOne({ where: { email: email } })
    .then(present => {
      if(present){
        res.json({message:'User already exists, Please Login'});
      }
     bcrypt.hash(password,12)  
      .then(hashpassword=>{
        User
      .create({
        name: name,
        email: email,
        phone: phone,
        password: hashpassword
      })
      })
      .then(result => {
        res.json({message:'Successfuly signed up'});
      })
    })
      .catch(err => {
        console.log(err);
      });
  };
  
exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ where: { email: email} })
    .then(user => {
      if(!user){
        return res.status(404).json( { message: "User Not Found" });
      }
      bcrypt.compare(password,user.password)
        .then(isMatch=>{
        if(isMatch){
            jwt.sign({id:user.dataValues.id}, process.env.TOKEN_SECRET, { expiresIn: '1800s' },(err,token)=>{
              
              res.send({token:token,message:'Login successfully'}); 
            }); 
        }
        else{
            return res.status(401).json({ message: 'User Not Authorized' });
        }
        })
      
    })
    .catch(err=>{
      console.log(err);
    })
  }
// exports.getUserMessages=(req,res)=>{
//   const name=req.user.name;
//   req.user.getMessages().then(messages => {
//     return res.status(200).json({messages, name,success: true})
//   })
//   .catch(err => {
//       return res.status(402).json({ error: err, success: false})
//   })
// }
exports.messages=(req,res)=>{
    const msg = req.body.msg; 
    req.user.createMessage({
        message:msg
      })
      .then(msg => {
        return res.status(201).json({ msg, message: 'Message added successfuly'});  
      })
      .catch(err => {
        return res.status(402).json({ message: err});
      });
  }
exports.getUserMessages=(req,res)=>{
    const name=req.user.name;
    const Op = Sequelize.Op;
    const threshold = req.params.lastmsgid;
    req.user.getMessages({where: {id:{ 
      [Op.gt]: threshold
          }}})
    .then(messages => {
      return res.status(200).json({messages, name,success: true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
  }
  // exports.getWeeklyexpenses = (req, res)=> {
    
  //   const threshold = new Date(Date.now()-7*24*60*60*1000);
  //   console.log(threshold);
  //   req.user.getExpenses({where: {createdAt:{ 
  //     [Op.gt]: threshold
  //         }}})
  //       .then(expenses => {
  //       return res.status(200).json({expenses, success: true})
  //   })
  //   .catch(err => {
  //       return res.status(402).json({ error: err, success: false})
  //   })
  // }

exports.getUser = (req, res) => {
    const id = req.params.id;

    User.findOne({ where: { id: id} })
    .then(user => {
      if(!user){
        return res.status(404).json( { message: "User Not Found" });
      }
      return res.status(201).json({ user, message: 'success'});  
      })
    .catch(err=>{
      console.log(err);
    })
  }

 

  