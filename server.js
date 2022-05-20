const express = require('express')
const app = express()
const http = require('http').createServer(app)

const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
var cors = require('cors')
app.use(cors());
const User = require('./models/user');
const Group = require('./models/group');
const Message = require('./models/message');
const userGroup = require('./models/userGroup');
const userRoutes = require('./routes/user');
const { messages } = require('./controller/user');


app.use(express.json());
app.use(userRoutes);

User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.belongsToMany(Group,{through:userGroup});
Group.belongsToMany(User,{through:userGroup});
// User.hasMany(Group);



// Group.hasMany(Message,{foreignKey: "id"});
// Message.belongsTo(Group);
// User.belongsToMany(Group);
const PORT = process.env.PORT || 3000

// http.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`)
// })
// app.use(bodyParser.json());
// app.use('/upload', upload.array('uploadFile',1), (req, res, next)=> {
//   alert("File uploaded successfully to Amazon S3 Server!");
// });
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res)=>{
  res.sendFile(path.join(__dirname,`public/${req.url}`));
})



sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
     http.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })
    socket.on('join room', (roomname,cb) => {
      socket.join(roomname);
      cb(messages[roomname]);
      socket.emit('joined', messages[roomname])
  })
})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/chatapp/chatapp.html')
// })
// app.use(express.static(__dirname + '/public/chatapp/'))
