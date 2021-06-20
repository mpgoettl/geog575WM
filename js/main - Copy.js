/* Stylesheet by Martin P. Goettl, 2021 */

$(document).ready(function() {
		var mapCenter = [39.34, -99.85];
		var cities;
		var map = L.map('map', {
		defaultExtentControl: true,
		center: mapCenter, // EDIT latitude, longitude to re-center map [39.34, -99.85],
		zoom: 4,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
		scrollWheelZoom: true,
		tap: false
		
		});
		
	
							// display Stamen_TonerLite tiles with light features and labels
		var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
			attribution: 'Map tiles by &copy <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'})

							// display USGS_USImagery tiles with light features and labels
		//var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
			//atrribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'})
	  
	  
							// display OpenStreetMap_Mapnik tiles with light features and labels
		//var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			//atrribution: 'Map Tiles by &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'})

		.addTo(map);

		/*$.getJSON("map.json",function(data){
			// add GeoJSON layer to the map once the file is loaded
			var datalayer = L.geoJson(data ,{
			onEachFeature: function(feature, featureLayer) {
			featureLayer.bindPopup(feature.properties.name);
			}
			}).addTo(map);
			map.fitBounds(datalayer.getBounds());
			});*/
			
			
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
							
							if ( attribute != "id" &&
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
										fillColor: "#708598",
										color: "#537898",
										weight: 1, 
										fillOpacity: 0.6 
									   }).on({
										   
										   mouseover: function(e) {
													this.openPopup();
													this.setStyle({color: "yellow"});
											},
										   mouseout: function(e) {
													this.closePopup();
													this.setStyle({color: "#537898"});
							
											}
										});
								}
						}).addTo(map);

						updatePropSymbols(timestamps[0]);
							function updatePropSymbols(timestamp) {
		
								cities.eachLayer(function(layer) {
							
									var props = layer.feature.properties;
									var radius = calcPropRadius(props[timestamp]);
									var popupContent = "<b>" + String(props[timestamp]) + 
											" units</b><br>" +
											"<i>" + props.name +
											"</i> in </i>" + 
											timestamp + "</i>";

									layer.setRadius(radius);
									layer.bindPopup(popupContent, { offset: new L.Point(0,-radius) });
								});
							}
							function calcPropRadius(attributeValue) {

								var scaleFactor = 16;
								var area = attributeValue * scaleFactor;
								return Math.sqrt(area/Math.PI)*2;			
							}
				}
				
		}));
			
});
	








    
  
