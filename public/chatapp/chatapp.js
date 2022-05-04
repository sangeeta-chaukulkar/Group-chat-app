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