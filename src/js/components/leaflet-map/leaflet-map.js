require("document-register-element");
var template = require("./_template.html");
var L = require("leaflet");
var configParser = require("./config-parser");

//styles
require("./leaflet-map.less");

var proto = Object.create(HTMLElement.prototype);

proto.createdCallback = function() {
  var config = configParser(this);
  this.innerHTML = "";
  this.setAttribute("ready", "");

  if (this.hasAttribute("lat")) {
    config.options.center = [this.getAttribute("lat"), this.getAttribute("lng")];
  } else {
    config.options.center = [47.609, -122.333];
  }
  if (this.hasAttribute("fixed")) {
    config.options.boxZoom = false;
    config.options.doubleClickZoom = false;
    config.options.dragging = false;
    config.options.keyboard = false;
    config.options.scrollWheelZoom = false;
    config.options.touchZoom = false;
    config.options.zoomControl = false;
  }
  var map = this.map = L.map(this, config.options);

  //add layers
  config.tiles.forEach(function(tile) {
    tile.addTo(map);
  });

  config.geojson.forEach(function(json) {
    var layer = L.geoJson(json.data, json.style);
    layer.addTo(map);
  });

  config.markers.forEach(function(poi) {
    var options = {
      icon: new L.divIcon({
        className: poi.class,
        iconSize: null
      }),
      title: poi.title
    };
    var marker = L.marker(poi.latlng, options);
    if (poi.html) {
      marker.bindPopup(poi.html);
    }
    marker.addTo(map);
  });
};
proto.leaflet = L;

document.registerElement("leaflet-map", { prototype: proto });