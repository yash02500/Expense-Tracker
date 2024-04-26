
document.addEventListener('DOMContentLoaded', function () {
  showData();

const expForm= document.getElementById('expForm');
expForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const amount= document.getElementById('amt').value;
    const description= document.getElementById('dec').value;
    const category= document.getElementById('choose').value;

    const expenseData={
        amount: amount,
        description: description,
        category: category
    };

    try{
        await axios.post('http://localhost:3000/expense/addingExpense', expenseData);
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
    return axios.get('http://localhost:3000/expense/getExpenses')
    .then(response=>{
        return response.data.expenses;
    }).catch(error=>{
        console.log(error);
    });
};


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

