(function($) {
Drupal.behaviors.formstone = {};
Drupal.behaviors.formstone.attach = function(context, settings) {

  if ($.fn.selecter) {
    var $selects = $('.webform-client-form select', context).selecter();
    fixDisabledState($selects, $.fn.selecter, ".selecter");

    // fix for selecter not working on Android 6+ and Android Chrome 50+
    if (navigator.userAgent.match(/Android (\d+)\./i)) {
      $('.selecter').css('pointer-events', 'none');
    }
  }

  if ($.fn.picker) {
    $picks = $('.webform-client-form input[type=checkbox], .webform-client-form input[type=radio]', context).picker();
    fixDisabledState($picks, $.fn.picker, ".picker");
  }

  if ($.fn.filer) {
    $uploads = $('.webform-client-form input[type=file]', context).filer();
    fixDisabledState($uploads, $.fn.filer, ".filer");
  }

  /* Observe when disabled state changes (e.g. when using webform conditionals)
     and change the state of formstone fields accordingly.
     If the browser does not support Mutation Observer, disabled formstone
     fields are not styled differently, so they look normal when enabled. */
  function fixDisabledState ($elements, formstoneFunction, formstoneClass) {
    if (Modernizr.mutationobserver) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.target.disabled != $(mutation.target).data("previousDisabled")){
            formstoneFunction.call($(mutation.target), mutation.target.disabled ? "disable" : "enable");
            $(mutation.target).data("previousDisabled", mutation.target.disabled);
          }
        });
      });
      $elements.each(function () {
        $(this).data("previousDisabled", this.disabled);
        observer.observe(this, {attributes: true, attributesFilter: ['disabled']});
      });

    } else {
      $(formstoneClass + ".disabled").removeClass("disabled");
    }
  }
};

})(jQuery);
