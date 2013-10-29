/*
 * TODOs
 * - customizable brakPointTestClass
 * - animate from left
 * - dim background (overlayed body grayed out)
 * - adapt css to structure/classes
 * - use more classes in corresponding css for fullheight, shift,
 *   left/right possibilities
 */
(function ( $ ) {
  $.fn.mobilemenu = function( options ) {
    var breakPointPassed;

    // This is the easiest way to have default options.
    var settings = $.extend({}, $.fn.mobilemenu.defaults, options );

    // save myself
    $.fn.mobilemenu.$menu = this;

    // generate buttons hidden
    if (settings.createIcon) {
      $.fn.mobilemenu.$icon = $('<a href="#">' + settings.iconText + '</a>').attr(settings.iconAttributes);
      $(settings.iconContainer).append($.fn.mobilemenu.$icon);
      $.fn.mobilemenu.$icon.hide();
    }
    else {
      // TODO
    }
    if (settings.createIcon) {
      $.fn.mobilemenu.$close = $('<a href="#">' + settings.closeText + '</a>').attr(settings.closeAttributes);
      this.prepend($.fn.mobilemenu.$close);
      $.fn.mobilemenu.$close.hide();
    }
    else {
      // TODO
    }

    // collapse submenus
    if (settings.collapseSubMenus) {
      $('ul ul', this).hide();
    }

    // init callback
    settings.init.call();

    $(window).load(function() {
      // show icons on mobile version
      if (!settings.breakPointTest()) {
        $.fn.mobilemenu.$icon.show();
        $.fn.mobilemenu.$close.show();
      }

    });


    // reset the visibility when we hit the breakpoint 'desktop'
    $(window).resize(function() {

      var mobileMenu = $.fn.mobilemenu.$menu;
      var $body = $('body');

      // % on padding will change the main-nav size --> recalc
      if (settings.adaptFullHeightOnResize) {
        if ($body.hasClass(settings.mobileMenuOpenClass)) {
          var mobileMenuWidth = mobileMenu.innerWidth();
          setMainMenuMinHeight($body.innerHeight());

          if (settings.shiftBodyAside) {
            $body.css({right: mobileMenuWidth + 'px'});
            mobileMenu.css({right: '-' + mobileMenuWidth + 'px'});
          }
        }
      }

      // make sure icon and close button are visible when on mobile
      if (!breakPointPassed && !settings.breakPointTest()) {
        $.fn.mobilemenu.$icon.show();
        $.fn.mobilemenu.$close.show();
      }
      // we switch from mobile/tablet to desktop
      if (!breakPointPassed && settings.breakPointTest()) {
        $.fn.mobilemenu.$icon.hide();
        $.fn.mobilemenu.$close.hide();
        mobileMenu.show();

        $body.removeClass(settings.mobileMenuOpenClass);

        // reset element style on mobilemenu caused from mobilemenu init
        if (settings.collapseSubMenus || settings.collapsibleSubMenus) {
          $('ul ul', mobileMenu).css('display', '');
        }

        if (settings.shiftBodyAside) {
          $body.css({right: '0px'});
        }

        breakPointPassed = true;
        // fire callback
        settings.onSwitchToDesktop.call();
      }
      // we switch from desktop to tablet/mobile
      if (breakPointPassed && !settings.breakPointTest()) {
        $.fn.mobilemenu.$icon.show();
        $.fn.mobilemenu.$close.show();
        mobileMenu.hide();

        // reset element style on mobilemenu caused from mobilemenu init
        if (settings.collapseSubMenus) {
          $('ul ul', mobileMenu).hide();
        }

        breakPointPassed = false;
        // fire callback
        settings.onSwitchToMobile.call();
      }
    });

    // define click handler
    var clickHandler = function (e) {
      var mobileMenu = e.data.self;
      var mobileMenuWidth = mobileMenu.innerWidth();
      var $body = $('body');

      if (mobileMenu.is(':visible')) {
        e.data.settings.beforeClose.call(e.data.self);

        if (settings.shiftBodyAside) {
          $body.animate({right: '0px'}, 300, function() {
            mobileMenu.hide();
            $body.removeClass(e.data.settings.mobileMenuOpenClass);

            e.data.settings.afterClose.call(e.data.self);
          });
        }
        else {
          mobileMenu.animate({right: '-' + mobileMenuWidth + 'px'}, 300, function() {
            mobileMenu.hide();
            $body.removeClass(e.data.settings.mobileMenuOpenClass);

            e.data.settings.afterClose.call(e.data.self);
          });
        }
      } else {
        e.data.settings.beforeOpen.call(e.data.self);

        if (settings.adaptFullHeightOnResize) {
          setMainMenuMinHeight($body.innerHeight());
        }
        if (settings.shiftBodyAside) {
          mobileMenu.css({right: '-' + mobileMenuWidth + 'px'}).show();
          $body.addClass(e.data.settings.mobileMenuOpenClass).animate({right: mobileMenuWidth + 'px'}, 300, function() {
            e.data.settings.afterOpen.call(e.data.self);
          });
        }
        else {
          mobileMenu.css({right: '-' + mobileMenuWidth + 'px'}).show();
          $body.addClass(e.data.settings.mobileMenuOpenClass);
          mobileMenu.animate({right: '0px'}, 300, function() {
            e.data.settings.afterOpen.call(e.data.self);
          });
        }
      }

      $(this).blur();
      e.preventDefault();
      return false;
    }

    // bind click handler 
    $.fn.mobilemenu.$icon.on('click', {self: this, settings: settings}, clickHandler);
    $.fn.mobilemenu.$close.on('click', {self: this, settings: settings}, clickHandler);

    // collapsible links/submenus in mobilemenu
    // if the link clicked has a ul.menu sibling (i.e. a submenu)
    // we want to show the submenu
    if (settings.collapsibleSubMenus) {
      $('li a', this).click(function(e) {
        var $a = $(this);
        var $li = $a.closest('li');
        if (!settings.breakPointTest()) {
        console.log('click');
          var $ul = $a.siblings('ul');
          if ($ul.length < 1) {
            $ul = $li.find('ul').first();
          }
          if ($ul.length > 0) {
            if ($ul.is(':visible')) {
              $ul.hide();
              $li.removeClass('submenu-open');
            } else {
              $ul.show();
              $li.addClass('submenu-open');
            }

            // lose focus
            $a.blur();
            // stop propagation - we do not want to follow link when click on submenu-icon
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
            e.preventDefault();
            e.stopPropagation();
      });
    }

    // private utility function
    function setMainMenuMinHeight(pixel) {
      var mobileMenu = $.fn.mobilemenu.$menu;
      var paddingTop = parseInt(mobileMenu.css('padding-top'), 10);
      var paddingBottom = parseInt(mobileMenu.css('padding-bottom'), 10);
      mobileMenu.css({minHeight: (pixel - paddingTop - paddingBottom) + 'px', maxHeight: (pixel - paddingTop - paddingBottom) + 'px', overflow: 'auto'});
    }

    // return myself to be chainable
    return this;
  };

  $.fn.mobilemenu.breakPointPassedTestByClass = function (argument) {
    // TODO: let defaults be overridden
    classToTestFor = argument || $.fn.mobilemenu.defaults.breakPointClass;
    return $('body').hasClass(classToTestFor);
  }

  $.fn.mobilemenu.defaults = {
    // These are the defaults.
    createIcon: true,
    iconText: 'Menu',
    iconContainer: '',
    iconElement: '', // TODO
    iconAttributes: { id: 'mobilemenu-icon' },
    createClose: true,
    closeText: 'close',
    closeContainer: '',
    closeElement: '', // TODO
    closeAttributes: { id: 'mobilemenu-close' },
    mobileMenuOpenClass: 'mobilemenu-open',
    breakPointClass: 'sevensome', // TODO
    adaptFullHeightOnResize: true,
    shiftBodyAside: true,
    dimBackground: false, // TODO
    collapseSubMenus: true,
    collapsibleSubMenus: true, // TODO
    breakPointTest: $.fn.mobilemenu.breakPointPassedTestByClass,
    init: function() {},
    beforeOpen: function() {},
    beforeClose: function() {},
    afterOpen: function() {},
    afterClose: function() {},
    onSwitchToMobile: function() {},
    onSwitchToDesktop: function() {}
  }
}( jQuery ));

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


  if ($('html').hasClass('lt-ie9')) {
    return;
  } else {
    $('#main-nav').mobilemenu({
      breakPointClass: 'sevensome',
      iconContainer: '.heading-first .page-section',
      closeContainer: '#main-nav'
    });
  }

})(jQuery);

