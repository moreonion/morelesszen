(function($) {
Drupal.behaviors.morelesszen_starterkit = {};
Drupal.behaviors.morelesszen_starterkit.attach = function(context, settings) {
  // scroll to top of form + padding if we are below it
  // or if we are more than the toleratedOffset above it
  if ('ajax' in settings) {
    $.each(settings.ajax, function(el) {
      var padding = 12;
      var toleratedOffeset = 50;
      if (el && el.length > 0 && Drupal.ajax[el]) {
        var oldsuccess = Drupal.ajax[el].success;

        Drupal.ajax[el].success = function (response, status) {
          oldsuccess.call(this, response, status);
          var $wrapper = $('#' + settings.ajax[el].wrapper);
          var $html = $('html');
          var diff = Math.abs($wrapper.offset().top) - Math.abs($html.offset().top);
          if (diff < 0 || Math.abs(diff) > toleratedOffeset) {
            $('html').animate({ scrollTop: ($wrapper.offset().top - padding)}, 'slow');
          }
        }
      }
    });
  }


};

})(jQuery);

(function($) {
Drupal.behaviors.mobilemenu = {};
Drupal.behaviors.mobilemenu.attach = function(context, settings) {
  if ($.fn.mobilemenu) {
    $('#main-menu', context).mobilemenu({
      dimElement: '.campaignion-dialog-wrapper',
      shiftBodyAside: true,
      animationFromDirection: 'left',
      adaptFullHeightOnResize: false
    });
  }
};
})(jQuery);

