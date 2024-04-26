        
async function login(event){
    try{
        event.preventDefault();
        const userEmail = document.getElementById('lemail').value;
        const userPass = document.getElementById('lpass').value;

        if (!userEmail || !userPass) {
            document.querySelector('.msg').innerHTML = "Email and password are required";
            return; 
          }

        await axios.post('http://localhost:3000/expense/login', {
            email: userEmail,
            password: userPass
        });

        alert("Login success");
        console.log("Login success");
       
        document.getElementById('lemail').value = '';
        document.getElementById('lpass').value = '';

    } catch(error){
        document.body.innerHTML=document.body.innerHTML+'<h4>Something Went Wrong</h4>';
        console.log(error);
    }
}
