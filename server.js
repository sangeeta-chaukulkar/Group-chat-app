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
const Message = require('./models/message');
const userRoutes = require('./routes/user');

User.hasMany(Message);
Message.belongsTo(User);
app.use(express.json());
app.use(userRoutes);


const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// app.use(express.static(__dirname + '/public/chatapp/'))


app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res)=>{
  res.sendFile(path.join(__dirname,`public/${req.url}`));
})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/chatapp/chatapp.html')
// })

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})