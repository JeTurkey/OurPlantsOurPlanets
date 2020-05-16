let cSelect;

//Compost Calculation
/* Calculator */
jQuery(document).ready(function ($) {

    $('.measurements').hide();

    //on selecting rectangle shape   
    $('#shape-rect').click(function () {

        //activating the shape
        $(".comp-shape").each(function () {
            if ($('#shape-circle').hasClass("active")) {
                $('#shape-circle').removeClass("active");
            }
        });
        $('#shape-rect').addClass('active');

        // remove any errors
        $('.comp-result p').remove();
        $('.comp-result h5').remove();
        $('.comp-result img').remove();


        //reset all input values
        $('.comp-length').val('');
        $('.comp-width').val('');
        $('.comp-diam').val('');
        $('.comp-thick').val('');

        //Show measurements
        $('.measurements').show();
        $('.comp-diam-row').addClass('hidden');
        $('.comp-length-row').removeClass('hidden');
        $('.comp-width-row').removeClass('hidden');
        $('.comp-thick-row').removeClass('hidden');
        $('.last').removeClass('hidden');
        cSelect = $('#shape-rect').val();
    });
    // on selecting circle shape
    $('#shape-circle').click(function () {

        //Activating the shape
        $(".comp-shape").each(function () {
            if ($('#shape-rect').hasClass("active")) {
                $('#shape-rect').removeClass("active");
            }
        });
        $('#shape-circle').addClass('active');

        // remove any errors
        $('.comp-result p').remove();
        $('.comp-result h5').remove();
        $('.comp-result img').remove();

        //reset all input values
        $('.comp-length').val('');
        $('.comp-width').val('');
        $('.comp-diam').val('');
        $('.comp-thick').val('');


        //Show measurements
        $('.measurements').show();
        $('.comp-length-row').addClass('hidden');
        $('.comp-width-row').addClass('hidden');
        $('.comp-diam-row').removeClass('hidden');
        $('.comp-thick-row').removeClass('hidden');
        $('.last').removeClass('hidden');
        cSelect = $('#shape-circle').val();
    });


    $('.comp-calc').click(function () {
        // remove any existing errors
        $('.comp-result p').remove();

        // set variables      
        var cLength = $('.comp-length').val();
        var cWidth = $('.comp-width').val();
        var cDiam = $('.comp-diam').val();
        var cThick = $('.comp-thick').val();

        //set shovel image on result load
        var img = $('<img />',
            {
                id: 'comp-img',
                src: '/images/compost-icon.png',
                width: 100
            });


        // errors are displayed below.
        // was a shape selected?
        if (cSelect === 'rectangular') {
            if (!cLength || !cWidth || !cThick) {
                $('.comp-result').html('<p class="alert">Please fill in all dimensions.');
            } else if (!$.isNumeric(cLength) || !$.isNumeric(cWidth) || !$.isNumeric(cThick)) {
                $('.comp-result').html('<p class="alert">Only numeric dimensions are allowed.');
            } else if ((cLength <= 0) || (cWidth <= 0) || (cThick <= 0)) {
                $('.comp-result').html('<p class="alert">Dimensions must not be negative or zero.');
            } else {
                var len = cLength * 3.28084; //m to feet
                var wide = cWidth * 3.28084; // m to feet
                var area = cLength * cWidth;
                var thick = cThick * 0.393701;// cm to inches
                var cYards = (len * wide * (thick * 0.0031)).toFixed(2);// calculate cubic yards
                var cResult = (cYards * 0.76455).toFixed(2); // cubic meters              
                $('.comp-result').html("<h5>Surface Area: " + area + " square meters.<br><h5> You'll need: <strong>" + cResult + " cubic meter bags *</strong><br><br> <p> 1 cubic meter bag = 1000 Kg of compost. <br><br>");
                $(img).css("margin-bottom", "10px");
                $('.comp-result').prepend(img);
            }
        } else if (cSelect === 'circular') {
            if (!cDiam || !cThick) {
                $('.comp-result').html('<p class="alert">Please fill in all dimensions.');
            } else if (!$.isNumeric(cDiam) || !$.isNumeric(cThick)) {
                $('.comp-result').html('<p class="alert">Only numeric dimensions are allowed.');
            } else if ((cDiam <= 0) || (cThick <= 0)) {
                $('.comp-result').html('<p class="alert">Dimensions must not be negative or zero.');
            }
            else {
                var diam = cDiam * 3.28084; //m to feet 
                var radius = diam / 2; // radius in feet
                var rad = cDiam / 2; // radius in m
                var thick = cThick * 0.393701;
                var area = (3.14 * rad * rad).toFixed(2); // square meters
                var areaFeet = 3.14 * radius * radius; // square feet
                var cYards = ((areaFeet * (thick * 0.0031))).toFixed(2); // cubic yards
                var cResult = (cYards * 0.76455).toFixed(2); // cubic meters 


                $('.comp-result').html("<h5>Surface Area: " + area + " square meters.<br><h5> You'll need: <strong>" + cResult + " cubic meter bags *</strong><br><br> <p> 1 cubic meter bag = 1000 Kg of compost. <br><br>");
                $(img).css("margin-bottom", "10px");
                $('.comp-result').prepend(img);
            }
        }
    });
});


