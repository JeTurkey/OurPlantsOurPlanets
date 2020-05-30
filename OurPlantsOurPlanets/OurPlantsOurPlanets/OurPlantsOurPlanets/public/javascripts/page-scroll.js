
    //Get the button
var mybutton = document.getElementsByClassName('page-scroll')[0];
    
    // When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
    

function scrollFunction() {
    if (mybutton.style.display = 'none' && document.documentElement.scrollTop > 684) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
