        
async function login(event){
    try{
        event.preventDefault();
        const userEmail = document.getElementById('uemail').value;
        const userPass = document.getElementById('upass').value;

        await axios.post('http://localhost:3000/expense/login', {
            email: userEmail,
            password: userPass
        });

        alert("Login success");
        console.log("Login success");
       
        document.getElementById('uemail').value = '';
        document.getElementById('upass').value = '';

    } catch(error){
        document.body.innerHTML=document.body.innerHTML+'<h4>Something Went Wrong</h4>';
        console.log(error);
    }
}
