const socket = io();
let name1;
let textarea = document.querySelector('#msg')
let messageArea = document.querySelector('.message_area')

var createGroupDB=document.getElementById('createGroupDB');
createGroupDB.addEventListener('click',createGroup);
console.log("createGroup",createGroupDB);


const searchInput=document.getElementById("search");
const searchfriend=document.getElementById("searchfriend");
var list=document.getElementById("list");
list.innerHTML='';
var usersInGroup=document.getElementById("usersInGroup");
usersInGroup.innerHTML='';
function setList(group){
    clearList();
    const logusername =localStorage.getItem('logusername'); 
    for (const user of group){
        let item=document.createElement('li');
        item.classList.add(`list-group-item${user.id}`);
        let text=document.createTextNode(user.name);
        item.appendChild(text);
        item.addEventListener('click', async () => {
            try{
                userlistdata={
                    groupName:user.name,
                    isgroupchat:false,
                    alternatename:logusername,
                    userlist:user.id
                }
                const token=localStorage.getItem('token'); 
                await axios.post(`http://localhost:3000/creategroup`,userlistdata,{headers:{'authorization':token}})
                .then(result=>{
                    alert(result.data.message);
                })  
            }
            catch(err) {
              console.log(err)};
          });
        list.appendChild(item);
    }
    if(group.length === 0){
        setNoResults();
    }
}
function clearList(){
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }
}
function setNoResults(){
    let item=document.createElement('li');
    item.classList.add('list-group-item');
    const text=document.createTextNode('No results found');
    item.appendChild(text);
    list.appendChild(item);

}
searchInput.addEventListener('input',async (e)=>{
    let value=e.target.value;
    if(value && value.trim().length > 0){
        value=value.trim().toLowerCase();
        await axios.get(`http://localhost:3000/getUsersByName/${value}`)
        .then(usernames => {
            setList(usernames.data.users);      
        })
    }
    else{
        clearList();
    }
})

function clearLists(){
    while(usersInGroup.firstChild){
        usersInGroup.removeChild(usersInGroup.firstChild);
    }
}
function setListt(group){
    var addusertext=document.getElementById('groupusers');
    var groupusersid=document.getElementById('groupusersid');
    if( groupusersid.value === ''){
        groupusersid.value=';';
    }
    for (const user of group){
        let item=document.createElement('li');
        item.classList.add(`list-group-item${user.id}`);
        let text=document.createTextNode(user.name);
        item.appendChild(text);
        item.addEventListener('click', async () => {
            try{
                console.log(addusertext);
                addusertext.value +=  `${user.name}`+" ";
                groupusersid.value += `${user.id}`+";";
                console.log(addusertext.value);
            }
            catch(err) {
              console.log(err)};
          });
        usersInGroup.appendChild(item);
    }
    if(group.length === 0){
        setNoResult();
    }
}

function setNoResult(){
    let item=document.createElement('li');
    item.classList.add('list-group-item');
    const text=document.createTextNode('No results found');
    item.appendChild(text);
    usersInGroup.appendChild(item);
}
searchfriend.addEventListener('input',async (e)=>{
    let value=e.target.value;
    if(value && value.trim().length > 0){
        value=value.trim().toLowerCase();
        await axios.get(`http://localhost:3000/getUsersByName/${value}`)
        .then(usernames => {
            setListt(usernames.data.users);      
        })
    }
    else{
        clearLists();
    }
})



const sendBtn=document.getElementById('send');
sendBtn.addEventListener('click',saveMsg);

function saveMsg(e){
    e.preventDefault();
    const msg=document.getElementById('msg').value;
    const token=localStorage.getItem('token'); 
    const groupid=localStorage.getItem('groupid'); 
    console.log(token);
    data={
        msg:msg,
        groupId:groupid
    }
    axios.post(`http://localhost:3000/message`,data,{headers:{'authorization':token}})
    .then(result=>{
        sendMessage(result.data.msg.message,result.data.name);
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
            localStorage.setItem('logUserId',logUserId); 
            localStorage.setItem('logusername',logUsername); 
        let sidebar=document.querySelector('.sidebar-chats');
        sidebar.innerHTML='';
        axios.get(`http://localhost:3000/getGroup/${logUserId}`) 
        .then(groups => {
            console.log("groups",groups);
        // const groups = getGroups(logUserId);
        // console.log("groups5",groups);
            groups.data.group.forEach(grp =>{
                console.log("grp",grp);
                const groupName=grp.name; 
                let userlist=[];
                userlist=grp.userlist.split(";");
                userlist.pop();
                console.log("userlistsplit",typeof(userlist));
                console.log("sidebar.innerHTML",sidebar.innerHTML);
                console.log("grp.isGroupChat",grp.isGroupChat);
                if (grp.isGroupChat === false){
                    if( grp.groupAdmin === logUserId){
                        sidebar.innerHTML+=`<div class="sidebar-chat${grp.id}" onclick="groupchat(${grp.id},${logUserId})"> <div class="chat-info"> <h4> ${grp.name}</h4>
                        <p>${grp.name}</p></div></div>`;
                    }
                    else{
                        sidebar.innerHTML+=`<div class="sidebar-chat${grp.id}" onclick="groupchat(${grp.id},${logUserId})"> <div class="chat-info"> <h4> ${grp.alternatename}</h4>
                        <p>${grp.alternatename}</p></div></div>`;
                    }
                    // axios.get(`http://localhost:3000/getUsername/${grp.id}`) 
                    // .then(username => {
                    //     console.log("username of group",username.data.userId);
                    //     username.data.userId.forEach(userdata =>{
                    //         if (userdata.userId !== logUserId){
                    //             axios.get(`http://localhost:3000/getUser/${userdata.userId}`) 
                    //             .then(userinfo => {
                    //             sidebar.innerHTML+=`<div class="sidebar-chat${grp.id}" onclick="groupchat(${grp.id},${logUserId})"> <div class="chat-info"> <h4> ${userinfo.data.user.name}</h4>
                    //             <p>${userinfo.data.user.name}</p></div></div>`;
                    //             });
                    //         }
                    //     })
                    // })
                }
                else{
                    sidebar.innerHTML+=`<div class="sidebar-chat${grp.id}" onclick="groupchat(${grp.id},${logUserId})"> <div class="chat-info"> <h4> ${groupName}</h4>
                <p>${groupName}</p></div></div>`;
                }
                // <div ><button id="edit${grp.id}" onclick="open()">Edit</button></div>
                // <div ><button id="edit${grp.id}" onclick="openGroupForm(${logUserId},${grp.id},${grp.name},${grp.isGroupChat},${grp.groupAdmin})">Edit</button></div></div>`;
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
async function getGroups(logUserId){
    console.log("inside getgroup",logUserId);
    await axios.get(`http://localhost:3000/getGroup/${logUserId}`) 
        .then(groups => {
            console.log("inside getgroup",groups.data.group);
            const groupsdata=groups.data.group;
            return groupsdata;
        })
        .catch(err => {
            console.log(err)
        })
}
function getOneGroupInfo(groupid){
    axios.get(`http://localhost:3000/getOneGroupInfo/${groupid}`) 
    .then(groups => {
        return groups;
    })
    .catch(err => {
        console.log(err)
    })

}
setInterval(loadMessages,1000);
// loadMessages();
async function groupchat(groupid,logUserId){
    console.log("groupid",groupid);
    localStorage.setItem('groupid',groupid); 
    await axios.get(`http://localhost:3000/getOneGroupInfo/${groupid}`) 
    .then(groups => {
        try{
        axios.get(`http://localhost:3000/getGroupMessages/${groupid}`)
        .then(response => {
                let userArea = document.querySelector('.message-header-content');
                console.log("userArea",userArea);
                userArea.innerHTML='';
                if (groups.data.group.isGroupChat === false){
                    if( groups.data.group.groupAdmin === logUserId){
                        userArea.innerHTML+=`<h4>${groups.data.group.name}</h4>
                        <div id="changegrp"> <button id="modifygroup">Modify Group</button>
                        </div>`;
                    }
                    else{
                        userArea.innerHTML+=`<h4>${groups.data.group.alternatename}</h4>
                        <div id="changegrp"> <button id="modifygroup">Modify Group</button>
                        </div>`;
                    }
                }
                else{
                    userArea.innerHTML+=`<h4>${groups.data.group.name}</h4>
                    <div id="changegrp"><button id="modifygroup">Modify Group</button>
                    </div>`;
                }
                let modifygroup = document.querySelector('#modifygroup');
                console.log("modifygroup",modifygroup);
                modifygroup.addEventListener('click',openGroupForms => {
                        console.log(groups.data.group.groupAdmin);
                        if (logUserId === groups.data.group.groupAdmin){
                            document.getElementById("myForm").style.display = "block";
                            document.getElementById("createGroupDB").style.display = "none";
                            document.getElementById('groupusersid').value='';
                            document.getElementById('searchfriend').value='';
                            clearLists();
                            var selectTag=document.getElementById("groupName");
                            selectTag.value=groups.data.group.name;
                            var addusertext=document.getElementById('groupusers');
                            addusertext.value=' ';
                            var groupusersids=document.getElementById('groupusersid');
                            groupusersids.value=groups.data.group.userlist;
                            const userar=[];
                            userarr=groupusersids.value.split(";");
                            console.log("userarr",userarr); 
                            userarr.forEach((userlist) => {
                                console.log("userlist",userlist);
                                axios.get(`http://localhost:3000/getUser/${userlist}`) 
                                .then(responseuser => {
                                    addusertext.value += ' '+responseuser.data.user.name;
                                    console.log("responseusersss",responseuser.data.user.name);
                                })
                            })

                            let updatebtn=document.getElementById("updateGroupDB");
                            updatebtn.addEventListener('click',(e)=>{
                                e.preventDefault();
                                var updatedselectTag=document.getElementById("groupName").value;
                                var groupusersid=document.getElementById('groupusersid').value;
                                userlistdata={
                                    groupid:groups.data.group.id,
                                    groupName:updatedselectTag,
                                    isgroupchat:groups.data.group.isGroupChat,
                                    userlist:groupusersid
                                }
                                console.log("userlistdata",userlistdata);
                                const token=localStorage.getItem('token'); 
                                axios.put(`http://localhost:3000/updategroup`,userlistdata,{headers:{'authorization':token}})
                                .then(result=>{
                                    console.log("result55",result);
                                    alert(result.data.message);
                                    closeForm();
                                })  
                                .catch(err => {
                                    console.log(err)
                                })
                            })   
                        }
                        else{
                            alert("You don't have access to do changes")
                        }
                });
                let messageArea = document.querySelector('.message_area');
                messageArea.innerHTML='';
                console.log("messagesss",response.data.messages.length);
                const length=response.data.messages.length;
                var messageArray=[];
                response.data.messages.forEach((message,index) => {
                    let id=`${message.userId}`;
                    const logUserId =localStorage.getItem('logUserId');
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
                    })        
                })         
        })    
}
catch(err){
    console.log(err);
}  
    })
}

function sendMessage(message,name1) {
    let msg = {
        name: name1,
        message: message.trim()
    }
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()
    // Send to server 
    socket.emit('message', msg);
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

function open(){
        document.getElementById("edit1").style.color = "red";
}
function createGroup(e){
    e.preventDefault();
    const token=localStorage.getItem('token'); 
    var selectTags=document.getElementById("usersInGroup");
    var groupName=document.getElementById("groupName").value; 
    var addusertexts=document.getElementById("groupusers").value;
    var groupusersid=document.getElementById('groupusersid').value;
    console.log(document.getElementById('groupusers').value.split(";"));
    console.log("addusertexts",addusertexts);
    console.log("addusertexts",typeof(addusertexts));
    console.log(addusertexts);
    userlistdata={
        groupName:groupName,
        isgroupchat:true,
        userlist:groupusersid
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
    document.getElementById("updateGroupDB").style.display = "none";
    document.getElementById('groupusersid').value='';
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
  
function openGroupForm(logUserId,id,groupName,isGroupChat,groupAdmin){
    if (logUserId === groupAdmin){
        document.getElementById("myForm").style.display = "block";
        document.getElementById("createGroupDB").style.display = "none";
        var selectTag=document.getElementById("usersInGroup").value;
        selectTag.text=groupName;
        var addusertext=document.getElementById('groupusers');
        addusertext.value=userlist;
        var updatedselectTag=document.getElementById("usersInGroup").value;
        var updatedaddusertext=document.getElementById('groupusers').value;
        userlistdata={
            groupName:updatedselectTag,
            isgroupchat:isGroupChat,
            userlist:updatedaddusertext
        }
    }
    else{
        alert("You don't have access to do changes")
    }
}