(function($) {
Drupal.behaviors.formstone = {};
Drupal.behaviors.formstone.attach = function(context, settings) {
  if ($.fn.selecter) {
    $('.webform-client-form select', context).selecter();
    // fix for selecter not working on Android 6+ and Android Chrome 50+
    if (navigator.userAgent.match(/Android (\d+)\./i)) {
      $('.selecter').css('pointer-events', 'none');
    }
  }
  if ($.fn.picker) {
    $('.webform-client-form input[type=checkbox]', context).picker();
    $('.webform-client-form input[type=radio]', context).picker();
  }
  if ($.fn.filer) {
    $('.webform-client-form input[type=file]', context).filer();
  }
};
})(jQuery);
