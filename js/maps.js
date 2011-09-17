var mm = com.modestmaps;
var url = 'http://a.tiles.mapbox.com/zzolo/1.0.0/sf_map_4025bc/layer.json';


$(document).ready(function() {
  var windowWidth = $(window).width();
  var windowHeight = $(document).height();
  var headerHeight = $('header').height();
  var mapHeight = windowHeight - headerHeight - 80;
  var mapWidth = windowWidth;
  var mapHeightHalf = Math.ceil(mapHeight / 2);
  var mapWidthHalf = Math.ceil(mapWidth / 2);

  $('a.easey-cancel').click(function(e) {
    easey.cancel();
    e.preventDefault();
  });

  wax.tilejson(url, function(tilejson) {
    // Create map.
    var m = new mm.Map('map',
      new wax.mm.connector(tilejson),
      new mm.Point(mapWidth, mapHeight)
    );
  
    // Add legend.
    wax.mm.legend(m, tilejson).appendTo(m.parent);
    // Zoomer
    wax.mm.zoomer(m).appendTo(m.parent);
    // Attribution
    wax.mm.attribution(m, tilejson).appendTo(m.parent);
  
    // Set center
    m.setCenterZoom(new mm.Location(tilejson.center[1], tilejson.center[0]),
      13);
  
    // Interaction
    wax.mm.interaction(m);

    var artData = './js/sf_art.json';
    $('.loader').addClass('loading');
    $.getJSON(artData, function(data) {
      $('.loader').removeClass('loading');
      
      var extent = m.getExtent();
      var artLength = data.features.length;
      var position = 0;
      
      // Overlay map to highlight art.
      var mapOverlayIn = function() {
        // Create overlay divs if needed.
        if ($(m.parent).find('.map-overlay-container').length == 0) {
          $('.map-overlay-container').hide();
          // Set dimensions.  Do some weirdness to line up pixels perfectly.
          var widthOffset = 50;
          if (mapWidth % 2 == 1) {
            widthOffset = 51;
          }
          var heightOffset = 50;
          if (mapHeight % 2 == 1) {
            heightOffset = 51;
          }
          $('.map-overlay-container').width(mapWidth).height(mapHeight);
          $('.map-overlay-top').width(mapWidth).height(mapHeightHalf - 50);
          $('.map-overlay-left').width(mapWidthHalf - 50).height(100).css('top', mapHeightHalf - 50);
          $('.map-overlay-right').width(mapWidthHalf - widthOffset).height(100).css('top', mapHeightHalf - 50);
          $('.map-overlay-bottom').width(mapWidth).height(mapHeightHalf - heightOffset);
          // Add to map
          $(m.parent).append($('.map-overlay-container'));
        }
        $('.map-overlay-container').fadeIn();
      }
      
      // Remove overlay.
      var mapOverlayOut = function() {
        $('.map-overlay-container').fadeOut();
        $('.overlay-title').remove();
        $('.overlay-art-image').remove();
      }
      
      // Go to specific artwork
      var artShow = function(pos) {
        // Don't show airport points
        if (data.features[pos].geometry.coordinates[1] < 37.69861) {
          $('.random').click();
          return;
        }
      
        var feature = new mm.Location(data.features[pos].geometry.coordinates[1], data.features[pos].geometry.coordinates[0]);
        
        mapOverlayOut();
        easey.slow(m, {
          location: feature,
          zoom: Math.floor((Math.random() * 2) + 13),
          time: 2000,
          ease: 'easeOut',
          callback: function() {
            mapOverlayIn();
            
            // Set title
            $('.overlay-title').remove();
            var $overlayTitle = $('<div>').addClass('overlay-title').html(data.features[pos].properties.title);
            $(m.parent).append($overlayTitle);
            
            // Set image
            if (typeof data.features[pos].properties._attachments != 'undefined') {
              for (var x in data.features[pos].properties._attachments) {
                var src = 'http://x.iriscouch.com/public_art_sf/' +
                    data.features[pos].properties._id + '/' + x;
              }
              $('.overlay-art-image').remove();
              var $overlayImage = $('<img>', { 'src': src }).addClass('overlay-art-image')
                .width(200).css('height', 'auto');
              $(m.parent).append($overlayImage);
            }
          }
        });
      };
      
      $('.random').click(function() {
        position = Math.floor(Math.random() * (artLength));
        artShow(position);
      });
      
      $('.next').click(function() {
        position++;
        if (position > artLength) position = artLength;
        artShow(position);
      });
      
      $('.prev').click(function() {
        position--;
        if (position < 0) position = 0;
        artShow(position);
      });
      
      $('.stop').click(function() {
        mapOverlayOut();
      });
    });
    
    // Some small nice visuals.
    var parks = $('<div>').addClass('parks-icon').addClass('legend-icons');
    $('li.parks').prepend(parks);
    var water = $('<div>').addClass('water-icon').addClass('legend-icons');
    $('li.water').prepend(water);
    var art = $('<div>').addClass('art-icon').addClass('legend-icons');
    $('li.art').prepend(art);
    
  });

});