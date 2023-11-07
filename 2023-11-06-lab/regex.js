
var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail (email) {
  if (emailPattern.test(email)) {
    return true;
  } else {
     return false;
  }
}
console.log("email", validateEmail("example@gmail.com"))
console.log("email", validateEmail("example@gmail"))
console.log("email", validateEmail("examplegmail.com"))

var phoneNumberPattern= /^(?:\+1|1)?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})$/;

function validatePhoneNumber (phoneNumber) {
  if (phoneNumberPattern.test(phoneNumber)) {
    return true;
  } else {
     return false;
  }
}
console.log("phoneNumber", validatePhoneNumber("9785347990"))
console.log("phoneNumber", validatePhoneNumber("+19785347990"))
console.log("phoneNumber", validatePhoneNumber("97853"))

function isValidEmail(url) {
    // Regular expression for a well-formed email address
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return urlRegex.test(url);
  }
  
  // Example usage with two email addresses
  const urlAddresses = ['http://google.com', 'google.com'];
  
  urlAddresses.forEach((url) => {
    if (isValidEmail(url)) {
      console.log(`${url} is a valid url address.`);
    } else {
      console.log(`${url} is not a valid url address.`);
    }
  });
  