
const token =localStorage.getItem('token');
document.addEventListener('DOMContentLoaded', function () {

if(!token){
    alert("You need to login!!")
    window.location.href = "login.html";
}

showData();

const decode= parseJwt(token);
console.log(decode);
const isPremiumuser =decode.isPremiumuser;

if(isPremiumuser){
 premiumUser();
 showLeaderboard();
 userBalance();
}

const expForm= document.getElementById('expForm');
expForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const amount= document.getElementById('amt').value;
    const description= document.getElementById('dec').value;
    const category= document.getElementById('choose').value;
    const typeIsExp= document.getElementById('expense').checked;
    const typeIsInc= document.getElementById('income').checked;

    const expenseData={
        description: description,
        category: category,
        income: typeIsInc ? amount : 0,
        expense: typeIsExp ? amount : 0,

    };

    try{
        await axios.post('http://localhost:3000/expense/addingExpense', expenseData, {headers: {'Authorization': token }});
        showData();
        userBalance();
    }catch(error){
        console.log(error);
    }

    document.getElementById('amt').value = '';
    document.getElementById('dec').value = '';
    document.getElementById('choose').value = '';
    document.getElementById('expense').checked ='';
    document.getElementById('income').checked ='';
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
                    <td>${exp.dateOnly}</td>    
                    <td>${exp.description}</td>
                    <td>${exp.category}</td>
                    <td>${exp.income}</td>
                    <td>${exp.expense}</td>
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
}


// Download reports
async function downloadReports(){
    try {
        const res = await axios.get('http://localhost:3000/premiumFeature/downloadReport', {headers: {'Authorization': token }});
        if(res.status === 200){
            var a = document.createElement('a');
            a.href = res.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();   
        }
        else{
            alert('File not found');
        }

    } catch (error) {
        alert("File not found");
        console.error(error);
    }
}


// Download List
async function downloadList() {
    const downList = document.getElementById('downloadList');
    downList.innerHTML = ''; 
    try {
        const res = await axios.get('http://localhost:3000/premiumFeature/downloadList', { headers: { 'Authorization': token } });
        console.log(res.data);
        res.data.forEach(lists => {
            const newList = document.createElement('li');
            const link = document.createElement('a');
            link.setAttribute('href', lists.fileUrl); // Set the href attribute to the file URL
            link.setAttribute('download', ''); // Optional: if you want the file to be downloaded on click
            link.textContent = lists.fileUrl; // Text to display for the download link
            newList.appendChild(link); // Append the anchor to the list item
            downList.appendChild(newList); // Append the list item to the list
        });

    } catch (err) {
        console.error('List not found', err);
        downList.innerHTML += '<h3>List Not Found</h3>';
    }
}


// User balance
async function userBalance(){
    try{
        const res = await axios.get('http://localhost:3000/premiumFeature/balance', { headers: { 'Authorization': token } });
        const bal = document.getElementById('balance');
        bal.style.visibility = 'visible';
        let amount = res.data;

        if(amount > 0){
            bal.style.color = 'green'; // Set the color to green if the amount is positive
        } else {
            bal.style.color = 'red'; // Set the color to red if the amount is negative
        }

        bal.innerHTML = `Balance: ${'₹ '+amount}`;  

    }catch(error){
        console.log(error, 'error in fetching balance')
    }
}


// Leaderboard
function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.className = "btn btn-outline-success"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async() => {
        const leaderboardData = await axios.get('http://localhost:3000/premiumFeature/leaderboard', { headers: {"Authorization" : token} })
        console.log(leaderboardData)

        let leaderboardList = document.getElementById('leaderboard')
        leaderboardList.innerHTML += '<h2> Leaderboard </<h2>'
        leaderboardData.data.forEach((userDetails) => {
            leaderboardList.innerHTML += `<li class="list-group-item">Name - ${userDetails.name} Total Expense - ${userDetails.total_cost || 0} </li>`
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
              userBalance();
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

