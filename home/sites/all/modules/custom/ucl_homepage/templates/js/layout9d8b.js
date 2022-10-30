//Array of object for the carousels
globalSiteSpecificVars.carouselConfig = [{
  carouselClass: '.news__carousel .owl-carousel2',
  carouselSettings: {
    loop: false,
    margin: 10,
    responsive: {
      0: {
        items: 1,
        dots: true,
        nav: false,
        dotsContainer: '.news__mobile__controls .controls__paging'
      },
      767: {
        items: 2,
        nav: true,
        stagePadding: 50,
        dotsEach: true,
        navContainer: '.news__desktop__controls .controls__nav',
        dotsContainer: '.news__desktop__controls .controls__paging',
      }
    }
  }
}, {
  carouselClass: '.study__carousel .owl-carousel2',
  carouselSettings: {
    navSpeed: 600,
    dotsSpeed: 600,
    margin: 10,
    items: 1,
    lazyLoad: true,
    video: true,
    loop: false,
    navContainer: '.study__desktop__controls .controls__nav',
    dotsContainer: '.study__desktop__controls .controls__paging',
    responsive: {
      0: {
        dots: true,
        nav: false
      },
      767: {
        nav: true,
        stagePadding: 50
      }
    }
  }
},
{
  carouselClass: '.people__carousel .owl-carousel2',
  mobileOnly: true,
  carouselSettings: {
    margin: 10,
    items: 1,
    lazyLoad: true,
    loop: false,
    margin: 10,
    nav: false,
    dotsContainer: '.people__mobile__controls .controls__paging',
    stagePadding: 20
  }
}, {
  carouselClass: '.promotion__carousel .owl-carousel2',
  mobileOnly: true,
  carouselSettings: {
    margin: 10,
    items: 1,
    lazyLoad: true,
    loop: false,
    margin: 10,
    nav: false,
    dotsContainer: '.promotion__mobile__controls .controls__paging',
    stagePadding: 20
  }
}, {
  carouselClass: '.social__events__carousel .owl-carousel2',
  mobileOnly: true,
  carouselSettings: {
    margin: 10,
    items: 1,
    lazyLoad: true,
    loop: false,
    margin: 10,
    nav: false,
    dotsContainer: '.events__mobile__controls .controls__paging',
    stagePadding: 20
  }
}, {
  carouselClass: '.social__twitter__carousel .owl-carousel2',
  mobileOnly: true,
  carouselSettings: {
    margin: 10,
    items: 1,
    lazyLoad: true,
    loop: false,
    margin: 10,
    nav: false,
    dotsContainer: '.twitter__mobile__controls .controls__paging',
    stagePadding: 20
  }
}];

var mobileOnlyCarousel = [];

history.navigationMode = 'compatible';

jQuery(document).ready(function ($) {
  // Make study at UCL carousel accessible
  $(".study__carousel blockquote a").on({
    click: function (e) {
      e.preventDefault();
      $(this).parent().parent().parent().parent().find('.owl-video-play-icon').trigger('click');
    },
    keydown: function (e) {
      var keyCode = e.keyCode || e.which;

      if (keyCode == 9) {
        if (e.shiftKey) {
          //Focus previous input
          $('.study__carousel .owl-prev').trigger('click');
        }
        else {
          //Focus next input
          $('.study__carousel .owl-next').trigger('click');
        }
      }
    }
  });

  function mobileCarousel() {
    var resizeTimeout;
    var win = $(window);

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(function () {
      var windowWidth = win.width();
      if (windowWidth < 767) {
        mobileOnlyCarousel.forEach(function (el, i) {
          $(el.carouselClass).removeClass('owl-off');
          $(el.carouselClass).owlCarousel(el.carouselSettings);
        });
      } else {
        mobileOnlyCarousel.forEach(function (el, i) {
          $(el.carouselClass).addClass('owl-off');
          $(el.carouselClass).trigger('destroy.owl.carousel');
        });
      }
    }, 100);
  }

  function desktopCarousel() {
    if (carouselConfig.length) {
      carouselConfig.forEach(function (el, i) {

        if (el.mobileOnly) {
          mobileOnlyCarousel.push(el);
          $(el.carouselClass).addClass('owl-off');
        } else {
          $(el.carouselClass).owlCarousel(el.carouselSettings);
        }
      });
    }
  }

  if (typeof (globalSiteSpecificVars.carouselConfig) === "undefined") {
    carouselConfig = {
      stagePadding: 50,
      loop: false,
      margin: 10,
      nav: true,
      responsive: {
        0: {
          items: 2
        },
        600: {
          items: 2
        },
        1000: {
          items: 2
        }
      }
    };

    $('.owl-carousel2').owlCarousel(carouselConfig);
  } else {
    carouselConfig = (globalSiteSpecificVars.carouselConfig);

    desktopCarousel();

    mobileCarousel();

    $(window).on('resize', function () {
        desktopCarousel();
        mobileCarousel();
    })
  }

});
