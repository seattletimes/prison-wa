//Use CommonJS style via browserify to load other modules
require("./components/leaflet-map/leaflet-map");
require("./lib/component-responsive-frame/src/responsive-child/responsive-child");
var L = require("leaflet");

var qsa = function(s) { return Array.prototype.slice.call(document.querySelectorAll(s)) };

var mapElement = document.querySelector("leaflet-map.washington");

var faded = .8;
var waBounds = [
  [49.01, -124.90],
  [45.54, -116.84]
];
var maxBounds = [
  [60, -134],
  [45, -108]
];

var markers = {};

mapElement.map.fitBounds(waBounds);
mapElement.map.setMaxBounds(maxBounds);
window.addEventListener("resize", function() { mapElement.map.fitBounds(waBounds) });

var onEnter = function(marker) {
  var data = this.data;
  data.industries.forEach(function(industry) {
    document.querySelector("[data-industry='" + industry + "']").className += " active";
  });
};

var onExit = function(marker) {
  qsa(".industry-list .active").forEach(function(item) {
    item.className = item.className.replace(/\s?active\s?/g, "");
  });
};

window.prisonData.prisons.forEach(function(prison) {
  var marker = L.marker([prison.y, prison.x], {
    riseOnHover: true,
    icon: L.divIcon({
      className: "prison-marker count-" + Math.ceil(prison.industries.length / 3),
      iconSize: [30, 30],
      html: prison.industries.length,
    }),
    alt: prison.name,
    title: prison.name,
    opacity: faded
  });
  marker.data = prison;
  prison.marker = marker;
  var content = "<h2>" + prison.name + "</h2>\n<ul>\n<li>" + prison.industries.join("\n<li>") + "</ul>";
  marker.bindPopup(L.popup({
    closeButton: false,
    maxWidth: 280
  }).setContent(content));
  marker.on("mouseover", onEnter);
  marker.on("mouseout", onExit);
  marker.addTo(mapElement.map);
  markers[prison.name] = marker;
});

var list = document.querySelector(".industry-list");

list.addEventListener("mouseover", function(e) {
  if (e.target.hasAttribute("data-industry")) {
    var industry = e.target.getAttribute("data-industry");
    var prisons = window.prisonData.industries[industry];
    prisons.forEach(function(prison) {
      var marker = markers[prison];
      marker._icon.className += " selected";
      marker.setOpacity(1);
    });
  }
});

list.addEventListener("mouseout", function(e) {
  for (var key in markers) {
    var marker = markers[key];
    marker._icon.className = marker._icon.className.replace(/\s?selected\s?/g, "");
    marker.setOpacity(faded);
  }
});