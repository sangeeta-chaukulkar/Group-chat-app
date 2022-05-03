const bcrypt = require('bcrypt');
const User = require('../models/user');

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
  