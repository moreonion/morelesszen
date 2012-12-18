function checkNarrow(){
  var size = {
    tablet: 768,
    desktop: 950
  };
  jQuery.each(size, function(cls, size) {
    if (jQuery(window).width() >= size) {
      jQuery('html').addClass(cls);
    } else {
      jQuery('html').removeClass(cls);
    }
  });
}

jQuery(window).resize(checkNarrow);
jQuery(window).ready(checkNarrow);

(function($) {
  Drupal.behaviors.mobile_menu = {};
  Drupal.behaviors.mobile_menu.attach = function(context) {
    $(':not(.six) #main-menu').before('<span id="mobile-menu-icon">Menu</span>');

    // initialize main-menu
    setMainMenuActiveState();


    $('#mobile-menu-icon').click(function(){
      var mainMenu = $('#main-menu');
      mainMenu.slideToggle(function() {
        setMainMenuActiveState();
      });
    });

    function setMainMenuActiveState() {
      var mainMenu = $('#main-menu');
      var mainMenuIcon = $('#mobile-menu-icon');
      if(mainMenu.is(':visible')) {
        mainMenuIcon.addClass('active');
      } else {
        mainMenuIcon.removeClass('active');
      }
    }
  };
})(jQuery);
