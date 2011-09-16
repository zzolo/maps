var mm = com.modestmaps;
var url = 'http://a.tiles.mapbox.com/zzolo/1.0.0/sf_map_4025bc/layer.json';


$(document).ready(function() {
  var windowWidth = $(window).width();
  var windowHeight = $(document).height();
  var headerHeight = $('header').height();
  var mapHeight = windowHeight - headerHeight - 80;
  var mapWidth = windowWidth;

  $('a.easey-cancel').click(function(e) {
    easey.cancel();
    e.preventDefault();
  });

  wax.tilejson(url, function(tilejson) {
    // Create map.
    var m = new mm.Map('map',
      new wax.mm.connector(tilejson),
      new mm.Point(mapWidth, mapHeight));
  
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
console.log(extent[0]);
      var artLength = data.features.length;
      var position = 0;
      
      // Overlay map to highlight art.
      var mapOverlay = function() {
        if ($('.map-overlay').length == 0) {
          var $overlay = $('<div>').addClass('map-overlay')
            .width(windowWidth)
            .height(windowHeight - headerHeight - 80)
            .hide();
          $overlay.appendTo($(m.parent));
        }
        $('.map-overlay').fadeIn();
      }
      
      // Go to specific artwork
      var artShow = function(pos) {
        var feature = new mm.Location(data.features[pos].geometry.coordinates[1], data.features[pos].geometry.coordinates[0]);
        
        $('.map-overlay').fadeOut();
        
        easey.slow(m, {
          location: feature,
          zoom: Math.floor((Math.random() * 2) + 13),
          time: 2000,
          ease: 'easeOut',
          callback: function() {
            mapOverlay();
          }
        });
        
      };
      
      $('.random').click(function() {
        position = Math.floor(Math.random() * (artLength));
        artShow(position);
      });
      
      $('.next').click(function() {
        position++;
        artShow(position);
      });
      
      $('.prev').click(function() {
        position--;
        artShow(position);
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