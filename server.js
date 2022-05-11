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
const userRoutes = require('./routes/user');

app.use(express.json());
app.use(userRoutes);

User.hasMany(Message);
Message.belongsTo(User);

User.hasMany(Group);
Group.belongsTo(User);

// Group.hasMany(Message,{foreignKey: "id"});
// Message.belongsTo(Group);
// User.belongsToMany(Group);



const PORT = process.env.PORT || 3000

// http.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`)
// })

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
})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/chatapp/chatapp.html')
// })
// app.use(express.static(__dirname + '/public/chatapp/'))
