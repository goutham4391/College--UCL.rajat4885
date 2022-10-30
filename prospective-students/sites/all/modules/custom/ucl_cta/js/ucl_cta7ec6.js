/**
 * @file
 * Attach event listener for click to the CTA buttons.
 */

(function ($) {

  Drupal.behaviors.ucl_cta = {
    attach: function (context, settings) {
      $('a.cta.btn').each(function () {
        var act = "_gaq.push(['_trackEvent','CTA','Click','" + $(this).attr('href') + "'])";
        $(this).attr('onClick', act);
      });
    }
  };

})(jQuery);
