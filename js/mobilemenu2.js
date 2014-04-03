
(function($) {
Drupal.behaviors.mobilemenu = {};
Drupal.behaviors.mobilemenu.attach = function(context, settings) {
  if ($('html').hasClass('lt-ie9')) {
    return;
  } else {
    $('#main-menu', context).mobilemenu({
      animationFromDirection: 'left',
      dimElement: '.campaignion-dialog-wrapper',
      shiftBodyAside: true,
      adaptFullHeightOnResize: true,
      beforeOpen: function (settings) {
        // test before call
        console.log(this);
      },
      onSwitchToDesktop: function (settings) {
        // test before call
        $('.campaignion-dialog-wrapper').hide();
      },
      afterClose: function (settings) {
        // test before call
        $('.campaignion-dialog-wrapper').hide();
      }
    });
  }
};
})(jQuery);
