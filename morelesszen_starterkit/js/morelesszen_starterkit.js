(function($) {
Drupal.behaviors.morelesszen_starterkit = {};
Drupal.behaviors.morelesszen_starterkit.attach = function(context, settings) {
  // scroll to top of form + padding if we are below it
  // or if we are more than the toleratedOffset above it
  if ('ajax' in settings) {
    $.each(settings.ajax, function(el) {
      var padding = 12;
      var toleratedOffset = 50;
      if (el && Drupal.ajax[el]) {
        var oldsuccess = Drupal.ajax[el].success;

        Drupal.ajax[el].success = function (response, status) {
          oldsuccess.call(this, response, status);
          var wrapperTop = $('#' + settings.ajax[el].wrapper).offset().top;
          var diff = Math.abs(wrapperTop) - (Math.abs($('html').offset().top) || $('html')[0].scrollTop); // get scroll position across browsers
          if (diff < 0 || Math.abs(diff) > toleratedOffset) {
            // IE scrolls html, not body.
            var $scrollEl = $('body')[0].scrollTop === 0 ? $('html') : $('body');
            $scrollEl.animate({ scrollTop: (wrapperTop - padding)}, 'slow');
          }
        }
      }
    });
  }

  // container id begins with webform-ajax-wrapper
  $('.webform-client-form', context).webformAjaxSlide({
    loadingDummyMsg: Drupal.t('loading'),
    onSlideBegin: function (ajaxOptions) {},
    onSlideFinished: function (ajaxOptions) {},
    onLastSlideFinished: function (ajaxOptions) {}
  });
};

Drupal.behaviors.clickableTeasers = {};
Drupal.behaviors.clickableTeasers.attach = function(context, settings) {
  $('.node-teaser', context).click(function(event) {
    event.preventDefault();
    window.location.href = $('.node-readmore a', this).attr('href');
  }).addClass('clickable');
};

Drupal.behaviors.mobilemenu = {};
Drupal.behaviors.mobilemenu.attach = function(context, settings) {
  if ($.fn.mobilemenu) {
    // enable and configure the mobilemenu
    // for the full set of options see jquery.mobilemenu.js
    $('#main-menu', context).mobilemenu({
      breakpoint: 780, // same as @menu-breakpoint in parameters.less
      dimBackground: true,
      dimElement: '.campaignion-dialog-wrapper',
      animationFromDirection: 'left'
    });
  }
};
})(jQuery);

