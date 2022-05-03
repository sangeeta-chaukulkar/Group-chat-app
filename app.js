const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');


const sequelize = require('./util/database');
const app = express();
var cors = require('cors')
app.use(cors())

const userRoutes = require('./routes/user');
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);

app.use((req, res)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`));
  })

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
     app.listen(3000);;
  })
  .catch(err => {
    console.log(err);
  });
