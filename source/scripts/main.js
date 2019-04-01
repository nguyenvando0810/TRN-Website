$(document).ready(function(){
  $('.js-home-masthead').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true
  });

  $('.js-home-feedback').slick({
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrow: false,
    dots: true
  });

  $('.header__hamburger').on('click', function () {
    $('.header__hamburger-icon').toggleClass('open');
  });
});