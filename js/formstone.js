(function($) {
Drupal.behaviors.formstone = {};
Drupal.behaviors.formstone.attach = function(context, settings) {
  if ($.fn.selecter) {
    $('.webform-client-form select', context).selecter();
  }
  if ($.fn.picker) {
    $('.webform-client-form input[type=checkbox]', context).picker();
  }
};
})(jQuery);
