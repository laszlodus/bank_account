const account1 = {
    name: 'Laszlo Dus',
    interest: 1.5,
    movements: [1000, -200, 550, 450, -25, -20, 100],
    movementsdates: [
        '2024-04-01T10:51:30.790Z',
        '2024-04-13T12:30:25.189Z',
        '2024-04-11T10:20:00.178Z',
        '2024-05-10T13:00:11.383Z',
        '2024-05-15T08:31:15.598Z',
        '2024-05-16T15:41:23.420Z',
        '2024-05-17T12:10:36.630Z',
    ],
    pin: 1111,
    locale: 'en-GB',
    currency: 'GBP',
};

const account2 = {
    name: 'Bob Warren',
    interest: 1.1,
    movements: [6000, -2500, -200, 60, 3580, -20, 500],
    movementsdates: [
        '2024-04-10T10:25:00.126Z',
        '2024-04-15T11:36:15.154Z',
        '2024-05-10T12:42:59.320Z',
        '2024-05-11T08:15:01.929Z',
        '2024-05-12T13:25:06.904Z',
        '2024-05-13T15:36:18.807Z',
        '2024-05-17T14:40:24.659Z',
    ],
    pin: 2222,
    locale: 'en-US',
    currency: 'USD',
};

const account3 = {
    name: 'Christina White',
    interest: 1.4,
    movements: [3500, -150, -600, 4500, -900, 650, -700],
    movementsdates: [
        '2024-04-01T08:25:00.459Z',
        '2024-04-09T09:12:02.698Z',
        '2024-05-02T10:08:52.256Z',
        '2024-05-10T11:00:59.125Z',
        '2024-05-13T12:02:48.462Z',
        '2024-05-15T13:46:24.630Z',
        '2024-05-17T14:36:26.680Z',
    ],
    pin: 3333,
    locale: 'fr-FR',
    currency: 'EUR',
};


const accounts = [account1, account2, account3];

const username = document.querySelector('.login');
const password = document.getElementById('password');
const loginButton = document.querySelector('.button');
const navContainer = document.querySelector('.navbutton');
const logOut = document.querySelector('.logout');
const error = document.getElementById('error');

const welcome = document.querySelector('.welcome');
const balance = document.querySelector('.balance_value');
const currentDate = document.querySelector('.balance_date');
const movementsIndex = document.querySelector('.movements');
const transfer = document.getElementById('texttransfer');
const transferAmount = document.getElementById('transfer_amount');
const transferButton = document.querySelector('.transfer_button');

const requestAmount = document.getElementById('request');
const requestButton = document.querySelector('.request_button');

const closeUser = document.getElementById('user');
const closePin = document.getElementById('pin');
const closeButton = document.querySelector('.close_button');

const summaryIn = document.querySelector('.summary_in');
const summaryOut = document.querySelector('.summary_out');
const summaryInterest = document.querySelector('.summary_interest');
const sortButton = document.querySelector('.sort_button');

const timer = document.querySelector('.timer');
const main = document.getElementById('main_el');

// Create Username

const createUsername = function(acc) {
  acc.forEach(el => {
  el.username = el.name
 .split(' ')
 .map(el => el[0].toLowerCase())
 .join('');
 });
 };

createUsername(accounts);

// Create timer to count back

const logOutTimer = function() {
    const timeStart = function() {

        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        // Send to UI
        timer.textContent = `${min}:${sec}`;

        // When time 0 log out user
        if(time === 0) {
            clearInterval(timerInterval);
            logOutAcc();
        };

         // Decrase time 1 sec
         time--;
    }
    // Set time 5 min
    let time = 300;

    // Call every second
    timeStart();
    const timerInterval = setInterval(timeStart, 1000);
    return timerInterval;
};



// create varianles 

let currentAccount, timerIntervalNew;

// Check timer, if run clear and restart

function clearAndStartTimer() {
     clearInterval(timerIntervalNew);
// LogOutTimer return: timeInterval = TimeIntervalNew
     timerIntervalNew = logOutTimer();
};

//Log in

loginButton.addEventListener('click', function(e) {
e.preventDefault();
currentAccount = accounts.find(acc => acc.username === username.value)

if(currentAccount?.pin === +password.value) {
    welcome.textContent = `Welcome back ${currentAccount.name}`
    main.style.opacity = 1;
    navContainer.style.opacity = 0;
    logOut.style.opacity = 1;
    username.value= '';
    password.value = '';
    error.textContent = '';

const newDate = new Date();
const options = {
     minute: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
};
currentDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(newDate);

    // Check timer
    clearAndStartTimer();

    updateAccount(currentAccount);
}
else {
    error.textContent = 'Username or Password not match!';
    username.value= '';
    password.value = '';
}
});

// Log Out

logOut.addEventListener('click', logOutAcc);   

function logOutAcc() {
        //location.reload();
    logOut.style.opacity = 0;
    navContainer.style.opacity = 1;
    main.style.opacity = 0; 
    };



// Count Date

const formatMovementDate = function(date, locale) {
    const now = new Date();
    const dayPassed = Math.round(Math.abs((now - date) / (1000 * 60 * 60 * 24)));

    if (dayPassed === 0) return 'Today';
    if (dayPassed === 1) return 'Yesterday';
    if (dayPassed <= 7) return `${dayPassed} days ago`;

    return new Intl.DateTimeFormat(locale).format(new Date(date));
};

// Format currency and movements

const formatCurrency = function(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
      }).format(value);
};
// Display movements

const displayMovements = function(acc, sort = false) {
    movementsIndex.innerHTML = '';

    const movValue = sort ? acc.sortedmov : acc.movements;
    const dateValue = sort ? acc.sorteddate : acc.movementsdates;

   movValue.forEach(function(movement, i) {
      const type = movement > 0 ? 'deposit' : 'withdrawal'; 
      const date = new Date(dateValue[i]);
      const useDate = formatMovementDate(date, acc.locale);

      const formatMovement = formatCurrency(movement, acc.locale, acc.currency);

      const html = `
      <div class="movements_list">
          <div class="movements_type_${type}">${i + 1} ${type}</div>
          <div class="movements_date">${useDate}</div>
          <div class="movements_value">${formatMovement}</div>
      </div>`;

      movementsIndex.insertAdjacentHTML("afterbegin", html);
    });
};

// Calculate balance

const CalculateBalance = function(acc) {
  acc.balance = acc.movements.reduce((sum, curr) => sum += curr,0);
  balance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
};

const updateAccount = function(acc) {
    displayMovements(acc);
    CalculateBalance(acc);
    calcSummary(acc);
    calculateInterest(acc);

};

// Calculate Summary

const calcSummary = function(acc) {
    const positive = acc.movements
    .filter(el => el > 0)
    .reduce((sum, value) => sum += value);

    summaryIn.textContent = formatCurrency(positive, acc.locale, acc.currency);

    const negative = acc.movements
    .filter(element => element < 0)
    .reduce((all, values) => all+= values);

    summaryOut.textContent = formatCurrency(Math.abs(negative), acc.locale, acc.currency);
};

// Calculate Interest - Get interest for an all deposit

const calculateInterest = function(acc) {
 const int = acc.interest;

 const interestAmount = acc.movements
 .filter(el => el > 0)
 .reduce((sum, value) => sum += value);

 const interest1 = interestAmount * int / 100;

  summaryInterest.textContent = formatCurrency(interest1, acc.locale, acc.currency);
};

// Sort
// movements change ascending order

let sort = false;
sortButton.addEventListener('click', function(e) {
    e.preventDefault();
   sort = !sort;

   if(sort) {
    sortedFun();
   } else {
    displayMovements(currentAccount, false);
   }

    // Restart timer
    clearAndStartTimer();
});

function sortedFun() {
// Put values in one array
const datesTimes = [];
for(let i = 0; i < currentAccount.movements.length; i++) {
   datesTimes.push([currentAccount.movements[i], currentAccount.movementsdates[i]]); 
};

// Sort movements ascending order
const sortDateTimes = datesTimes.sort((a,b) => a[0] - b[0]);

// Separate values
const nMovements = [];
const nDates = [];

  sortDateTimes.forEach(el => {
    nMovements.push(el[0]),
         nDates.push(el[1])}
);
currentAccount.sortedmov = nMovements;
currentAccount.sorteddate = nDates;

    displayMovements(currentAccount, true); 
};

// Transfer Money

transferButton.addEventListener('click', function(e) {
    e.preventDefault();

    const amount1 = +transferAmount.value;
    const receiver = accounts.find(el => el.username === transfer.value); 
    transferAmount.value = '';
    transfer.value = '';

      if(amount1 > 0 &&
        currentAccount.balance >= amount1 && 
        currentAccount.username !== receiver?.username) {
        currentAccount.movements.push(-amount1);
        currentAccount.movementsdates.push(new Date().toISOString());
        receiver.movements.push(amount1);
        receiver.movementsdates.push(new Date().toISOString());

        // Restart timer
        clearAndStartTimer();

        updateAccount(currentAccount);
    }
});

// Request loan

requestButton.addEventListener('click', function(e) {
e.preventDefault();
const requestSum = +requestAmount.value;

//get loan if one movement ammount >= loan of 10%
if(requestSum > 0 && currentAccount.movements.some(mov => mov >= requestSum * 0.1)) {

    // Delay a payout
    setTimeout(function() {
       // Get loan
    currentAccount.movements.push(requestSum);
    currentAccount.movementsdates.push(new Date().toISOString());


    updateAccount(currentAccount);  
    }, 2500);
    requestAmount.value = '';
    error.textContent = '';

} else {
    error.textContent = 'One of your deposit amount must bigger than 10% of loan!';
    requestAmount.value = '';
}
    // Restart timer
    clearAndStartTimer();
});

// Close Account


closeButton.addEventListener('click', function(e) {
    e.preventDefault();

    // Check user name and pin match
if(closeUser.value === currentAccount.username && +closePin.value === currentAccount.pin) {

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    closeUser.value = '';
    closePin.value = '';
    error.textContent = '';
    // Delete account

    accounts.splice(index, 1);

    main.style.opacity = 0;
    logOut.style.opacity = 0;
    navContainer.style.opacity = 1;
}
}); 