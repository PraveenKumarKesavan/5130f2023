document.getElementById('feedbackForm').addEventListener('submit', function(event){
    event.preventDefault();

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var feedback = document.getElementById('feedback').value;

    console.log('Name:', username);
    console.log('Email:', email);
    console.log('Feedback:', feedback);

    // Here you can add your logic to send the feedback to a server
    // or perform other actions with the data
    alert('Thank you for your feedback, ' + username + '!');
});
