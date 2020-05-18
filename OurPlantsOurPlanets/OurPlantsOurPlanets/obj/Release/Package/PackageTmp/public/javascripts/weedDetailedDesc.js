$(document).ready(function () {

    $("#Anatomy").show();
    $("#Impact").hide();
    $("#ControlMeasures").hide();
});

$("#Anatomybutton").click(function () {
    $(".desc-content:visible").hide();
    $("#Anatomy").show();
    $(".desc").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#Impactbutton").click(function () {
    $(".desc-content:visible").hide();
    $("#Impact").show();
    $(".desc").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});

$("#ControlMethodsbutton").click(function () {
    $(".desc-content:visible").hide();
    $("#ControlMethods").show();
    $(".desc").each(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        }
    });
    $(this).parent().addClass('active');

});