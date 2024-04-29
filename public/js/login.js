        
async function login(event){
    try{
        event.preventDefault();
        const userEmail = document.getElementById('lemail').value;
        const userPass = document.getElementById('lpass').value;

        await axios.post('http://localhost:3000/expense/login', {
            email: userEmail,
            password: userPass
        }).then(res=>{
            alert(res.data.message);
            console.log("Login success");
            window.location.href="addExpense.html";
            localStorage.setItem('token', res.data.token);
        });

        document.getElementById('lemail').value = '';
        document.getElementById('lpass').value = '';

    } catch(error){
        alert("Wrong email or password");
        document.body.innerHTML=document.body.innerHTML+'<center><h4>Something Went Wrong</h4></center>';
        console.log(error);
    }
}
