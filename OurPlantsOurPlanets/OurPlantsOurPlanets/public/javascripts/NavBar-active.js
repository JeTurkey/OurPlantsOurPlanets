
    $(document).ready(function() {
        var url = window.location;
        $('.m-auto li a').each(function () {
             if (this.href == url) {
        $("m-auto li").each(function () {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            }
        });
    $(this).parent().addClass('active');
}
});
});

$(document).ready(function () {
    var url1 = window.location;
    $('.m-auto li div a').each(function () {
        if (this.href == url1) {
            $("m-auto li ").each(function () {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                }
            });
            $(this).parent().parent().addClass('active');
        }
    });
});
