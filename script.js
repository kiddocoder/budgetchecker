

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let currentdate = new Date();
let currentyear = currentdate.getFullYear();
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let month = currentdate.getMonth();
let currentmonth = months[month];

const DateContainer = document.querySelector('.header .content .currentdate .date');
DateContainer.textContent = `${currentmonth}, ${currentyear}`;

const IncomesList = document.querySelector('.results .incomeresult #incomelist');
const ExpensesList = document.querySelector('.results .expensesresult ul');

const budgetCounter = document.querySelector('.header .content .budgetcounter span');

saveAllTransactions();
handleResults();
const MyForm = document.getElementById('myform');
MyForm.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();
    const formData = new FormData(this);
    transactions.push({
        transactionid: transactions.length + 1,
        description: formData.get("description"),
        amount: parseFloat(formData.get("amount")),
        date: currentdate,
        type: formData.get("type")
    });
    this.reset();
    saveAllTransactions();
    handleResults();
}

function handleResults() {
    IncomesList.innerHTML = "";
    ExpensesList.innerHTML = "";
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="transations">
                            <span class="nameoftransaction">${transaction.description}</span>
                        </div>
                        <div class="calcul ${transaction.type === 'income' ? 'inc' : 'exp'}">
                            <span>${transaction.amount.toLocaleString('en-US')}</span>
                            <span class="percent" id="percent"></span>
                            <span class="remove" onclick="removeTransaction(${transaction.transactionid})">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15">
                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" fill="${transaction.type === 'income' ? '#31b9ae' : '#b93138'}"/>
                                </svg>
                            </span>
                        </div>`;   
        if (transaction.type === 'income') {
            IncomesList.appendChild(li);
            totalIncome +=transaction.amount;
        } else if(transaction.type === 'expense'){
            ExpensesList.appendChild(li);
            totalExpense += transaction.amount;
        }
         //calculate percent of expense and income
         const percent = document.getElementById('percent');
         const percentValue = (transaction.amount / (totalIncome + totalExpense)) * 100;
         percent.textContent = `${percentValue.toFixed(2)}%`;

    });

    const incomeValue = document.querySelector('.header .content .calculation .incomes .incomevalue');
    const expenseValue = document.querySelector('.header .content .calculation .expenses .expensescounter .expensevalue');
    const expensePercent = document.querySelector('.header .content .calculation .expenses .expensescounter .percent');
    incomeValue.textContent = totalIncome.toLocaleString('en-US');
    expenseValue.textContent = totalExpense.toLocaleString('en-US');
    const expensePercentage = totalExpense > 0 ? ((totalExpense / (totalIncome + totalExpense)) * 100).toFixed(2) : 0;
    expensePercent.textContent = `${expensePercentage}%`;

    // calculate percents of incomes and expenses
    
    const totalBudget = totalIncome - totalExpense;
    budgetCounter.textContent = totalBudget.toLocaleString('en-US');
}

function saveAllTransactions() {
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function removeTransaction(transactionId) {
    transactions = transactions.filter(transaction => transaction.transactionid !== transactionId);
    saveAllTransactions();
    handleResults();
}

console.log(transactions);
