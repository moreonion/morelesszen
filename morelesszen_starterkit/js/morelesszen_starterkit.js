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
      breakpoint: 780, // same as @menu-breakpoint in menu.less
      dimBackground: true,
      dimElement: '.campaignion-dialog-wrapper',
      animationFromDirection: 'left'
    });
  }
};

Drupal.behaviors.showMore = {};
Drupal.behaviors.showMore.attach = function(context, settings) {
  // link for revealing more info
  $('.show-more', context).each(function(){
    var $toggle = $(this);
    var $target = $($toggle.attr('href'));

    if ($toggle.is(':visible') && $target.length) {
      $target.hide();
      $toggle.on('click', function(e) {
        $toggle.hide();
        $target.slideDown();
        e.preventDefault();
      });
    }
  });  
  // class for smooth scrolling to anchor
  $('a.scroll', context).each(function(){
    $(this).on('click', function(e){
      $('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
      e.preventDefault();
    });
  });
};

Drupal.behaviors.payment_slide = {};
Drupal.behaviors.payment_slide.attach = function(context, settings) {
  /*
   * $selector slides out on click and $forms slide in.
   * $forms slide out on click on the back-link and $selector slides in.
   * $wrapper.height() is animated accordingly.
   */
  // only act on payment webform component wrappers.
  var behavior = this;

  $('.paymethod-select-wrapper', context)
    .css({position: 'relative'})
    .each(function() {
    // initial state: selector visible forms invisible
    var $wrapper = $(this);
    var $selectorWrapper = $wrapper.find('.paymethod-select-radios');
    var $selector = $wrapper.children('.form-type-radios');
    behavior.$selector = $selector;
    if ($selector.length <= 0)
      return;

    var $forms = $('.payment-method-all-forms', $wrapper);

    if (behavior.showForms) {
      $selector.css({left: '-120%', position: 'relative', top: 0, margin: 0}).hide();
      $forms.css({position: 'relative', right:'0%', top:0, margin: 0});
    } else {
      $selector.css({position: 'relative', top: 0, left: '0%', margin: 0});
      $forms.css({position: 'absolute', right: '0%', top: 0, margin: 0}).hide();
    }

    var $submit_buttons = $wrapper.parents('form').find('.form-actions').appendTo($forms);

    $selectorWrapper.find('label').click(function() {
      behavior.showForms = true;
      // slide in forms and select out
      $wrapper.height($selector.height());
      $selector.css({position: 'absolute', top: 0, left: '0%'})
      .animate({left: '-120%'}, 500, 'swing', function() {
        $selector.hide().css('position', 'relative');
      });

      $forms.show();
      $forms.css({position: 'absolute', width: '100%', right: '-120%'})
      .animate({right: '0%'}, 500, 'swing', function() {
          $forms.css('position', 'relative');
      });

      $wrapper.animate({height: $forms.height()}, 500, 'swing', function() {
        $wrapper.css({'height': 'auto', 'overflow': 'visible'});
      });
    });

    $('<div class="payment-slide-back"><a href="#">' + Drupal.t('back') + '</a></div>')
    .prependTo($forms)
    .click(function(e) {
      behavior.showForms = false;
      //slide out forms and selector in.
      $selector.css({position: 'relative', width: '100%'});
      $selector.show().animate({left: '0%'}, 500, 'swing', function() {
        $selector.css('position', 'relative');
      });

      $wrapper.height($forms.height());
      $forms.css('position', 'absolute');
      $forms.animate({right: '-120%'}, 500, 'swing', function() {
        $forms.hide().css('position', 'relative');
      });

      $wrapper.animate({height: $selector.height()}, 500, 'swing', function() {
        $wrapper.css('height', 'auto');
      });
      // do not bubble
      e.stopPropagation();

      // return false to prevent a page reload
      return false;
    });
  });
};

})(jQuery);
