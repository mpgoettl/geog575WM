/* Stylesheet by Martin P. Goettl, 2021 */

$(document).ready(function() {
		
		var mapCenter = [41, -94];
		var cities;
		var map = L.map('map', {
		defaultExtentControl: true,
		center: mapCenter, // EDIT latitude, longitude to re-center map [39.34, -99.85],
		zoom: 4,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
		scrollWheelZoom: true,
		tap: false
				
		});
		
		var basemaps = [
			L.tileLayer('//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
				label: 'Toner Lite',				// optional label used for tooltip
				iconURL: 'img/tonerGray.png'
			}),
			L.tileLayer('//{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
				label: 'Toner',
				iconURL: 'img/tonerBlack.png'
			}),
			L.tileLayer('//{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
				label: 'Watercolor',
				iconURL: 'img/watercolor.jpg'
			})
			
		];

		map.addControl(L.control.basemaps({
			position: "topright",
			basemaps: basemaps,
			
		}));
		
		var popup = L.popup();
	
				function onMapClick(e) {
					popup
						.setLatLng(e.latlng)
						.setContent("This specific location on the map is " + e.latlng.toString())
						.openOn(map);
				}
			map.on('click', onMapClick);
			
		$.getJSON("data/map.json",(function(data) {
			var info = processData(data);
			createPropSymbols(info.timestamps, data);
			
				function processData(data) {
					var timestamps = [];
					var min = Infinity;
					var max = -Infinity;
					
					for (var feature in data.features) {
						
						var properties = data.features[feature].properties;
						
						for (var attribute in properties) {
							
							if (attribute != "id" &&
								attribute != "name" &&
								attribute != "lat" &&
								attribute != "lon" ) {
										
									if ( $.inArray(attribute,timestamps) === -1) {
										timestamps.push(attribute);
									}
									
									if (properties[attribute] < min) {
										min = properties[attribute];
									}
									
									if (properties[attribute] > max) {
										max = properties[attribute];
									}
							}
						}
					}
					
					return {
						timestamps : timestamps,
						min : min,
						max : max
					}
				}
				function createPropSymbols(timestamps, data) {
			
						cities = L.geoJson(data, {
						
								pointToLayer: function(feature, latlng) {
									
								return L.circleMarker(latlng, {
										fillColor: "yellow",
										color: "black",
										weight: 1, 
										fillOpacity: 0.6 
									   }).on({
										   
										   mouseover: function(e) {
													this.openPopup();
													this.setStyle({color: "yellow"});
											},
										   mouseout: function(e) {
													this.closePopup();
													this.setStyle({color: "black"});
							
											}
										});
								}
						}).addTo(map);

						updatePropSymbols(timestamps[0]);
							function updatePropSymbols(timestamp) {
		
								cities.eachLayer(function(layer) {
							
									var props = layer.feature.properties;
									var radius = calcPropRadius(props[timestamp]);
									var popupContent = "<b>" + "Particulate Matter" + "</b><br><br>" + props.name + "<i>" + "</i>" + "</b><br>" + String(props[timestamp]) + " micrometers</b>" + "</i> in </i>" + timestamp;

									layer.setRadius(radius);
									layer.bindPopup(popupContent, { offset: new L.Point(0,-radius) });
								});
							}
							function calcPropRadius(attributeValue) {

								var scaleFactor = 20;
								var area = attributeValue * scaleFactor;
								return Math.sqrt(area/Math.PI)*2;			
							}
				}
		function createLegend(map, attributes){
			var LegendControl = L.Control.extend({
				options: {
					position: 'bottomright'
				},

				onAdd: function (map) {
					// create the control container with a particular class name
					var container = L.DomUtil.create('div', 'legend-control-container');

					//add temporal legend div to container
					$(container).append('<div id="temporal-legend">')

					//Step 1: start attribute legend svg string
					var svg = '<svg id="attribute-legend" width="180px" height="180px">';

					//add attribute legend svg to container
					$(container).append(svg);

					return container;
				}
			});

			map.addControl(new LegendControl());

			updateLegend(map, attributes[0]);
		};  

		
				
				
		}));
			
});
	








    
  
