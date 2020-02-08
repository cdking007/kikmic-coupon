var myInput = document.getElementById("password");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var spl1 = document.getElementById("spl1");
console.log(spl1);
console.log("connected!");
// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
};

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
};

let lc = false,
  uc = false,
  nm = false,
  ln = false;
// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if (myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
    lc = true;
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if (myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
    uc = true;
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if (myInput.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
    nm = true;
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Validate length
  if (myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
    ln = true;
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }

  let splChars = /(?=.*\@|\#\,|\:|\<|\>|\[|\]|\{|\}|\`|\'|\;|\)|\@|\&|\$|\#|\%)/;
  if (myInput.value.match(splChars)) {
    spl1.classList.remove("invalid");
    spl1.classList.add("valid");
  } else {
    spl1.classList.remove("valid");
    spl1.classList.add("invalid");
  }
};

const mySignUpForm = document.getElementById("signup");
