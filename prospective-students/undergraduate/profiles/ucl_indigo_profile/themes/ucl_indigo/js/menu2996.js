(function ($) {
  Drupal.behaviors.ucl_indigo_menu = {
    attach: function (context, settings) {
      function closeAllInactiveAccordionPanels() {
        $(".menu__accordion__description").each(function () {
          if ($(this).parent().hasClass("menu__accordion") && !$(this).hasClass("active")) {
            $(this).slideUp();
          }
        });
      }

      function removeAllActiveClassesFromCurrentAccordion(accordion) {
        $(accordion).children(".menu__accordion__description.active").removeClass("active");
        $(accordion).children(".menu__accordion__title.active").removeClass("active");
      }

      function initAccordions() {
        closeAllInactiveAccordionPanels();
        $(".menu__accordion__title").on("click", function (e) {
          e.stopImmediatePropagation();
          if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this).children("button").attr("aria-expanded","false");
            $(this).next(".menu__accordion__description").removeClass("active").slideUp();
          }
          else {
            $(this).addClass("active");
            $(this).children("button").attr("aria-expanded","true");
            $(this).next(".menu__accordion__description").addClass("active").slideDown();
            closeAllInactiveAccordionPanels();
          }
        });
      }

      initAccordions();

      $("#close-in-this-section-menu").click(function (e) {
        e.stopImmediatePropagation();
        $("#in-this-section-menu").addClass("hide");
      });

      $(".header__menu, .header-menu__dt-text, .header-menu__sm-text").on("click", function (e) {
        e.stopImmediatePropagation();
        $("#in-this-section-menu").toggleClass("hide");
        $("#close-in-this-section-menu").focus();
      });

    }
  };
})(jQuery, Drupal);

