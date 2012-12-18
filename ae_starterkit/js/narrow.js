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
$(':not(.six) #main-menu').before('<span class="button" id="mobile-menu-icon">Mobile Menu</span>');
$('#mobile-menu-icon').click(function(){
    $('#main-menu').slideToggle();
  });

};
})(jQuery);
