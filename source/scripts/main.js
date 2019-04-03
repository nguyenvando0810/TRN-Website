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
        breakpoint: 576,
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

  $(document).on('scroll', function () {
    var posIntro = $('#intro').offset().top;
    var scrollTop = $(window).scrollTop();
    if ( posIntro < scrollTop + 550 ) {
      $('.js-counter').each(function() {
        var $this = $(this);
        var countTo = $this.attr('data-count');

        $({ countNum: $this.text()}).animate({
          countNum: countTo
        }, {
          duration: 1000,
          easing:'linear',
          step: function() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.text(this.countNum);
          }
        });
      });
    }
  });
});