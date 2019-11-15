(function($) {
Drupal.behaviors.formstone = {};
Drupal.behaviors.formstone.attach = function(context, settings) {

  function cssExclude(components) {
    function addNot(cssClass) {
      return ':not(' + cssClass +')';
    }
    return components.map(addNot).join('');
  }

  if ($.fn.selecter) {
    var excludedComponents = ['.webform-component-autocomplete'];
    var $selects = $('.webform-component' + cssExclude(excludedComponents) + ' select', context).selecter();
    fixDisabledState($selects, $.fn.selecter, ".selecter");

    // fix for selecter not working on Android 6+ and Android Chrome 50+
    if (navigator.userAgent.match(/Android (\d+)/i)) {
      $('.selecter').css('pointer-events', 'none');
    }
  }

  if ($.fn.picker) {
    var $picks = $('.webform-client-form input[type=checkbox], .webform-client-form input[type=radio]', context).picker();
    fixDisabledState($picks, $.fn.picker, ".picker");
  }

  if ($.fn.filer) {
    // Add filer to all file uploads in webforms.
    // - Do this even when only part of the form are AJAX replaced. This means
    //   the context is a sub-element of the form.
    // - Avoid doing it twice when the behavior gets an extra call with the form
    //   as context.
    var $uploads = $('input[type=file]', context).filter(function() {
      return $(this).closest('.filer').length == 0 && $(this).closest('form').is('.webform-client-form');
    }).filer();
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
            if (formstoneFunction === $.fn.picker) {
              // enabling the picker does not set a checked class, update is needed as well.
              formstoneFunction.call($(mutation.target), "update");
            }
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
