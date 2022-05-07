const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateid=(req, res)=>{
    try {
        const token = req.headers['authorization'];
        console.log(token);
        const userid = Number(jwt.verify(token, process.env.TOKEN_SECRET).id);
        User.findByPk(userid).then(user => {
            console.log(JSON.stringify(user));
            // req.user = user;
            return res.send({user}); 
        })
      }
     catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
      }

}
const authenticate = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        console.log(token);
        const userid = Number(jwt.verify(token, process.env.TOKEN_SECRET).id);
        // const name = String(jwt.verify(token, process.env.TOKEN_SECRET).name);
        User.findByPk(userid).then(user => {
            // console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch(err => { 
          console.log(err);
          throw new Error(err)})

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
      }

}

module.exports = {
    authenticate,authenticateid
}