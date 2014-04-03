
(function($) {
Drupal.behaviors.mobilemenu = {};
Drupal.behaviors.mobilemenu.attach = function(context, settings) {
  if ($('html').hasClass('lt-ie9')) {
    return;
  } else {
    $('#main-menu', context).mobilemenu({
      beforeOpen: function (settings) {
        // test before call
        console.log(this);
      }
    });
  }
};
})(jQuery);
