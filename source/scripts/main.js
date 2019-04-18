$(document).ready(function(){
  // masthead slider
  $('.js-home-masthead').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 8000
  });

  // feedback slider
  $('.js-home-feedback').slick({
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  // mobile toggle nvbar button
  $('.header__hamburger').on('click', function () {
    $('.header__hamburger-icon').toggleClass('open');
  });

  // scrollpy & animation
  $('.js-scroll-trigger').on('click', function () {
    var target = $(this.hash);

    if ( $(window).width() < 992 ) {
      var offsetHeight = 76;
    } else {
      var offsetHeight = 85;
    }

    $('html, body').animate({
      scrollTop: (target.offset().top - offsetHeight)
    }, 800);

    $(this).addClass('active');
    $(this).parent().siblings().find('.js-scroll-trigger').removeClass('active');
  });

  // info counter
  $('.js-counter').each(function() {
    var $this = $(this);
    var countTo = $this.attr('data-count');

    $({ countNum: $this.text()}).animate({
      countNum: countTo
    }, {
      duration: 1000,
      easing: 'linear',
      step: function() {
        $this.text(Math.floor(this.countNum));
      },
      complete: function() {
        $this.text(this.countNum);
      }
    });
  });

  // clarify navbar between homepage & others
  $('.nav-item').find('.comparative').hide();
  var navitemFromHome = $('.js-home').parent().prev().find('.nav-item');
  navitemFromHome.find('.comparative').show();
  navitemFromHome.find('.absolute').hide();

  // button show more/show less - group section
  $('.js-group-showall').on('click', function () {
    $('.js-group-item, .js-text-all, .js-text-short').toggleClass('all');
  });

  // courses tab
  $('.js-course-notice').hide();
  $('.js-role-item').on('click', function () {
    var roleItem = $(this).data('role-item');
    var itemNo;

    $('.js-role-item').removeClass('active');
    $(this).addClass('active');

    $('.js-product-item').hide();

    $('.js-product-item').each(function() {
      var roleProduct = $(this).data('role-product');

      if (roleItem == roleProduct) {
        $(this).show();
        itemNo = 1;
      } else if (roleItem == 'all') {
        $('.js-product-item').show();
        itemNo = 1;
      }
    });

    if (!itemNo) {
      $('.js-course-notice').show();
    } else {
      $('.js-course-notice').hide();
    }
  });
});