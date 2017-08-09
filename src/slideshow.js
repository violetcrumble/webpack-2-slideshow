var Slideshow = (function() {
  var self = this;
  self.options = {};

  function create(opts) {
    //options used if the end user doesn't specify anything when calling Slideshow.create

    var defaultOptions = {
      showNavigationArrows: true, //show/hide navigation arrows
      jsonDataAvailable: true, //use json data if available, if not, use HTML.
      initialSlide: 4, //specify a starting slide, zero based
      containerClass: '.slideshow', //container name you'd like to use
      showCount: true, //show counter below slideshow
      injectAd: true,
      injectAdPostSlide: 2, //the ad will be injected after the specified number, zero based
      adURL: 'http://place-hoff.com/500/333'
    };

    //takes the default object and merges it with any user specified values
    $.extend(self.options, defaultOptions, opts);

    getData();

  }

  function initializeSlideshow() {
    ((self.options.showNavigationArrows) ? displayNavigationArrows() : null);
    ((self.options.showCount) ? displaySlideCount() : null);

    currentSlide = self.options.initialSlide;
    numSlides = ($('section').length) - 1;

    if (injectAd && self.options.initialSlide > numSlides) {
      console.log('Sorry, there are only ' + numSlides + ' slides. ' +
        'You specified an initialSlide that does not exist. Please set initialSlide to a value between 0 and ' + numSlides + '.');
    }

    if (self.options.injectAdPostSlide > numSlides) {
      console.log('Sorry, the slide you want to place the ad after does not exist. ' +
        'Please set injectAdPostSlide to a value between 0 and ' + numSlides + '.');
    }

    $('.slide' + self.options.initialSlide).fadeIn();

    if (self.options.initialSlide === 0) {
      $('.arrow_left').addClass('arrow_inactive');
    };

    if (self.options.initialSlide === numSlides) {
      $('.arrow_right').addClass('arrow_inactive');
    };

    ((self.options.showCount) ? updateCount() : null);
  }

  /**
   * @description: Displays counter below slideshow
   */
  function displaySlideCount() {
    $('h4').prepend('<div class="count"></div>');
  }

  /**
   * @description: Updates counter, called whenever slide changes
   */
  function updateCount() {
    $('.count').text((currentSlide + 1) + ' / ' + (numSlides + 1));
  }

  /**
   * @description: Injects ad into slideshow without affecting the count
   */
  function injectAd() {
    //if the end user specifies the index of the last ad or a higher value, inject the ad after the first slide
    if (currentSlide === self.options.injectAdPostSlide) {
      $('section h4, section p, section img').hide();
      //display ad
      $(self.options.containerClass).append('<section class="injected_ad"><img src="' + self.options.adURL + '"></section>');
    }
  }

  /**
   * @description: Displays left/right navigation arrows
   */
  function displayNavigationArrows() {
    $(self.options.containerClass).append('<div class="arrows">' +
      '<div class="arrow arrow_left">' +
      '<span class="glyphicon glyphicon-chevron-left"></span>' +
      '</div>' +
      '<div class="arrow arrow_right">' +
      '<span class="glyphicon glyphicon-chevron-right"></span>' +
      '</div>' +
      '</div>');

    $(document).on('click', '.arrow_left', function() {
      //if the ad exists, don't go to the previous slide. just hide the ad
      if ($('section.injected_ad').length) {
        $('section.injected_ad').remove();
        $('section h4, section p, section img').show();
      } else {
        if (currentSlide !== 0) {

          $('.arrow_right').removeClass('arrow_inactive');
          $('.slide' + currentSlide).fadeOut();
          currentSlide--;
          $('.slide' + currentSlide).fadeIn();
          if (currentSlide === 0) {
            $(this).addClass('arrow_inactive');
          }

        }
        (self.options.injectAd ? injectAd() : null);
        (self.options.showNavigationArrows ? updateCount() : null);
      }

    });

    $(document).on('click', '.arrow_right', function() {
      //if the ad exists, don't advance the slide. just get rid of the ad
      if ($('section.injected_ad').length) {
        $('section.injected_ad').remove();
        $('section h4, section p, section img').show();
      } else {
        if (currentSlide !== numSlides) {

          $('.arrow_left').removeClass('arrow_inactive');
          $('.slide' + currentSlide).fadeOut();
          currentSlide++;
          $('.slide' + currentSlide).fadeIn();
          if (currentSlide === numSlides) {
            $(this).addClass('arrow_inactive');
          }

        }
        (self.options.injectAd ? injectAd() : null);
        (self.options.showNavigationArrows ? updateCount() : null);
      }

    });
  }

  /**
 * @description: Pulls either JSON or HTML data, depending on what user specified
 */
function getData() {
  var slideshowContent = (function() {
    var slideshowContent = null;
    $.ajax({
      'url': self.options.jsonDataAvailable ? './image-data.js' : './image-data.html',
      'dataType': self.options.jsonDataAvailable ? 'json' : 'html',
      'success': function(data) {
        if (self.options.jsonDataAvailable) {
          for (var i in data) {
            if (data.hasOwnProperty(i)) {
              $(self.options.containerClass).append('<section class="slide' + i + '">' +
                '<img src="' + data[i].image + '" />' +
                '<h4>' + data[i].heading + '</h4>' +
                '<p>' + data[i].description + '</p>' +
                '</section>');
            }
          }
        } else {
          $(self.options.containerClass).append(data);
          $(self.options.containerClass + ' section').each(function(i) {
            $(this).addClass('slide' + i);
          });
        }
        initializeSlideshow();
      }
    });
    return slideshowContent;

  })();
}

  return {
    create: create
  };

})();

$(function() {
  Slideshow.create({
    //try messing with these options that override default options!
    //this code would typically be on the page that is using the slideshow
    showNavigationArrows: true,
    initialSlide: 0,
    containerClass: '.slideshow',
    jsonDataAvailable: true,
    showCount: true,
    injectAd: true,
    injectAdPostSlide: 3,
    // adURL: 'https://s33.postimg.org/chk2ksae7/liberty.jpg'
  });
});

module.exports = Slideshow;
