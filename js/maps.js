var mm = com.modestmaps;
var url = 'http://a.tiles.mapbox.com/zzolo/1.0.0/sf_map/layer.json';


$(document).ready(function() {
  var windowWidth = $(window).width();
  var windowHeight = $(document).height();
  var headerHeight = $('header').height();

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
  });

});