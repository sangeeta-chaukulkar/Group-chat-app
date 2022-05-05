const sendBtn=document.getElementById('send');
sendBtn.addEventListener('click',saveMsg);

function saveMsg(){
    const msg=document.getElementById('msg').value;
    const token=localStorage.getItem('token');
    console.log(token);
    alert(token);
    data={
        msg:msg
    }
    axios.post(`http://localhost:3000/message`,data,{headers:{'authorization':token}})
    .then(result=>{
        alert(result.data.message);
    })  
    .catch(err => {
        console.log(err)
    })
}

async function loadMessages(){
    const token=localStorage.getItem('token');
    let messageArea = document.querySelector('.message_area')
    messageArea.innerHTML='';
    const msgArray=[];
    if( localStorage.getItem('messages')== null){
        localStorage.setItem('messages','[]');
    }
    let messages= JSON.parse(localStorage.getItem('messages'));

    let lastmsgid=messages.length;
    messages.forEach(msg=>{
        let mainDiv = document.createElement('div')
        mainDiv.setAttribute('class','message');
        let data = `
            <h4>${msg.name}</h4>
            <p>${msg.message}</p>`
        mainDiv.innerHTML = data
        messageArea.appendChild(mainDiv);
    })
    if(lastmsgid=== undefined){
        lastmsgid = 0;
    }
    // let val = JSON.parse(localStorage.getItem(id));
    try{
        await axios.get(`http://localhost:3000/getUserMessages/${lastmsgid}`, { headers: {"authorization" : token} })
        .then(response => {
                response.data.messages.forEach(message => {
                    let mainDiv = document.createElement('div')
                    mainDiv.setAttribute('class','message');
                    let name=`${response.data.name}`;
                    let messag=`${message.message}`;
                    let data = `
                        <h4>${response.data.name}</h4>
                        <p>${message.message}</p>`
                    mainDiv.innerHTML = data;
                    let data1={
                        name,
                        messag
                    }
                    messages.push(data1);
                    messageArea.appendChild(mainDiv);
                })   
                localStorage.setItem('messages',messages);       
        })
    }
    catch(err){
        console.log(err);
    }  
  };

  loadMessages();
//   setInterval(loadMessages,1000);