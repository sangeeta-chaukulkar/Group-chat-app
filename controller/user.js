const bcrypt = require('bcrypt');
const User = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group');
const userGroup = require('../models/usergroup');
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
    console.log("req.body.email",req.body);
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

exports.messages=(req,res)=>{
    const msg = req.body.msg; 
    const groupid = req.body.groupId; 
    let name=req.user.name;
    req.user.createMessage({
        message:msg,
        groupId: groupid
      })
      .then(msg => {
        return res.status(201).json({ msg, name,message: 'Message added successfully'});  
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
  
exports.getMessages=(req,res)=>{
    const Op = Sequelize.Op;
    const threshold = req.params.lastmsgid;
    Message.findAll({where: {id:{ 
      [Op.gt]: threshold
          }}})
    .then(messages => {
      return res.status(200).json({messages,success: true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
  }

exports.getGroupMessages=(req,res)=>{
    const groupid = req.params.groupid;
    Message.findAll({where: {groupid: groupid }})
    .then(messages => {
      return res.status(200).json({messages,success: true})
    })
    .catch(err => {
        return res.status(402).json({ error: err, success: false})
    })
}

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

exports.getUsername = (req, res) => {
  const id = req.params.id;
  Message.findAll({ 
    attributes:[Sequelize.fn('DISTINCT',Sequelize.col('userId')),'userId'],
    // ,'userId'
    where: { groupId: id}
    // distinct: true,
    // col: Message.userId 
  })
  .then(userId => {
    if(!userId){
      return res.status(404).json( { message: "User Not Found" });
    }
    return res.status(201).json({ userId, message: 'success'});  
    })
  .catch(err=>{
    console.log(err);
  })
}

exports.getUsers = (req, res) => {
    User.findAll()
    .then(users => {
      if(!users){
        return res.status(404).json( { message: "Users Not Available" });
      }
      return res.status(201).json({ users, message: 'success'});  
      })
    .catch(err=>{
      console.log(err);
    })
  }
 
exports.createGroup = (req, res) => {
    console.log("req.body.groupName",req.body);
    console.log("req.user.id",req.user.id);
    let userlist='';
    const groupName = req.body.groupName;
    // userlist = req.body.userlist;
    const isgroupchat=req.body.isgroupchat;
    if (req.body.alternatename){
      var alternatename=req.body.alternatename;
    }
    else{
      var alternatename=null;
    }
    console.log("userlist",userlist);
    userlist+= ";" +req.body.userlist+";"+req.user.id+ ";" ;
    console.log("userlist1",typeof(userlist));
      // Group.findOne({ where: { name: groupName } })
      // .then(group => {
      //   if(group){
      //     res.json({message:'group already exists, Please enter other group name'});
      //   }
      //   else{
          req.user.createGroup({
          name: groupName,
          alternatename:alternatename,
          isGroupChat:isgroupchat,
          userlist: userlist,
          groupAdmin: req.user.id
        })
      // }
      // })
        .then(result => {
          res.json({message:'Group created successfully'});
        })
        .catch(err => {
          console.log(err);
        });
};

exports.updategroup = (req, res) => {
  console.log("req.body.groupName",req.body);
  console.log("req.user.id",req.user.id);
  let userlist='';
  const groupName = req.body.groupName;
  userlist = req.body.userlist;
  const isgroupchat=req.body.isgroupchat;
  const groupid=req.body.groupid;
  // console.log("userlist",userlist);
  // userlist+= ";" +req.user.id+ ";" ;
  // console.log("userlist1",typeof(userlist));
    Group.findOne({ where: { id: groupid } })
    .then(group => {
      if(group){
        Group.update({
          name: groupName,
          userlist: userlist,
      },
      {where :{ id:groupid }})
    }
    })
      .then(result => {
        res.json({message:'Group information updated successfully'});
      })
      .catch(err => {
        console.log(err);
      });
};
exports.getGroup = (req, res) => {
  const id = req.params.id;
  const Op = Sequelize.Op;   
  Group.findAll({ where: {
    // [Op.or]: [
        // { groupAdmin : id},
    userlist:{[Op.like]:'%'+id+';%'}  }})
    // [Op.or]: [
    //   { groupAdmin : id}] 
      // {userlist:{[Op.like]:'%;'+id+';%'} }  ]  }})
    // { userId : id, userlist:{[Op.like]:'%'+id+'%'} }})
  .then(group => {
    if(!group){
      return res.status(404).json( { message: "group not available" });
    }
    return res.status(201).json({ group, message: 'success'});  
    })
  .catch(err=>{
    console.log(err);
  })
}

exports.getUsersByName = (req, res) => {
  const Op = Sequelize.Op; 
  const value = req.params.value;
  User.findAll({where : {name:{[Op.like]:'%'+value+'%'} } })
  .then(users => {
    if(!users){
      return res.status(404).json( { message: "Users Not Available" });
    }
    return res.status(201).json({ users, message: 'success'});  
    })
  .catch(err=>{
    console.log(err);
  })
}

exports.getOneGroupInfo = (req, res) => {
  const id = req.params.groupid;
  const Op = Sequelize.Op;   
  Group.findOne({ where: { id:id}})
    // userlist:{[Op.like]:'%'+id+';%'} 
    // [Op.or]: [
    //   { userid : id}] 
      // {userlist:{[Op.like]:'%;'+id+';%'} }  ]  }})
    // { userId : id, userlist:{[Op.like]:'%'+id+'%'} }})
  .then(group => {
    if(!group){
      return res.status(404).json( { message: "group not available" });
    }
    return res.status(201).json({ group, message: 'success'});  
    })
  .catch(err=>{
    console.log(err);
  })
}

