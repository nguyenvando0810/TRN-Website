$(document).ready(function(){
  $('.js-home-masthead').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 8000
  });

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

  $('.header__hamburger').on('click', function () {
    $('.header__hamburger-icon').toggleClass('open');
  });

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

  $('.nav-item').find('.comparative').hide();
  var navitemFromHome = $('.js-home').parent().prev().find('.nav-item');
  navitemFromHome.find('.comparative').show();
  navitemFromHome.find('.absolute').hide();

  $('.js-group-showall').on('click', function () {
    $('.js-group-item, .js-text-all, .js-text-short').toggleClass('all');
  });

  $('.js-course-notice').slideUp();

  $('.js-role-item').on('click', function () {
    var roleItem = $(this).data('role-item');
    var itemNo;

    $('.js-role-item').removeClass('active');
    $(this).addClass('active');

    $('.js-product-item').slideUp();

    $('.js-product-item').each(function() {
      var roleProduct = $(this).data('role-product');

      if (roleItem == roleProduct) {
        $(this).slideDown();
        itemNo = 1;
      } else if (roleItem == 'all') {
        $('.js-product-item').slideDown();
        itemNo = 1;
      }
    });

    console.log(itemNo);

    if (!itemNo) {
      $('.js-course-notice').slideDown();
    } else {
      $('.js-course-notice').slideUp();
    }
  });
});