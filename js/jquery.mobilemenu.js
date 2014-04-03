    // collapse submenus
    if (settings.collapseSubMenus) {
      $('ul ul', this).hide();
    }

    // collapsible links/submenus in mobilemenu
    // if the link clicked has a ul.menu sibling (i.e. a submenu)
    // we want to show the submenu
    if (settings.collapsibleSubMenus) {
      $('li a', this).click(function(e) {
        var $a = $(this);
        var $li = $a.closest('li');
        if (!settings.breakPointTest()) {
          var $ul = $a.siblings('ul');
          if ($ul.length < 1) {
            $ul = $li.find('ul').first();
          }
          if ($ul.length > 0) {
            if ($ul.is(':visible')) {
              $ul.hide();
              $li.removeClass('submenu-open');
            } else {
              $ul.show();
              $li.addClass('submenu-open');
            }

            // lose focus
            $a.blur();
            // stop propagation - we do not want to follow link when click on submenu-icon
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
            e.preventDefault();
            e.stopPropagation();
      });
    }

