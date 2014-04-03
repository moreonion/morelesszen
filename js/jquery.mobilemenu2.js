/*
 * TODOs
 * - customizable brakPointTestClass
 * - dim background (overlayed body grayed out)
 * - adapt css to structure/classes
 * - use more classes in corresponding css for fullheight, shift,
 */
(function ( $ ) {
  $.fn.mobilemenu = function( options ) {

    var settings = $.extend({}, $.fn.mobilemenu.defaults, options );
    var $self = $(this);

    // generate buttons hidden
    if (settings.createIcon) {
    console.log('create');
      $.fn.mobilemenu.$icon = $('<a href="#">' + settings.iconText + '</a>').attr(settings.iconAttributes);
      $(settings.iconContainer).append($.fn.mobilemenu.$icon);
      //$.fn.mobilemenu.$icon.hide();
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

  }

  $.fn.mobilemenu.defaults = {
    // These are the defaults.
    breakpoint: 400,
    breakpointTest: function () {},
    createIcon: true,
    iconText: 'Menu',
    iconContainer: '',
    iconElement: '', // TODO
    iconAttributes: { id: 'mobile-menu-icon' },
    createClose: true,
    closeText: 'close',
    closeContainer: '',
    closeElement: '', // TODO
    closeAttributes: { id: 'mobile-menu-close' },
    mobileMenuOpenClass: 'mobile-menu-open',
    adaptFullHeightOnResize: true,
    animationDuration: 300,
    animationFromDirection: 'right',
    shiftBodyAside: true,
    dimBackground: false, // TODO
    collapseSubMenus: true,
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
