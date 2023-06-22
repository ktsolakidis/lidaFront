const valid = document.getElementById('valid').innerHTML;
const submitButton = document.getElementById('submit');

if(valid == "false"){
    submitButton.insertAdjacentHTML('beforeend','<p id="wrongMessage"> Λάθος Όνομα χρήστη ή κωδικός. Προσπαθήστε ξανά </p>');
    document.getElementById('wrongMessage').style.color = 'red';
    document.getElementById('wrongMessage').style.display = 'block';
};