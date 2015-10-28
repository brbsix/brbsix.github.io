/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    var mobile_threshold = 800;

    $(document).ready(function(){

        $(".post-content").fitVids();

        /* No effects on mobile. */
        /*if ($(window).width() > mobile_threshold) {
            $('#cover').parallax("50%", -0.3, true);
        }*/
    });

    /* No effects on mobile. */
    /*if ($(window).width() > mobile_threshold) {
        $(window).scroll(function() {
                var top = ($(window).scrollTop() > 0) ? $(window).scrollTop() : 1;
                $('.cover-content').css({opacity: 100 / top});
                $('.arrow').css({opacity: 100 / top});
        });
    }*/

    /* Scroll-down effect. */
    $('.arrow').click(function() {
        $('.post-feature-image').ScrollTo({
            duration: 500,
            easing: 'linear'
        });

        var curHeight = $('.post-feature-image').height(),
            featureImageDefaultHeight = $(window).height() / 2;

        if ((curHeight - featureImageDefaultHeight) < 10) {
            $('.post-feature-image').animate({
                height: 2 * featureImageDefaultHeight
            }, "normal");

            // Swap the arrow
            $('.arrow i')
                .removeClass('icon-arrow-down')
                .addClass('icon-arrow-up');

            $('.cover-title').css('visibility', 'hidden')
            $('.cover-description').css('visibility', 'hidden')
            $('.blog-title-source').css('visibility', 'hidden')
            $('.feature-overlay').removeClass('tinted');
        } else {
            $('.post-feature-image').animate({
                height: featureImageDefaultHeight
            }, "normal");

            // Swap the arrow
            $('.arrow i')
                .removeClass('icon-arrow-up')
                .addClass('icon-arrow-down');

            $('.cover-title').css('visibility', 'visible')
            $('.cover-description').css('visibility', 'visible')
            $('.blog-title-source').css('visibility', 'visible')
            $('.feature-overlay').addClass('tinted');
        }
        return false;
    });
}(jQuery));
