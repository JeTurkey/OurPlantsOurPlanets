console.log('Client-side code running');

$('#addButton').click(function (e) {
    e.preventDefault();
});

setTimeout(function () {
    $("#overlay").delay(2000).fadeOut(300);
}, 1000);

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

function addToColl(val) {
    let content = { 'name': val };
    document.getElementById("overlay").style.display = "block";
    $("#overlay").delay(2000).fadeOut(300);
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