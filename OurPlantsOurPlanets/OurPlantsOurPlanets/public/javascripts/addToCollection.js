console.log('Client-side code running');

$('#addButton').click(function (e) {
    e.preventDefault();
});

function addToColl(val) {
    let content = { 'name': val };
    fetch('/searchPlants/clicked', {
        method: 'POST',
        body: JSON.stringify(content),
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },// string or object
        credentials: 'same-origin'
    }).then(function (response) {
        if (response.ok) {
            console.log('click was recorded');
            return;
        }
        throw new Error('Request failed.');
    })
        .catch(function (error) {
            console.log(error);
        });
       
}

const button = document.getElementById('myButton');
button.addEventListener('click', function (e) {
    console.log('button was clicked');
    let content = { some: 'content' };
    fetch('/clicked', { method: 'POST', body: JSON.stringify(content) })
        .then(function (response) {
            if (response.ok) {
                console.log('click was recorded');
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function (error) {
            console.log(error);
        });
});