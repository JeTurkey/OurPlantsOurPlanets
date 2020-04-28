//Switch between months
$(document).ready(function () {

    $("#1").show();
    $("#2").hide();
    $("#3").hide();
    $("#4").hide();
    $("#5").hide();
    $("#6").hide();
    $("#7").hide();
    $("#8").hide();
    $("#9").hide();
    $("#10").hide();
    $("#11").hide();
    $("#12").hide();
    $("#1n").show();
    $("#1nn").show();
    $("#2n").hide();
    $("#3n").hide();
    $("#4n").hide();
    $("#5n").hide();
    $("#6n").hide();
    $("#7n").hide();
    $("#8n").hide();
    $("#9n").hide();
    $("#10n").hide();
    $("#11n").hide();
    $("#12n").hide();
});


$("#1button").click(function () {
    $(".number-content:visible").hide();
    $("#1").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#2button").click(function () {
    $(".number-content:visible").hide();
    $("#2").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#3button").click(function () {
    $(".number-content:visible").hide();
    $("#3").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#4button").click(function () {
    $(".number-content:visible").hide();
    $("#4").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#5button").click(function () {
    $(".number-content:visible").hide();
    $("#5").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#6button").click(function () {
    $(".number-content:visible").hide();
    $("#6").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#gbutton").click(function () {
    $(".alphabet-content:visible").hide();
    $("#g").show();
    $(".alphabet").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#7button").click(function () {
    $(".number-content:visible").hide();
    $("#7").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#8button").click(function () {
    $(".number-content:visible").hide();
    $("#8").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#9button").click(function () {
    $(".number-content:visible").hide();
    $("#9").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#10button").click(function () {
    $(".number-content:visible").hide();
    $("#10").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});






$("#11button").click(function () {
    $(".number-content:visible").hide();
    $("#11").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});


$("#12button").click(function () {
    $(".number-content:visible").hide();
    $("#12").show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});
function paginateWeed(val) {
    if (val.endsWith("n")) {
        if (val.endsWith("nn")) {
            $(".number-content2:visible").hide();
        } else {
            $(".number-content1:visible").hide();
        }
    } else {
        $(".number-content:visible").hide();
        }
    $("#" + val).show();
    $(".number").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $("#" + val + "button").parent().addClass('active');
}
