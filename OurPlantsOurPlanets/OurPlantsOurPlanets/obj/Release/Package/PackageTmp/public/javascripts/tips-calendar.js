


////Hide all months show only current month
//$(document).ready(function () {
//    $("#january").hide();
//    $("#february").hide();
//    $("#march").hide();
//    $("#april").show();
//    $("#mays").hide();
//    $("#june").hide();
//    $("#july").hide();
//    $("#august").hide();
//    $("#september").hide();
//    $("#october").hide();
//    $("#november").hide();
//    $("#december").hide();
//});



//Switch between months
$(document).ready(function () {

    $("#january").hide();
    $("#february").hide();
    $("#march").hide();
    $("#april").show();
    $("#mays").hide();
    $("#june").hide();
    $("#july").hide();
    $("#august").hide();
    $("#september").hide();
    $("#october").hide();
    $("#november").hide();
    $("#december").hide();
});


$("#jan").click(function () {
    $(".month-content:visible").hide();
    $("#january").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});


$("#feb").click(function () {
    $(".month-content:visible").hide();
    $("#february").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#mar").click(function () {
    $(".month-content:visible").hide();
    $("#march").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#apr").click(function () {
    $(".month-content:visible").hide();
    $("#april").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

$("#may").click(function () {
    $(".month-content:visible").hide();
    $("#mays").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

$("#jun").click(function () {
    $(".month-content:visible").hide();
    $("#june").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

$("#jul").click(function () {
    $(".month-content:visible").hide();
    $("#july").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

$("#aug").click(function () {
    $(".month-content:visible").hide();
    $("#august").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

$("#sep").click(function () {
    $(".month-content:visible").hide();
    $("#september").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

$("#oct").click(function () {
    $(".month-content:visible").hide();
    $("#october").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

$("#nov").click(function () {
    $(".month-content:visible").hide();
    $("#november").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

$("#dec").click(function () {
    $(".month-content:visible").hide();
    $("#december").show();
    $(".months").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');
});

