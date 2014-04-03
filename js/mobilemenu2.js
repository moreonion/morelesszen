
(function($) {
Drupal.behaviors.mobilemenu = {};
Drupal.behaviors.mobilemenu.attach = function(context, settings) {
  if ($('html').hasClass('lt-ie9')) {
    return;
  } else {
    $('#main-menu', context).mobilemenu({
      animationFromDirection: 'left',
      beforeOpen: function (settings) {
        // test before call
        console.log(this);
        $('.campaignion-dialog-wrapper').show();
      },
      afterClose: function (settings) {
        // test before call
        $('.campaignion-dialog-wrapper').hide();
      }
    });
  }
};
})(jQuery);
