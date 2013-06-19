/*
 * This file is overriding the narrow.js in the parent theme.
 *
 * The size classes (.four, .five, ...) are used by the layout.less file
 */
function checkNarrow(){
  var size = {
    four: 400,
    five: 500,
    six: 600,
    sixfive: 650,
    seven: 700,
    sevensome: 768,
    eightfive: 850,
    nine: 900,
    tablet: 500,
    desktop: 950
  };
  jQuery.each(size, function(cls, size) {
    if (jQuery(window).width() >= size) {
      jQuery('html').addClass(cls);
    } else {
      jQuery('html').removeClass(cls);
    }
  });
}

jQuery(window).resize(checkNarrow);
jQuery(window).ready(checkNarrow);
