
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

$('nav .dropdown').hover(function () {
    var $this = $(this);
    // 	 timer;
    // clearTimeout(timer);
    $this.addClass('show');
    $this.find('> a').attr('aria-expanded', true);
    // $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
    $this.find('.dropdown-menu').addClass('show');
}, function () {
    var $this = $(this);
    // timer;
    // timer = setTimeout(function(){
    $this.removeClass('show');
    $this.find('> a').attr('aria-expanded', false);
    // $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
    $this.find('.dropdown-menu').removeClass('show');
    // }, 100);
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
