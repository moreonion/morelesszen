/*
 * to be called from Drupal  behaviors
 */

(function ( $ ) {

  $.fn.webformAjaxSlide = function( options ) {

    // bail if we are not called on an AJAX enabled webform.
    var $container = $(this).parents('[id^=webform-ajax-wrapper]').first();
    if (!$container.length) {
      return this;
    }

    // These are the defaults.
    var defaults = {
      minHeight: '0',
      wrapperClass: 'webform-ajax-slide-wrapper',
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
    var $containerWrapper = $(this).parents('.' + settings.wrapperClass).first();
    if ($containerWrapper.length < 1) {
      $containerWrapper = $('<div class="'+settings.wrapperClass+'">');
      $containerWrapper.css({position: 'relative'});
      $container.wrap($containerWrapper);
    }

    // generate a dummy div to display while loading
    var $loadingdummy = $containerWrapper.find('.' + settings.loadingDummyClass).first();
    if (!$loadingdummy.length) {
      var $loadingdummy = $('<div class="'+settings.loadingDummyClass+'"><div class="container"><div>' + settings.loadingDummyMsg + '</div></div></div>');
      $loadingdummy.hide();
      $loadingdummy.insertBefore($container);
    }

    // need to set an beforeSubmit callback to get the
    // direction from a data attribute from the markup
    var processTriggers = function(triggers) {
      $.each(triggers, function(t) {
        var trigger = triggers[t];
        // leave non webform ajax triggers alone
        if (trigger['callback'] != 'webform_ajax_callback') {
          return;
        }
        trigger['beforeSubmit'] = function(form_values, element_settings, options) {
          options["ajaxSlidingDirection"] = $(trigger.element).data("direction");
        }
      });
    }
    // initialize
    processTriggers(Drupal.ajax);

    // called via ajaxSend()
    var onSend = function(ajax, ajaxOptions) {
      var targetPageNum;
      // set container anew (from loaded data)
      var pageNum = parseInt($('input[name="details\[page_num\]"]', $container).attr('value'));
      ajax.onLastSlide = (pageNum == maxPageNum);

      settings.onSlideBegin.call($container, ajaxOptions);

      // after possible tampering of context + options by callback
      var stepForward = ajaxOptions["ajaxSlidingDirection"] == "back" ? false : true;
      var context = ajaxOptions.data;

      //if ($containerWrapper.height() > minHeight) {
      //  minHeight = $containerWrapper.height();
      //  $containerWrapper.css({minHeight: minHeight});
      //}

      // set dummy dimensions to current container dimensions
      $loadingdummy.css({height: $container.height() + 'px', width: $container.width() + 'px'});

      // define the animation and it's "reverse"
      var anim = {};
      var reverseAnim = {};
      // one element needs position: relative
      if (stepForward) {
        $loadingdummy.css({position: 'absolute', right: '-120%'});
        $container.css({position: 'relative', right: '', left: '0%'});
        anim = {left: '-150%'};
        reverseAnim = {right: '0%'};
      } else {
        $loadingdummy.css({position: 'absolute', left: '-120%'});
        $container.css({position: 'relative', right: '0%', left: ''});
        anim = {right: '-150%'};
        reverseAnim = {left: '0%'};
      }

      // do the slide!
      // set container overflow to hidden to prevent overlapping¬
      $containerWrapper.css({overflow: 'hidden'});
      // move dummy in
      $loadingdummy.show().animate(reverseAnim, 800);
      // move container out
      $container.animate(anim, 800, function() {});
    };

    var onSuccess = function(ajax, response) {
      // Don't slide-in if a redirect is in progress.
      for (var i=0; i<response.length; i++) {
        if (response[i].command == 'redirect') {
          return;
        }
      }
      $container.css({left: '', right: '', position: 'absolute', opacity: 0});
      $loadingdummy.css('position', 'relative');

      // to the incoming slide
      $loadingdummy.animate({height: $container.height()}, 200, 'swing', function() {
        $container.css('position', 'relative');
        $loadingdummy.css('position', 'absolute').fadeOut(400);
        $container.animate({opacity: 1}, 400, function() {
          $loadingdummy.hide();
          $containerWrapper.css({overflow: 'visible'});
        });
      });

      //if ($containerWrapper.height() > minHeight) {
      //  minHeight = $containerWrapper.height();
      //  $containerWrapper.css({minHeight: minHeight});
      //}

      if (ajax.onLastSlide) {
        // call finishing callback
        settings.onLastSlideFinished.call($container, response);
      } else {
        settings.onSlideFinished.call($container, response);
      }
    }

    var ajax_id = $container.attr('id');
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
          onSuccess(ajax, response);
          // recreate beforeSubmit callback on newly loaded elements
          processTriggers(Drupal.ajax);
          old_success.call(ajax, response, status);
        };
      }
    });

    return this;
  }
})(jQuery);


