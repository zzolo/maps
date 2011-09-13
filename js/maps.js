var mm = com.modestmaps;
var url = 'http://a.tiles.mapbox.com/zzolo/1.0.0/sf_map_4025bc/layer.json';


$(document).ready(function() {
  var windowWidth = $(window).width();
  var windowHeight = $(document).height();
  var headerHeight = $('header').height();

  $('a.easey-cancel').click(function(e) {
    easey.cancel();
    e.preventDefault();
  });

  wax.tilejson(url, function(tilejson) {
    // Create map.
    var m = new mm.Map('map',
      new wax.mm.connector(tilejson),
      new mm.Point(windowWidth, windowHeight - headerHeight - 80));
  
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

    /*
    var artData = 'http://x.iriscouch.com/public_art_sf/_design/geo/_spatiallist/geojson/full?attachments=true&bbox=-180,-90,180,90';
    $.ajax({
      url: artData,
      type: 'get',
      dataType: 'jsonp',
      success: function(data) {
      
        console.log(data);
        var fly = [];
        
        for (var n in data.features) {
          fly.push({
            location: new mm.Location(data.features[n].geometry.coordinates[1], data.features[n].geometry.coordinates[0]),
            zoom: (Math.floor(Math.random() * 4) + 12),
            time: 4000,
            ease: 'linear'
          });
        }
        
        easey.sequence(m, fly);
      }
    });
    */
    
    // Some small nice visuals.
    var parks = $('<div>').addClass('parks-icon').addClass('legend-icons');
    $('li.parks').prepend(parks);
    var water = $('<div>').addClass('water-icon').addClass('legend-icons');
    $('li.water').prepend(water);
    var art = $('<div>').addClass('art-icon').addClass('legend-icons');
    $('li.art').prepend(art);
    
  });

});