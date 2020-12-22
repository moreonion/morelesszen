(function ($) {

$(document).ready(function() {

  // Behaviors are executed in the order they are added to the behaviors object.
  // We want this behavior to execute last.
  Drupal.behaviors.webform_ajax_scroll = {};
  Drupal.behaviors.webform_ajax_scroll.attach = function(context) {
    // Scroll to top of the form + padding if we are below or more than the
    // toleratedOffset above it.
    var padding = 12;
    var toleratedOffset = 50;
    if ($(context).is('[id^=webform-ajax-wrapper]')) {
      // This is the result of an AJAX submit.
      var $wrapper = $(context);
      var wrapperTop = $wrapper.offset().top;
      var diff = wrapperTop - $(document).scrollTop();
      if (diff < 0 || diff > toleratedOffset) {
        $('body, html').animate({ scrollTop: (wrapperTop - padding)}, 'slow');
      }
    }
  };

});

}(jQuery));
