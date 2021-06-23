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
			L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
				attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
				label: 'Toner Lite',				// optional label used for tooltip
				iconURL: 'img/tonerGray.png'
			}),
			L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
				label: 'Toner',
				iconURL: 'img/tonerBlack.png'
			}),
			L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
				attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
				label: 'Watercolor',
				iconURL: 'img/watercolor.jpg'
			})
			
		];

		map.addControl(L.control.basemaps({
			position: "topright",
			basemaps: basemaps,
			
		}));
		
		var popup = L.popup();
	
		
		$.getJSON("data/map.json")
			.done(function(data) { //
				var info = processData(data);
				createPropSymbols(info.timestamps, data);
				createLegend(info.min, info.max);
				createSliderUI(info.timestamps);
			})
		.fail(function() { alert("There has been a problem loading the data")});
		
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
		}
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

			var scaleFactor = 30;
			var area = attributeValue * scaleFactor;
			return Math.sqrt(area/Math.PI)*2;			
		}
		
		function createLegend(min, max) {

			if (min < 10) {
				min = 10;
			}

			function roundNumber(inNumber) {

						return (Math.round(inNumber/2) * 2);
			}

			var legend = L.control( { position: "bottomright" } );

			legend.onAdd = function(map) {

			var legendContainer = L.DomUtil.create("div", "legend");
			var symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
			var classes = [roundNumber(min), roundNumber((max-min)/2), roundNumber(max)];
			var legendCircle;
			var lastRadius = 0;
			var currentRadius;
			var margin;

						
			L.DomEvent.addListener(legendContainer, 'mousedown', function(e) {
				L.DomEvent.stopPropagation(e);
			});

			$(legendContainer).append("<h2 id='legendTitle'> Particulate <br> Matter in <br> the Air</h2>");

			
			for (var i = 0; i <= classes.length-1; i++) {

				legendCircle = L.DomUtil.create("div", "legendCircle");

				currentRadius = calcPropRadius(classes[i]);

				margin = -currentRadius - lastRadius - 2;

				$(legendCircle).attr("style", "width: " + currentRadius*2 +
					"px; height: " + currentRadius*2 +
					"px; margin-left: " + margin + "px" );
				$(legendCircle).append("<span class='legendValue'>"+classes[i]+"</span>");

				$(symbolsContainer).append(legendCircle);

				lastRadius = currentRadius;

			}
		
			$(legendContainer).append(symbolsContainer);

			return legendContainer;

			};

			legend.addTo(map);

		} // end createLegend()
		
			
				
		function createSliderUI(timestamps) {

			var sliderControl = L.control({ position: "bottomleft"});
			
			
			sliderControl.onAdd = function(map) {
			
			var slider = L.DomUtil.create("input", "range-slider");

			 
			L.DomEvent.addListener(slider, "mousedown", function(e) {
			L.DomEvent.stopPropagation(e);
			
			});
			 
			

			$(slider)
					.attr({
						"type":"range",
						"max": timestamps[timestamps.length-1],
						"min": timestamps[0],
						"step": 11,
						"value": String(timestamps[0])})
					.on("input change", function() {
					updatePropSymbols($(this).val().toString());
						$(".temporal-legend").text(this[i].value);
			});
			
			return slider;
			}

			sliderControl.addTo(map)
			createTemporalLegend(timestamps[0]);
			
		}
		
		
		function createTemporalLegend(startTimestamp) {

			var temporalLegend = L.control({ position: "bottomleft" });

			temporalLegend.onAdd = function(map) {
					var output = L.DomUtil.create("output", "temporal-legend");
					$(output).text(startTimestamp)
					return output;
			}

			temporalLegend.addTo(map);
		}

		
	});
				
				
		
	/*function createSliderUI(map){
			
			//create range input element (slider)
			$('#map').append('<input class="range-slider" type="range" >');
		
		
		//set slider attributes
			$('.range-slider').attr({
				max: 6,
				min: 0,
				value: 0,
				step: 1
			});
		}*/	

	

	








  
  
