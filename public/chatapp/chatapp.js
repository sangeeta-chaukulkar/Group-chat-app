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

window.addEventListener('load', async (e)=> {
    e.preventDefault();
    const token=localStorage.getItem('token');
    let messageArea = document.querySelector('.message_area')
    await axios.get('http://localhost:3000/getUserMessages', { headers: {"authorization" : token} })
    .then(response => {
            response.data.messages.forEach(message => {
                let mainDiv = document.createElement('div')
                mainDiv.setAttribute('class','message');
                let data = `
                    <h4>${response.data.name}</h4>
                    <p>${message.message}</p>`
                mainDiv.innerHTML = data
                messageArea.appendChild(mainDiv);
            })            
    })
  });