let mSelect;

//Mulch Calculation
/* Calculator */
jQuery(document).ready(function ($) {

    $('.measurements').hide();

    //on selecting rectangle shape   
    $('#shape-rect').click(function () {

        //activating the shape
        $(".mulch-shape").each(function () {
            if ($('#shape-circle').hasClass("active")) {
                $('#shape-circle').removeClass("active");
            }
        });
        $('#shape-rect').addClass('active');

        // remove any errors
        $('.mulch-result p').remove();
        $('.mulch-result h5').remove();
        $('.mulch-result img').remove();


        //reset all input values
        $('.mulch-length').val('');
        $('.mulch-width').val('');
        $('.mulch-diam').val('');
        $('.mulch-thick').val('');

        //Show measurements
        $('.measurements').show();
        $('.mulch-diam-row').addClass('hidden');
        $('.mulch-length-row').removeClass('hidden');
        $('.mulch-width-row').removeClass('hidden');
        $('.mulch-thick-row').removeClass('hidden');
        $('.last').removeClass('hidden');
        mSelect = $('#shape-rect').val();
    });
    // on selecting circle shape
    $('#shape-circle').click(function () {

        //Activating the shape
        $(".mulch-shape").each(function () {
            if ($('#shape-rect').hasClass("active")) {
                $('#shape-rect').removeClass("active");
            }
        });
        $('#shape-circle').addClass('active');

        // remove any errors
        $('.mulch-result p').remove();
        $('.mulch-result h5').remove();
        $('.mulch-result img').remove();

        //reset all input values
        $('.mulch-length').val('');
        $('.mulch-width').val('');
        $('.mulch-diam').val('');
        $('.mulch-thick').val('');


        //Show measurements
        $('.measurements').show();
        $('.mulch-length-row').addClass('hidden');
        $('.mulch-width-row').addClass('hidden');
        $('.mulch-diam-row').removeClass('hidden');
        $('.mulch-thick-row').removeClass('hidden');
        $('.last').removeClass('hidden');
        mSelect = $('#shape-circle').val();
    });


    $('.mulch-calc').click(function () {
        // remove any existing errors
        $('.mulch-result p').remove();

        // set variables      
        var mLength = $('.mulch-length').val();
        var mWidth = $('.mulch-width').val();
        var mDiam = $('.mulch-diam').val();
        var mThick = $('.mulch-thick').val();

        //set shovel image on result load
        var img = $('<img />',
            {
                id: 'mulch-image',
                src: '/images/shovel-outline.png',
                width: 100
            });


        // errors are displayed below.
        // was a shape selected?
        if (mSelect === 'rectangular') {
            if (!mLength || !mWidth || !mThick) {
                $('.mulch-result').html('<p class="alert">Please fill in all dimensions.');
            } else if (!$.isNumeric(mLength) || !$.isNumeric(mWidth) || !$.isNumeric(mThick)) {
                $('.mulch-result').html('<p class="alert">Only numeric dimensions are allowed. (Max limit = 3 digits)');
            } else if ((mLength <= 0) || (mWidth <= 0) || (mThick <= 0)) {
                $('.mulch-result').html('<p class="alert">Dimensions must not be negative or zero.');
            } else {
                var area = mLength * mWidth;// surface area
                var thick = mThick * 0.01; // converting cm to m
                var mResult = (mLength * mWidth * thick).toFixed(2);// calculate cubic m
                var bucketAmount = Math.round(mResult * 16);// calculate buckets                                             
                $('.mulch-result').html("<h5>Surface area: " + area + " square meters.<br><h5>Volume: " + mResult + " cubic meters.<br><h5> Number of 25 Kgs mulch buckets:<strong> " + bucketAmount + " Buckets.</strong><br><br>");
                $(img).css("margin-bottom", "10px");
                $('.mulch-result').prepend(img);
            }
        } else if (mSelect === 'circular') {
            if (!mDiam || !mThick) {
                $('.mulch-result').html('<p class="alert">Please fill in all dimensions.');
            } else if (!$.isNumeric(mDiam) || !$.isNumeric(mThick)) {
                $('.mulch-result').html('<p class="alert">Only numeric dimensions are allowed. (Max limit = 3 digits)');
            } else if ((mDiam <= 0) || (mThick <= 0)) {
                $('.mulch-result').html('<p class="alert">Dimensions must not be negative or zero.');
            } else {
                var radius = (mDiam / 2);
                var thick = mThick * 0.01; // converting cm to m
                var area = (radius * radius * 3.14).toFixed(2);
                var mResult = (area * thick).toFixed(2);// calculate cubic meters
                var bucketAmount = Math.round(mResult * 16);// calculate buckets                        
                $('.mulch-result').html("<h5>Surface area: " + area + " square meters.<br><h5>Volume: " + mResult + " cubic meters.<br><h5> Number of 25 Kgs mulch buckets:<strong> " + bucketAmount + " Buckets.</strong><br><br>");
                $(img).css("margin-bottom", "10px");
                $('.mulch-result').prepend(img);
            }
        }
    });
});


