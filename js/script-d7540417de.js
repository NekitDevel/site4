"use strict";

$(function () {
  /* Inits */
  initBodyScroll();
  initLazy();
  initMore();
  /* Lazy */

  function initLazy() {
    var lazyArr = [].slice.call(document.querySelectorAll('.lazy')),
        active = false,
        threshold = 200;

    var lazyLoad = function lazyLoad(e) {
      if (active === false) {
        active = true;
        setTimeout(function () {
          lazyArr.forEach(function (lazyObj) {
            if (lazyObj.getBoundingClientRect().top <= window.innerHeight + threshold && lazyObj.getBoundingClientRect().bottom >= -threshold && getComputedStyle(lazyObj).display !== 'none') {
              if (lazyObj.dataset.src) {
                var img = new Image(),
                    src = lazyObj.dataset.src;
                img.src = src;

                img.onload = function () {
                  if (!!lazyObj.parent) {
                    lazyObj.parent.replaceChild(img, lazyObj);
                  } else {
                    lazyObj.src = src;
                  }
                };

                lazyObj.removeAttribute('data-src');
              }

              if (lazyObj.dataset.srcset) {
                lazyObj.srcset = lazyObj.dataset.srcset;
                lazyObj.removeAttribute('data-srcset');
              }

              lazyObj.classList.remove('lazy');
              lazyObj.classList.add('lazy-loaded');
              lazyArr = lazyArr.filter(function (obj) {
                return obj !== lazyObj;
              });

              if (lazyArr.length === 0) {
                document.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
                window.removeEventListener('orientationchange', lazyLoad);
              }
            }
          });
          active = false;
        }, 200);
      }
    };

    lazyLoad();
    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationchange', lazyLoad);
  }

  function initMore() {
    if (!$('[data-more-btn]')) {
      return;
    }

    $('[data-more-btn]').on('init.more click', function (event) {
      var // $container = $('[data-more-options]', $(this).parent()),
      $container = $(this).prev('.partner__box'),
          options = {},
          visible = 0,
          window_width = $(window).width(),
          $items; //options = eval('[' + $container.data('more-options') + ']')[0];

      options = $container.data('more-options') || {};

      if (event.type == 'init' && window_width > 991) {
        visible = options.init;
      } else if (event.type == 'init' && window_width > 767 && window_width <= 991) {
        visible = options.inittablet;
      } else if (event.type == 'init' && window_width <= 767) {
        visible = options.initmobile;
      } else {
        visible = window_width > 991 ? options.desktop : options.mobile;
      }

      $items = $(options.target + '[data-more-hidden]', $container);
      $items.slice(0, visible).removeAttr('data-more-hidden');
      $('html, body').animate({
        scrollTop: '+=1'
      }, 0).animate({
        scrollTop: '-=1'
      }, 0);

      if ($items.length - visible <= 0) {
        $(this).addClass('d-none');
      }
    }).trigger('init.more');
  }

  function initBodyScroll() {
    $(document).on('scroll init.scroll', function () {
      var scroll_top = $(this).scrollTop(),
          window_height = $(window).height(),
          header_height = $('.header').height(),
          $forms = $('form');
      $('body').toggleClass('page-scrolled', scroll_top > header_height);
      $forms.each(function (index, el) {
        var form_top = $(el).offset().top;
        if (form_top < 1) return;
        var form_height = $(el).height();
        $('body.page-scrolled').toggleClass('page-scrolled-on-form-' + index, scroll_top > form_top - window_height && scroll_top < form_top + form_height);
      });
    }).trigger('init.scroll');
  }
});