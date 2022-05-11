const socket = io();
let name1;
let textarea = document.querySelector('#msg')
let messageArea = document.querySelector('.message_area')

var createGroupDB=document.getElementById('createGroupDB');
createGroupDB.addEventListener('click',createGroup);
console.log("createGroup",createGroupDB);
var selectTagg=document.getElementById("usersInGroup");
selectTagg.addEventListener('change',addUsertoText);

const sendBtn=document.getElementById('send');
sendBtn.addEventListener('click',saveMsg);

function saveMsg(e){
    e.preventDefault();
    const msg=document.getElementById('msg').value;
    const token=localStorage.getItem('token'); 
    console.log(token);
    alert(token);
    data={
        msg:msg
    }
    axios.post(`http://localhost:3000/message`,data,{headers:{'authorization':token}})
    .then(result=>{
        sendMessage(result.data.msg.message,result.data.name);
        alert(result.data.message);
    })  
    .catch(err => {
        console.log(err)
    })
}

async function loadMessages(){
        const token=localStorage.getItem('token');
        await axios.get(`http://localhost:3000/authenticateid`,{headers:{'authorization':token}})
        .then(authid=>{
            console.log("user",authid);
            const logUserId=authid.data.user.id;
            const logUsername=authid.data.user.name;
        let sidebar=document.querySelector('.sidebar-chats');
        sidebar.innerHTML='';
        axios.get(`http://localhost:3000/getGroup/${logUserId}`) 
        .then(groups => {
            groups.data.group.forEach(grp =>{
                console.log("grp",grp);
                const groupName=grp.name;
                sidebar.innerHTML+=` <div class="sidebar-chat${grp.id}" onclick="groupchat(${grp.id},${logUserId})"> <div class="chat-info"> <h4> ${groupName}</h4>
                <p>${groupName}</p></div></div>`;
            })        
            // var lastmsgid;
            // console.log("localStorage.getItem('messages')",localStorage.getItem('messages')==null);
            // var allmessagess=JSON.parse(localStorage.getItem('messages') || '[]');
            // console.log("allmessagesssss",allmessagess, "len",allmessagess.length);
            // if(allmessagess.length > 10000){
            //     allmessagess.splice(0, 2000);
            //     localStorage.setItem('messages',JSON.stringify(allmessagess));
            // }
            // var allmessages=JSON.parse(localStorage.getItem('messages') || '[]');
            // console.log("allmessages",allmessages, "len",allmessages.length);
            // if(allmessages.length === 0){
            //     lastmsgid =0; 
            // }
            // else{
            //     msgtotal=allmessages.length;
            //     lastmsgid=allmessages[msgtotal-1].msgid;
            //     console.log("lastmsgid",lastmsgid);
            //     console.log("messages",allmessages,"lastmsgid",lastmsgid);
            //     console.log("logUsername",logUsername,"logUserId",logUserId);
            //     allmessages.forEach((msg,index)=>{
            //         if(msg.name === logUsername){
            //             appendMessage(msg, 'outgoing');
            //         }
            //         else{
            //             appendMessage(msg, 'incoming');
            //         }   
            //     })
            // }
            // if(lastmsgid === undefined){
            //     lastmsgid = 0;
            // }   
           
    })
    })
  };

setInterval(loadMessages,1000);
// loadMessages();

function sendMessage(message,name1) {
    let msg = {
        name: name1,
        message: message.trim()
    }
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()
    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.name}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}


function createGroup(e){
    e.preventDefault();
    alert("hi");
    const token=localStorage.getItem('token'); 
    var selectTags=document.getElementById("usersInGroup");
    var groupName=document.getElementById("groupName").value; 
    var addusertexts=document.getElementById("groupusers").value;
    console.log(document.getElementById('groupusers').value.split(";"));
    console.log("addusertexts",addusertexts);
    console.log("addusertexts",typeof(addusertexts));
    // addusertexts.pop();
    console.log(addusertexts);
    userlistdata={
        groupName:groupName,
        userlist:addusertexts
    }
    axios.post(`http://localhost:3000/creategroup`,userlistdata,{headers:{'authorization':token}})
    .then(result=>{
        alert(result.data.message);
        closeForm();
    })  
    .catch(err => {
        console.log(err)
    })
}
function addUsertoText(){
    var selectTaggg=document.getElementById("usersInGroup");

    var addusertext=document.getElementById('groupusers');
    console.log(addusertext);
    console.log(selectTaggg.value);
    addusertext.value +=  selectTaggg.value+";";
    console.log(addusertext.value);
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
    var selectTag=document.getElementById("usersInGroup");
    selectTag.innerHTML='';
    axios.get(`http://localhost:3000/getUsers`) 
    .then(users => {
        console.log("users.data",users.data.users);
        users.data.users.forEach(User=>{
            selectTag.innerHTML+=`<option>${User.id}</option>`;
        })
    });
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
  
function groupchat(groupid,logUserId){
    console.log("groupid",groupid);
    try{
        axios.get(`http://localhost:3000/getGroupMessages/${groupid}`)
        .then(response => {
                let messageArea = document.querySelector('.message_area');
                messageArea.innerHTML='';
                console.log("messagesss",response.data.messages.length);
                const length=response.data.messages.length;
                var messageArray=[];
                response.data.messages.forEach((message,index) => {
                    let id=`${message.userId}`;
                    axios.get(`http://localhost:3000/getUser/${id}`) 
                    .then(responseuser => {
                        const nameUser=responseuser.data.user.name;
                        let messag=`${message.message}`;
                        let idd=`${message.id}`;
                        let data1={
                            name:nameUser,
                            message:messag,
                            msgid:idd}
                        if(id === logUserId){
                            appendMessage(data1, 'outgoing');}
                        else{
                            appendMessage(data1, 'incoming');}
                        messageArray.push(data1);
                        // if(index === (length-1)){
                        //     if(allmessages === '[]'){
                        //         allmessages=messageArray;
                        //         localStorage.setItem('messages',JSON.stringify(allmessages));
                        //     }
                        //     else{
                        //         allmessages=allmessages.concat(messageArray);
                        //         localStorage.setItem('messages',JSON.stringify(allmessages));
                        //     }  
                        // }
                    })        
                })         
        })    
}
catch(err){
    console.log(err);
}  
}