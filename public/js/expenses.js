
const token =localStorage.getItem('token');
document.addEventListener('DOMContentLoaded', function () {

showData();

const decode= parseJwt(token);
console.log(decode);
const isPremiumuser =decode.isPremiumuser;

if(isPremiumuser){
 premiumUser();
 showLeaderboard();  
}

const expForm= document.getElementById('expForm');
expForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const amount= document.getElementById('amt').value;
    const description= document.getElementById('dec').value;
    const category= document.getElementById('choose').value;

    const expenseData={
        amount: amount,
        description: description,
        category: category,
    };

    try{
        await axios.post('http://localhost:3000/expense/addingExpense', expenseData, {headers: {'Authorization': token }});
        showData();
    }catch(error){
        console.log(error);
    }

    document.getElementById('amt').value = '';
    document.getElementById('dec').value = '';
    document.getElementById('choose').value = '';

  })
});


// Fetch expenses
function getExpenses(){
    return axios.get('http://localhost:3000/expense/getExpenses', {headers: {'Authorization': token }})
    .then(response=>{
        return response.data.expenses;
    }).catch(error=>{
        console.log(error);
    });
};


// parse jwt
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


// display expenses on the page
function showData(){
    getExpenses()
    .then(data=>{
        const tableBody= document.getElementById('expTable');
        tableBody.innerHTML='';
        if(data && data.length>0){
            data.forEach(exp=>{
                const newExp= document.createElement('tr');
                newExp.dataset.id= exp.id;
                newExp.innerHTML=`
                    <td>${exp.amount}</td>
                    <td>${exp.description}</td>
                    <td>${exp.category}</td>
                    <td><button class="btn btn-danger delete-btn">Delete</button></td>`;
                    tableBody.appendChild(newExp);
            });
        }
        else{
            console.log('Expense data missing');
        }
    }).catch(error=>{
        console.log(error);
    });
}


// premium membership message
function premiumUser(){
    document.getElementById('premium').style.display = 'none';
    document.getElementById('message').innerHTML = 'Congratulations! You are now a premium member';
}


// Leaderboard
function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Leaderboard'
    inputElement.onclick = async() => {
        const leaderboardData = await axios.get('http://localhost:3000/premiumFeature/leaderboard', { headers: {"Authorization" : token} })
        console.log(leaderboardData)

        let leaderboardList = document.getElementById('leaderboard')
        leaderboardList.innerHTML += '<h1> Leader Board </<h1>'
        leaderboardData.data.forEach((userDetails) => {
            leaderboardList.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.total_cost || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}


// Deleting expense
document.getElementById("expTable").addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
      const row = event.target.closest("tr");
      const expenseId = row.dataset.id; 
      axios.delete(`http://localhost:3000/expense/deleteExpense/${expenseId}`, {headers: {'Authorization': token}})
          .then(() => {
              row.remove();
          })
          .catch(err => {
              console.error(err);
          });
  }
});


// Razorpay 
document.getElementById('premium').onclick = async function(e){
    const response = await axios.get('http://localhost:3000/premium/premiumMembership', {headers: {'Authorization': token }});
    console.log(response);

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response){
            await axios.post('http://localhost:3000/premium/updateTransactionStatus', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
        }, {headers: {'Authorization': token }});

        alert('You are now a premium member');
        premiumUser();
        localStorage.setItem('token', res.data.token)
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function(response){
    console.log(response);
    alert('Payment failed');
  });

}