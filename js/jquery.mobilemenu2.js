/*
 * TODOs
 * - customizable brakPointTestClass
 * - dim background (overlayed body grayed out)
 * - adapt css to structure/classes
 * - use more classes in corresponding css for fullheight, shift,
 * - get before events right: Promises/Deferreds
 */
(function ( $ ) {
  'use strict';
  $.fn.mobilemenu = function( options ) {

    var settings = $.extend({}, $.fn.mobilemenu.defaults, options );
    var mobileQuery = window.matchMedia('(min-width: 780px)');
    var $menu = $(this),
        $body = $('body'),
        $iconContainer = $(settings.iconContainer),
        $closeContainer = $(settings.closeContainer),
        $dim = $(settings.dimElement),
        width = $menu.innerWidth(),
        $icon,
        $close;

    $body.addClass(settings.mobileMenuEnabledClass);

    // generate buttons or use elements/containers from settings
    // default: before icon to menu, append close to menu
    if (settings.createIcon) {
      $icon = $('<a href="#">' + settings.iconText + '</a>').attr(settings.iconAttributes);
      if ($iconContainer.length > 0) {
        $iconContainer.append($icon);
      } else {
        $menu.before($icon);
      }
    } else {
      $icon = $(settings.iconElement);
    }
    if (settings.createIcon) {
      $close = $('<a href="#">' + settings.closeText + '</a>').attr(settings.closeAttributes);
      if ($closeContainer.length > 0) {
        $closeContainer.append($close);
      } else {
        $menu.append($close);
      }
    } else {
      $close = $(settings.closeElement);
    }

    // gets called when switched to mobile
    // sets up the classes, ...
    var switchToMobile = function(mql) {
      $menu.hide();
      $icon.show();
      $close.show();
      $body.addClass(settings.mobileMenuClass);

      // callback
      settings.onSwitchToMobile.call($menu, settings, mql);
    }
    // gets called when switched to desktop
    var switchToDesktop = function(mql) {
      $menu.show();
      $icon.hide();
      $close.hide();
      $body.removeClass(settings.mobileMenuClass);
      // close any open mobile menu
      menuClose();

      // callback
      settings.onSwitchToDesktop.call($menu, settings, mql);
    }

    var setMenu = function (mql) {
      if (mql.matches) {
        switchToDesktop(mql);
      } else {
        switchToMobile(mql);
      }
    }

    // menu events
    var beforeOpen = function () {
      if (settings.dimBackground) {
        $dim.show();
      }

      settings.beforeOpen.call($menu, settings);
    }
    var afterOpen = function () {
      settings.afterOpen.call($menu, settings);
    }
    var beforeClose = function () {
      settings.beforeClose.call($menu, settings);
    }
    var afterClose = function () {
      $menu.hide();
      $body.removeClass(settings.mobileMenuOpenClass);

      if (settings.dimBackground) {
        $dim.hide();
      }

      settings.afterClose.call($menu, settings);
    }
    var menuOpen = function () {
      var animation = {};
      //if (settings.adaptFullHeightOnResize) {
      //  setMainMenuMinHeight($body.innerHeight());
      //}
      if (settings.shiftBodyAside) {
        animation[settings.animationFromDirection] = '-' + width + 'px';
        $menu.css(animation).show();
        animation[settings.animationFromDirection] = width + 'px';
        $body.addClass(settings.mobileMenuOpenClass).animate(animation, settings.animationDuration, afterOpen);
      } else {
        animation[settings.animationFromDirection] = '-' + width + 'px';
        $menu.css(animation).show();
        $body.addClass(settings.mobileMenuOpenClass);
        animation[settings.animationFromDirection] = '0px';
        $menu.animate(animation, settings.animationDuration, afterOpen);
      }

      // reset to prevent unexpected reuse of former values
      animation = {};
    };
    var menuClose = function () {
      var animation = {};
      if (settings.shiftBodyAside) {
        animation[settings.animationFromDirection] = '0px';
        $body.animate(animation, settings.animationDuration, afterClose);
      } else {
        animation[settings.animationFromDirection] = '-' + width + 'px';
        $menu.animate(animation, settings.animationDuration, afterClose);
      }
      $dim.hide();

      // reset to prevent unexpected reuse of former values
      animation = {};
    };

    var clickHandler = function (e) {
      width = $('#main-menu').innerWidth();

      if ($menu.is(':visible')) {
        beforeClose();
        menuClose();
      } else {
        beforeOpen();
        menuOpen();
      }

      $(this).blur();
      e.preventDefault();
      return false;
    }

    // bind click handler 
    if ($icon.length > 0) {
      $icon.on('click.mobilemenu', clickHandler);
    }
    if ($close.length > 0) {
      $close.on('click.mobilemenu', clickHandler);
    }

    // add breakpoint listener and do inital call
    mobileQuery.addListener(function(mql) {
      setMenu(mql);
    });
    setMenu(mobileQuery);

    // init callback
    settings.init.call($menu, settings);

    // be a nice jQuery plugin and return myself
    return this;
  }


  $.fn.mobilemenu.defaults = {
    // These are the defaults.
    breakpoint: 780,
    createIcon: true,
    iconText: 'Menu',
    iconContainer: '',
    iconElement: undefined,
    iconAttributes: { id: 'mobile-menu-icon' },
    createClose: true,
    closeText: 'close',
    closeContainer: '',
    closeElement: undefined,
    closeAttributes: { id: 'mobile-menu-close' },
    mobileMenuClass: 'gone-mobile',
    mobileMenuEnabledClass: 'with-mobile-menu',
    mobileMenuOpenClass: 'mobile-menu-open',
    adaptFullHeightOnResize: false, // TODO
    animationDuration: 300,
    animationFromDirection: 'left',
    shiftBodyAside: false,
    createDim: false, // TODO
    dimBackground: true,
    dimElement: '',
    collapseSubMenus: true, // TODO
    collapsibleSubMenus: true, // TODO
    init: function() {},
    beforeOpen: function() {},
    beforeClose: function() {},
    afterOpen: function() {},
    afterClose: function() {},
    onSwitchToMobile: function() {},
    onSwitchToDesktop: function() {}
  }
}( jQuery ));
