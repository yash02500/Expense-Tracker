// User login
async function login(event){
    try{
        event.preventDefault();
        const userEmail = document.getElementById('lemail').value;
        const userPass = document.getElementById('lpass').value;

        await axios.post('http://localhost:3000/user/login', {
            email: userEmail,
            password: userPass
        }).then(res=>{
            alert(res.data.message);
            console.log("Login success");
            localStorage.setItem('token', res.data.token);
            window.location.href="addExpense.html";
        });

        document.getElementById('lemail').value = '';
        document.getElementById('lpass').value = '';

    } catch(error){
        alert("Wrong email or password");
        document.body.innerHTML=document.body.innerHTML+'<center><h4>Something Went Wrong</h4></center>';
        console.log(error);
    }
}


//Forgot password
        
async function forgot(event){
    try{
        event.preventDefault();
        const Email = document.getElementById('email').value;

        await axios.post('http://localhost:3000/user/password/forgotpassword', {
            email: Email
        }).then(res=>{
            alert(res.data.message);
            console.log("email submitted");
            // localStorage.setItem('token', res.data.token);
            window.location.href="login.html";
        });

        document.getElementById('email').value = '';

    } catch(error){
        alert("Wrong email");
        document.body.innerHTML=document.body.innerHTML+'<center><h4>Something Went Wrong</h4></center>';
        console.log(error);
    }
}
