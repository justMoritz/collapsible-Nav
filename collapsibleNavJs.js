var collapsibleNavJs = (function($){

  /**
   * Adapted from https://codepen.io/timgomm/
   */

  // Global variables
  var collapseNavSelector          = $('[data-toggle="collapse-nav"]'),
    collapseNavStickyClass         = 'sticky',
    collapseNavStickyCollapseClass = 'sticky-collapse',
    menutext                       = 'more';

  // Custom function
  // Read collapseNav data- & find elements, return data in neat object
  // =========================
  function collapseNavGetData(target) {
    // collapseNavTarget
    var collapseNavTarget = target.data('target') || null;
    collapseNavTarget = $(collapseNavTarget);

    // Check target exists
    if (collapseNavTarget.length === 0) {
      return false;
    }
    collapseNavTarget.addClass('collapse-nav-target').addClass('dropdown');
    if (target.find(target.data('target')).length > 0) {
      collapseNavTarget.addClass('sticky');
    }

    // collapseNavItems
    var collapseNavItems = 'li';
    var collapseNavItemsNoSticky = target.find('> ' + collapseNavItems).not('.' + collapseNavStickyClass);
    collapseNavItems = target.find('> ' + collapseNavItems);

    // collapseNavParent
    var collapseNavParent = target.data('parent') || '.navbar';
    collapseNavParent = target.parents(collapseNavParent);

    // collapseNavWidthOffset & parent
    // Can be value or selectors of elements
    var collapseNavWidthOffset = target.data('width-offset');

    var data = {
      collapseNav:              target, // the data-toggle="collapse-nav" element
      collapseNavParent:        collapseNavParent,
      collapseNavTarget:        collapseNavTarget, // object of more menu target where items are moved to
      collapseNavTargetMenu:    collapseNavTarget.find('.dropdown-menu'),
      collapseNavItems:         collapseNavItems, // object of items within collapseNav to collapse, override with data-items="li"
      collapseNavItemsNoSticky: collapseNavItemsNoSticky, // object of items within collapseNav to collapse, override with data-items="li"
      collapseNavItemsSticky:   target.find('> ' + '.' + collapseNavStickyClass), // object of  sticky items within collapseNav
      collapseNavItemsStickyCollapse:   target.find('> ' + '.' + collapseNavStickyCollapseClass), // object of  sticky items within collapseNav
      collapseNavCollapseWidth: target.data('collapse-width') || 300, // a pixel width where the collapseNav should be fully collapse ie. on mobile
      collapseNavWidthOffset:   collapseNavWidthOffset || 0, // offset for width calculation, can be value or selectors of elements
      collapseNavWidth:         0 // collapseNav width based on space available
    };

    return data;
  }

  // Custom function
  // Calculates collapseNav element width
  // =========================
  function collapseNavGetWidth(data) {
    var collapseNavParentWidth = data.collapseNavParent.width(),
      collapseNavWidth = 0, // fallback, will trigger collapse
      collapseNavParentMargins = {
        'left': parseInt(data.collapseNavParent.css('margin-left')),
        'right': parseInt(data.collapseNavParent.css('margin-right'))
      },
      collapseNavOutterSpace = {
        'margin-left': parseInt(data.collapseNav.css('margin-left')),
        'margin-right': parseInt(data.collapseNav.css('margin-right')),
        'padding-left': parseInt(data.collapseNav.css('padding-left')),
        'padding-right': parseInt(data.collapseNav.css('padding-right'))
      };

    // Check for negative margins on parent
    if (collapseNavParentMargins.left < 0 || collapseNavParentMargins.right < 0) {
      collapseNavParentWidth = data.collapseNavParent.outerWidth(true);
    }

    // Check for padding & margins on trigger
    $.each(collapseNavOutterSpace, function(a, v) {
      collapseNavParentWidth -= v;
    });

    // Otherwise calculate width base on elements within
    if (collapseNavParentWidth > 0) {
      collapseNavWidth =  collapseNavParentWidth;

      // Process width offset
      if (data.collapseNavParent.find(data.collapseNavWidthOffset).length > 0) {
        // Offset with element width(s) ie. other navbar elements with parent
        data.collapseNavParent.find(data.collapseNavWidthOffset).each(function() {
          collapseNavWidth -= $(this).outerWidth(true);
        });
      }
      else {
        // Offset with value
        collapseNavWidth -= data.collapseNavWidthOffset;
      }

      // minus sticky items
      data.collapseNavItemsSticky.each(function() {
        collapseNavWidth -= $(this).outerWidth(true);
      });

      if (collapseNavWidth <= 0 || collapseNavWidth <= data.collapseNavCollapseWidth) {
        collapseNavWidth = 0;
      }
    }
    return collapseNavWidth;
  }

  // Custom function that resizes menu
  // =========================
  function collapseNavResize(data) {
    var collapseItemsWidth = 0;

    // console.log( data.collapseNavWidth );

    var temp = 0;



    // See how many "items" fit inside collapseNavWidth
    if (data.collapseNavWidth > 0 ) {
      data.collapseNavItemsNoSticky.each(function() {
        var collapseNavItem = $(this),
            collapseNavItemId = '.' + collapseNavItem.data('collapse-item-id');
        collapseItemsWidth += collapseNavItem.outerWidth(true);

        if (data.collapseNavWidth < collapseItemsWidth) {
          data.collapseNav.find(collapseNavItemId).addClass('collapse-item-hidden');
          data.collapseNavTargetMenu.find(collapseNavItemId).removeClass('collapse-item-hidden');
        }
        else {
          data.collapseNav.find(collapseNavItemId).removeClass('collapse-item-hidden');
          data.collapseNavTargetMenu.find(collapseNavItemId).addClass('collapse-item-hidden');
        }
      });
      // // // // // // // // // collapseNavStickyCollapseClass
      $('.sticky-collapse').removeClass('collapse-item-hidden');
      $('.dropdown-menu .sticky-collapse').addClass('collapse-item-hidden');
      $('.navbar').removeClass('this--allcollapsed');
    }
    else {

      // width of all sticky items
      var stickyItemWidth = 0;
      $('.' + collapseNavStickyClass).each(function() {
        stickyItemWidth += $(this).outerWidth(true);
      });

      // width of the container trying to fit
      var containerWidth = $('.collapse-nav').outerWidth(true);

      console.log( containerWidth );
      console.log( stickyItemWidth + ' all sticky items');
      // console.log( stickyCollpseItemWidth + ' all collapsible-sticky items');
      // console.log( widthOfStickyButNotCollapsibleItems + ' with of sticky but not collapsible');

      if( stickyItemWidth > containerWidth ){
        console.log('stick items do not fit anymore');
        $('.sticky-collapse').addClass('collapse-item-hidden');
        $('.dropdown-menu .sticky-collapse').removeClass('collapse-item-hidden');
        $('.navbar').addClass('this--allcollapsed');
      }else{
        $('.sticky-collapse').removeClass('collapse-item-hidden');
        $('.dropdown-menu .sticky-collapse').addClass('collapse-item-hidden');
        $('.navbar').removeClass('this--allcollapsed');
      }

      // Assume all collapsed
      data.collapseNavItemsNoSticky.addClass('collapse-item-hidden');
      data.collapseNavTargetMenu.find('.collapse-item').removeClass('collapse-item-hidden');
      data.collapseNav.width('auto');

      // $('.sticky-collapse').addClass('collapse-item-hidden');
      // $('.dropdown-menu .sticky-collapse').removeClass('collapse-item-hidden');
      // $('.navbar').addClass('this--allcollapsed');

    }

    // see if collapseNavTarget contains visible elements, :visible selector fails
    var visibleItems = data.collapseNavTargetMenu.find('.collapse-item').filter(function() {
      return $(this).css('display') !== 'none';
    }).length;

    if (visibleItems > 0) {
      data.collapseNavTarget.show();
    }
    else {
      data.collapseNavTarget.hide();
    }

  }

  // Run through all collapse-nav elements
  // =========================
  function _collapseNavTrigger(setup) {
    collapseNavSelector.each(function() {
      var collapseNav = $(this),
        collapseNavData = collapseNavGetData(collapseNav);

      if (collapseNavData === false) {
        // No target so bail
        return false;
      }

      // Run setup only on first run
      // ---------------------------
      if (setup === true) {
        // Check target has <ul class="dropdown-menu"></ul> & data-toggle elements, if not create them
        if (collapseNavData.collapseNavTarget.find('[data-toggle="dropdown"]').length === 0) {
          var hamburgerMarkup = '<a href="#" class="dropdown-toggle-button" data-toggle="dropdown"> ' +
                                  '<div class="hamburger">' +
                                    '<div class="hamburger__icon">' +
                                      '<span></span><span></span>'+
                                    '</div>' +
                                  '</div>' +
                                  '<span class="alltext">'+menutext+'</span>' +
                                '</a>';
          $(hamburgerMarkup).appendTo(collapseNavData.collapseNavTarget);
        }
        if (collapseNavData.collapseNavTarget.find('.dropdown-menu').length === 0) {
          collapseNavData.collapseNavTargetMenu = $('<ul class="dropdown-menu"></ul>');
          collapseNavData.collapseNavTargetMenu.appendTo(collapseNavData.collapseNavTarget);
        }

        // clone $collapseNav > collapseNavItems into collapseNavTarget
        collapseNavData.collapseNavItems.each(function(i) {
          var collapseItem = $(this);
          collapseItem.addClass('collapse-item');

          if (!collapseItem.hasClass(collapseNavStickyClass)) {
            // Add identifier & class to each non-sticky item
            collapseItem.data('collapse-item-id', 'collapse-item-' + i).addClass('collapse-item-' + i);
            collapseItem.clone().appendTo(collapseNavData.collapseNavTargetMenu);
          }
          // force the sticky-collapse items into the dropdown and hide by default
          if (collapseItem.hasClass('sticky-collapse')) {
            collapseItem.clone().appendTo(collapseNavData.collapseNavTargetMenu).addClass('collapse-item-hidden');
          }
        });

        collapseNavData.collapseNav.addClass('collapse-nav');
      }

      // Calulate navbar width
      // ---------------------------
      collapseNavData.collapseNavWidth = collapseNavGetWidth(collapseNavData);

      // Trigger menu resizing
      // ---------------------------
      collapseNavResize(collapseNavData);
    });
  }

  /**
   * Reads the width of the absolutely positioned absolute logo
   * and applies it to the spacer in the nav
   */
  var _logoWidth = function(){
    var $logoSpacer = $('.collapse-nav-spacer'),
        $actualLogo = $('.navbar-actuallogo');
    $logoSpacer.outerWidth( $actualLogo.outerWidth(true) );
  };


  /**
   * Public Method that recalculates the navigation upon request
   */
  var recalculate = function(){
    _logoWidth();
    _collapseNavTrigger(false);
  };



  var _prepareDocument = function($target){

    // adds required classes to container
    $target.addClass('navbar navbar-default');

    // wraps the logo link in another required div
    $($target).find('.site-logo').wrap('<div class="navbar-actuallogo"></div>');

    // prepares the ul
    var $currentUl = $($target).find('ul');
    $currentUl.attr('data-toggle', 'collapse-nav').attr('data-target', '#more-menu-1');

    // assignes the ul found to be the container to do maths on
    collapseNavSelector = $currentUl;

    // adds additional markup to the list of menu items
    $currentUl.prepend('<li class="sticky collapse-nav-spacer" role="presentation"> </li>');
    $currentUl.append(' <li class="more-menu-1" id="more-menu-1"></li>');

    // cheap clearfix
    $target.after('<div style="clear: both;"></div>');

  };



  /**
   * Runs both the adapted script and the MMC scripts
   */
  var init = function( $passedTarget ){

    // initial setup
    _prepareDocument( $passedTarget );
    _collapseNavTrigger(true);
    _logoWidth();

    // immediately re-calculate
    _logoWidth();
    _collapseNavTrigger(false);

    // recalc on resize
    $(window).on('resize', function() {
      _logoWidth();
      _collapseNavTrigger(false);
    });

    // overflow menu is hidden by default
    $('ul.dropdown-menu').hide();

    // When Menu button is clicked, overflow menu is shown or hidden
    $('.dropdown-toggle-button').on('click', function(){
      $(this).toggleClass('this--open');
      $('ul.dropdown-menu').slideToggle();
    });
  };


  jQuery.fn.mmcCollapsibleNav = function() {
    init(this);
  };


 /**
  * Public Methods
  */
  return{
    init: init,
    recalculate: recalculate,
  };

})(jQuery);
