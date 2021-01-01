console.log('js is working');


const errorMessage = document.querySelector(".form-group[data-group-id='middleName']");
console.log(errorMessage);


setTimeout( function(){
    errorMessage.classList.add('error');
}, 2000);