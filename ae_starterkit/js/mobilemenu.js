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
