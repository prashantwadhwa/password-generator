const inputSlider = document.querySelector("#passSlider");
const lengthDisplay = document.querySelector("[data-length-num]");

const passDisplay = document.querySelector("input[passDisplay]");

const copiedMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
let indicator = document.querySelector(".indicator");
const genBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passLength = 10;
let checkCount = 0;
handleSlider();

// slider function

function handleSlider() {
  inputSlider.value = passLength;
  lengthDisplay.innerText = passLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

//Random number

function generateRandomNumber() {
  return getRndInteger(1, 10);
}

// generating symbols

const symbols = '~!@#$%^&*()_+=[]{};:"?/.,><';

function generateSymbol() {
  let randNum = getRndInteger(0, symbols.length);
  return symbols[randNum];
}

setIndicator("#808080");

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numCheck.checked) hasNum = true;
  if (symbolCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passLength >= 8) 
  
  {
    setIndicator("#0f0");
  } 
  
  else if ((hasLower || hasUpper) && (hasNum || hasSym) && passLength >= 6) 
  
  {
    setIndicator("#ff0");
  } 

  else {
    setIndicator("#f00");
  }
}

// copy button

let copyBtn = document.querySelector(".copyBtn");

async function copyFunc() {
  //copying the text

  try {
    await navigator.clipboard.writeText(passDisplay.value);
    copiedMsg.innerText = "Copied!";
  } catch (e) {
    copiedMsg.innerText = "Failed";
  }

  copiedMsg.classList.add("active");

  setTimeout(() => {
    copiedMsg.classList.remove("active");
  }, 2000);

  //alert

  alert("copied the text: " + passDisplay.value);
}

//shuffling using fisher yates method

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition

  if (password < checkCount) {
    passLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passDisplay.value) copyFunc();
});

genBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passLength < checkCount) {
    passLength = checkCount;
    handleSlider();
  }

  // generating the new password

  //remove old pass
  password = "";

  //put the checkbox items

  let funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolCheck.checked) {
    funcArr.push(generateSymbol);
  }

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining addition
  for (let i = 0; i < passLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // shuffle the pass

  password = shufflePassword(Array.from(password));

  // show in UI

  passDisplay.value = password;

  //calculate the strength

  calcStrength();
});
