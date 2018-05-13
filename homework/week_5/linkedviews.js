// Dewi Mooij
// 10752978
// D3 linkedviews

window.onload = function(){

queue()
	.defer(d3.json, 'time.json')
	.defer(d3.json, 'life.json')
	.awaitAll(LoadData);

function LoadData(error, response){
  if (error) throw error;

    var time_use = response[0];
    var life_satJSON = response[1];

		// rewrite json data of life satisfaction to format for datamap
		var data_life_map = {};

		for (var i = 1; i < life_satJSON.length; i++){
				country = life_satJSON[i]["LOCATION"];
				data_life_map[country] = {fillKey: "location", value: life_satJSON[i]["Value"]};
		};

		// create arrays per country for the bar chart showing time used per country
    var time_per_country = [];
    var start = 1;

    for (var country = 0; country < 29; country++)
    {
      var country_time = [];

      for (var time = start; time < (5 + start); time++)
      {
        country_time.push(time_use[time]);
      }
      time_per_country.push(country_time);
      start += 5;
    };

    // interactive datamap to display the life satisfaction data
    var map = new Datamap({
      element: document.getElementById("map"),
			fills: {
				location: "firebrick",
				defaultFill: "bisque"
		 },
		 data: data_life_map,
		 done: function(datamap){
			 datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography){
				 var location = geography.id;
				 console.log(location);
				 makeBarchart(location, time_per_country);
			 })
		 },
		 geographyConfig: {
				 popupTemplate: function(geo, data_life_map) {
					 if (!data_life_map){
						 return ['<div class="hoverinfo"><strong>',
										 'Life satisfaction in ' + geo.properties.name,
										 ': no data',
										 '</strong></div>'].join('');
					 }
						 return ['<div class="hoverinfo"><strong>',
										 'Life satisfaction in ' + geo.properties.name,
										 ': ' + data_life_map.value,
										 '</strong></div>'].join('');
				 }
		 }
 		});

    // below map make barchart that shows the time use in the country when clicked
		function makeBarchart(location, time_per_country){
    // set width and height of svg and bar chart area
    var margin = {top: 25, right: 20, bottom: 50, left: 50};
    var fullwidth = 500;
    var fullheight = 300;
    var width = fullwidth - margin.left - margin.right;
    var height = fullheight - margin.top - margin.bottom;

    // Create SVG element
    var svg = d3.select("body")
      .append("svg")
       .attr("width", fullwidth)
       .attr("height", fullheight)
      .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// for (var j = 0; j < time_per_country["LOCATION"].length; j++){
		//
		// 	if (time_per_country["LOCATION"][j] == location){
		// 		var time_data = time_per_country[j]
		// 	}
		// }

		var time_data = time_per_country[location]
		console.log(time_data)

		var xscale = d3.scale.ordinal()
		   // .domain([0, time_per_country[0].map(function(d) { return d.Description;})])
			 .domain(d3.range(time_data.length))
		   .rangeRoundBands([0, width], .05);

		// set y scale
		var yscale = d3.scale.linear()
		   .domain([0, d3.max(time_data, function(d) { return d.Value;})])
		   .range([height, margin.top]);

	 	var use = ["Leisure", "Other", "Paid work or study", "Personal care", "Unpaid work"]

		// create axes
		var xaxis = d3.svg.axis()
		    .scale(xscale)
		    .orient("bottom")
		    .tickFormat(function(d) { return use[d]; })

		var yaxis = d3.svg.axis()
		                  .scale(yscale)
		                  .orient("left")

		// x axis
		svg.append("g")
		     .attr("class", "axis")
		     .attr("transform", "translate(0," + height + ")")
		     .call(xaxis)
				 .append("text")
				 .attr("text-anchor", "middle")

		 // x axis label
		 svg.append("text")
     .attr("text-anchor", "end")
     .attr("x", width)
     .attr("y", height + 40)
		 .attr("dy", ".71em")
     .text("Time use");

		// y axis
		svg.append("g")
		    .attr("class", "axis")
		    .call(yaxis)
		  .append("text")
		    .text("Hours")
		    .style("text-anchor", "end")
		    .attr("y", 5)
		    .attr("dy", ".71em")
		    .attr("transform", "rotate(-90)");

		// create the tooltip
		var tooltip = d3.tip()
		  .attr("class", "d3-tip")
		  .offset([-10, 0])
		  .html(function(d){
		     return "<strong>Hours:</strong> <span style='color:crimson'>" + d.Value + "</span>"
		  });
		svg.call(tooltip);

		svg.selectAll("rect")
		  .data(time_data)
		  .enter()
		  .append("rect")
		  .attr("class", "bar")
		  .attr("x", function (d, i){
		    return xscale(i);
		  })
		  .attr("y", function (d){
		    return yscale(d.Value);
		  })
		  .attr("width", xscale.rangeBand())
		  .attr("height", function (d){
		    return height - yscale(d.Value);
		  })
			.on("mouseover", tooltip.show)
			.on("mouseout", tooltip.hide)

		 // title of bar chart
		 svg.append("text")
	    .attr("x", (width / 2))
	    .attr("y", 0 - (margin.top/2))
	    .attr("text-anchor", "middle")
	    .style("font-size", "14px")
	    .text("Time use in "+ time_per_country[country].Country)

	};
};
};
