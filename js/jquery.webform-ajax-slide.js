/*
 * to be called from Drupal  behaviors
 */

(function ( $ ) {

  $.fn.webformAjaxSlide = function( options ) {

    // bail if we are not called on an AJAX enabled webform.
    var $ajaxWrapper = $(this).parents('[id^=webform-ajax-wrapper]').first();
    if (!$ajaxWrapper.length) {
      return this;
    }
    var ajax_id = $ajaxWrapper.attr('id');

    // These are the defaults.
    var defaults = {
      minHeight: '0',
      containerClass: 'webform-ajax-slide-wrapper',
      slideClass: 'webform-ajax-slide',
      loadingDummyClass: 'webform-ajax-slide-loading-dummy',
      loadingDummyMsg: 'loading',
      onSlideFinished: function () {},
      onSlideBegin: function () {},
      onLastSlideFinished: function () {}
    }
    var settings = $.extend({}, defaults, options );

    var minHeight = 0;
    var maxPageNum = parseInt($('input[name="details\[page_count\]"]', this).attr('value'));
    var pageNum = parseInt($('input[name="details\[page_num\]"]', this).attr('value'));

    // generate an wrapper around the ajax wrapper to
    // prevent elements visually sliding over the page
    var $container = $(this).parents('.' + settings.containerClass).first();
    if ($container.length < 1) {
      // Generate our containers if needed.
      $container = $('<div class="'+settings.containerClass+'">');
      $container.css({position: 'relative'});
      $ajaxWrapper.wrap($container);
      $container = $ajaxWrapper.parent();

      // generate a dummy div to display while loading
      $('<div class="'+settings.loadingDummyClass+'"><div class="container"><div>' + settings.loadingDummyMsg + '</div></div></div>')
        .hide().insertBefore($ajaxWrapper);

      $ajaxWrapper.wrap($('<div class="'+settings.slideClass+'">'));
    }

    var $loadingdummy = $('.' + settings.loadingDummyClass, $container).first();
    var $slide = $ajaxWrapper.parents('.' + settings.slideClass).first();

    // called via ajaxSend()
    var onSend = function(ajax, ajaxOptions) {
      // set container anew (from loaded data)
      var pageNum = parseInt($('input[name="details\[page_num\]"]', $ajaxWrapper).attr('value'));
      ajax.onLastSlide = (pageNum == maxPageNum);

      settings.onSlideBegin.call($ajaxWrapper, ajaxOptions);

      // after possible tampering of context + options by callback
      var stepForward = ajaxOptions["ajaxSlidingDirection"] == "back" ? false : true;
      var context = ajaxOptions.data;

      //if ($container.height() > minHeight) {
      //  minHeight = $container.height();
      //  $container.css({minHeight: minHeight});
      //}

      // set dummy dimensions to current container dimensions
      $loadingdummy.css({height: $slide.height() + 'px', width: $slide.width() + 'px'});

      // define the animation and it's "reverse"
      var anim = {};
      var reverseAnim = {};
      // one element needs position: relative
      if (stepForward) {
        $loadingdummy.css({position: 'absolute', right: '-120%'});
        $slide.css({position: 'relative', right: '', left: '0%'});
        anim = {left: '-150%'};
        reverseAnim = {right: '0%'};
      } else {
        $loadingdummy.css({position: 'absolute', left: '-120%'});
        $slide.css({position: 'relative', right: '0%', left: ''});
        anim = {right: '-150%'};
        reverseAnim = {left: '0%'};
      }

      // do the slide!
      // set container overflow to hidden to prevent overlapping¬
      $container.css({overflow: 'hidden'});
      // move dummy in
      $loadingdummy.show().animate(reverseAnim, 800);
      // move container out
      $slide.animate(anim, 800, function() {});
    };

    var onSuccess = function(ajax, response) {
      // Don't slide-in if a redirect is in progress.
      for (var i=0; i<response.length; i++) {
        if (response[i].command == 'redirect') {
          return;
        }
      }

      $slide.stop().css({left: '', right: '', position: 'absolute', opacity: 0});
      $loadingdummy.css('position', 'relative');
      $container.css({overflow: 'visible'});
      // to the incoming slide
      $loadingdummy.animate({height: $slide.height()}, 200, 'swing', function() {
        $slide.css('position', 'relative');
        $loadingdummy.css('position', 'absolute').fadeOut(400);
        $slide.animate({opacity: 1}, 400, function() {
          $loadingdummy.hide();
        });
      });

      if (ajax.onLastSlide) {
        // call finishing callback
        settings.onLastSlideFinished.call($ajaxWrapper, response);
      } else {
        settings.onSlideFinished.call($ajaxWrapper, response);
      }
    }

    // Drupal.ajax is keyed by button ids. We have to loop to find ours.
    $.each(Drupal.ajax, function() {
      if (this.wrapper.substr(1) == ajax_id) {
        var ajax = this;
        var old_beforeSend = this.beforeSend;
        var old_success = this.success;

        this.beforeSend = function(xhr, ajaxOptions) {
          if (ajaxOptions.data) {
            onSend(ajax, ajaxOptions);
          }
          old_beforeSend.call(ajax, xhr, ajaxOptions);
        };

        this.success = function(response, status) {
          old_success.call(ajax, response, status);
          onSuccess(ajax, response);
        };

        // set an beforeSubmit callback to get the
        // direction from a data attribute from the markup
        ajax['beforeSubmit'] = function(form_values, element_settings, options) {
          options['ajaxSlidingDirection'] = $(this.element).data('direction');
        }
      }
    });

    return this;
  }

})(jQuery);


