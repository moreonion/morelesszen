(function($) {
Drupal.behaviors.morelesszen_starterkit = {};
Drupal.behaviors.morelesszen_starterkit.attach = function(context, settings) {
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

