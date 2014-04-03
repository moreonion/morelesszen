
(function($) {
  $.fn.mobilemenu.defaults.onSwitchToDesktop = function () {
    var mobileMenu = $.fn.mobilemenu.$menu;

    // move search form back into tools menu
    searchForm =  $('.search-form', mobileMenu).detach();
    $('.heading-first .tools').append(searchForm);

    mobileMenu.css({minHeight: '0px'});
    // reset the display, i.e. remove the element style
    // otherwise the dropdown css in header.css will not work properly
    // after the mobilemenu was used
    $('.drop-holder', mobileMenu).css('display', '');
    mobileMenu.css('overflow', '');
  }

  $.fn.mobilemenu.defaults.beforeOpen = function (menu) {
    // move search form into mobile menu
    var searchForm =  $('.tools .search-form').detach();
    $('#nav', menu).before(searchForm);
  }

  $.fn.mobilemenu.defaults.init = function () {
    var mobileMenu = $.fn.mobilemenu.$menu;
    // add class has-submenu on li
    $('li ul', mobileMenu).closest('li').addClass('has-submenu');
    $('li.has-submenu > a', mobileMenu).append('<span class="submenu-icon">v</span>');
  }

  // // custom collapsible
  // // if the link clicked has a ul.menu sibling (i.e. a submenu)
  // // we want to show the submenu
  // $('html').on('click', '.mobilemenu-open #main-nav li a .submenu-icon', function(e) {
  //   var a = $(this).parent();
  //   var li = a.closest('li.has-submenu');
  //   var ul = a.siblings('ul');
  //   var holder = a.siblings('.drop-holder');
  //   if (holder.length > 0) {
  //     ul = $('.drop-content > ul', holder);
  //   }
  //   if (ul.length > 0) {
  //     if (ul.is(':visible')) {
  //       ul.hide();
  //       $(this).removeClass('submenu-open');
  //     } else {
  //       ul.show();
  //       $(this).addClass('submenu-open');
  //     }
  //     // lose focus
  //     a.blur();
  //     // stop propagation - we do not want to follow link when click on submenu-icon
  //     e.stopPropagation();
  //     return false;
  //   }
  // });

})(jQuery);

(function($) {
Drupal.behaviors.mobilemenu = {};
Drupal.behaviors.mobilemenu.attach = function(context, settings) {
  if ($('html').hasClass('lt-ie9')) {
    return;
  } else {
    $('#main-menu').mobilemenu({
      iconContainer: '#header',
      closeContainer: '#main-nav'
    });
  }
};
})(jQuery);
