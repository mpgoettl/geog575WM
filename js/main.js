/* Stylesheet by Martin P. Goettl, 2021 */

$(document).ready(function() {
		
		var HsSchools = new L.LayerGroup();
		var SecSchools = new L.LayerGroup();
		var ElSchools = new L.LayerGroup();
		var CSchools = new L.LayerGroup();
		var High_School = new L.LayerGroup();
		var Secondary = new L.LayerGroup();
		var Elementary = new L.LayerGroup();
		
		
		var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
				
		var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
			attribution: 'Map tiles by &copy <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
  
		  
	    // display USGS_USImagery tiles with light features and labels
	    var USGS_USImagery = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
			atrribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'});
	  
	  
	  	$.getJSON("data/HsSchools.json",function(data){
		
		// add GeoJSON layer to the map once the file is loaded
		var datalayer = L.geoJson(data ,{
		onEachFeature: function(feature, featureLayer) {
		featureLayer.bindPopup(feature.properties.name);
		}
		}).addTo(HsSchools)    
		});
		$.getJSON("data/SecSchools.json",function(data){
		
		// add GeoJSON layer to the map once the file is loaded
		var datalayer = L.geoJson(data ,{
		onEachFeature: function(feature, featureLayer) {
		featureLayer.bindPopup(feature.properties.name);
		}
		}).addTo(SecSchools)    
		});
		$.getJSON("data/ElSchools.json",function(data){
		
		// add GeoJSON layer to the map once the file is loaded
		var datalayer = L.geoJson(data ,{
		onEachFeature: function(feature, featureLayer) {
		featureLayer.bindPopup(feature.properties.name);
		}
		}).addTo(ElSchools)    
		});
		$.getJSON("data/CSchools.json",function(data){
		
		// add GeoJSON layer to the map once the file is loaded
		var datalayer = L.geoJson(data ,{
		onEachFeature: function(feature, featureLayer) {
		featureLayer.bindPopup(feature.properties.name);
		}
		}).addTo(CSchools)    
		});
		
		$.getJSON("data/High_School.geojson",function(data1){
		// add GeoJSON layer to the map once the file is loaded
		var datalayer1 = L.geoJson(data1 ,{
		style: {
        color: "red", 
        weight: 2, 
        fillColor: "yellow", 
        fillOpacity: 0.1
		},	
		onEachFeature: function(feature, featureLayer) {
		featureLayer.bindPopup(feature.properties.name);
		}
		}).addTo(High_School)  
		});
		
		$.getJSON("data/Secondary.geojson",function(data2){
		
		// add GeoJSON layer to the map once the file is loaded
		var datalayer2 = L.geoJson(data2 ,{
			style: {
        color: "blue", 
        weight: 2, 
        fillColor: "yellow", 
        fillOpacity: 0.1
		},	
		onEachFeature: function(feature, featureLayer) {
		featureLayer.bindPopup(feature.properties.name);
		}
		}).addTo(Secondary) 
		});
		
		$.getJSON("data/Elementary.geojson",function(data3){
		
		// add GeoJSON layer to the map once the file is loaded
		var datalayer3 = L.geoJson(data3 ,{
			style: {
        color: "green", 
        weight: 2, 
        fillColor: "yellow", 
        fillOpacity: 0.1
		},	
		onEachFeature: function(feature, featureLayer) {
		featureLayer.bindPopup(feature.properties.name);
		}
		}).addTo(Elementary)    
		});
		
		var mapCenter = [44.796013, -91.497962];
		var map = L.map('map', {
		defaultExtentControl: true,
		center: mapCenter, // EDIT latitude, longitude to re-center map [39.34, -99.85],
		zoom: 11,  // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
		layers: [osm,Stamen_TonerLite,USGS_USImagery, HsSchools,SecSchools,ElSchools,CSchools],
		scrollWheelZoom: true,
		tap: false,
		fullscreenControl: true,
		fullscreenControlOptions: {
			position: 'topleft'
		}
		});
		
		var osmGeocoder = new L.Control.OSMGeocoder({placeholder: 'Search location...'});

		map.addControl(osmGeocoder);
		
		var baseLayers = {
		"USGS Imagery": USGS_USImagery,
		"Stamen Toner Lite": Stamen_TonerLite,
		"OpenStreet Map": osm,
		};
		
		var overlays = {
			"High Schools": HsSchools,
			"Middle Schools": SecSchools,
			"Elementary Schools": ElSchools,
			"Charter Schools": CSchools,
			"High School": High_School, 
			"Middle": Secondary,
			"Elementary": Elementary
		};
		
		/* Control panel to display map layers */
		 L.control.layers(baseLayers, overlays, {
			position: "topright",
			collapsed: false
		}).addTo(map);
    	
});
	
				
		
	
	

	








  
  
