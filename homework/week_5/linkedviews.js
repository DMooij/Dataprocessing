/*
Dewi Mooij
10752978
D3 linkedviews
*/

window.onload = function(){
queue()
	.defer(d3.json, 'time.json')
	.defer(d3.json, 'life.json')
	.awaitAll(LoadData);
};

// load the data
function LoadData(error, response){
  if (error) throw error;

    var time_use = response[0];
    var life_satJSON = response[1];

		// rewrite json data of life satisfaction to format for datamap
		var data_life_map = {};

		for (var place = 1; place < life_satJSON.length; place++){
				country = life_satJSON[place]["LOCATION"];
				data_life_map[country] = {fillKey: "location", value: life_satJSON[place]["Value"]};
		};

		// create arrays per country for the bar chart showing time used per country
    var time_per_country = [];
    var start = 1;

    for (var country = 0; country < 29; country++){
      var country_time = [];
      for (var time = start; time < (5 + start); time++){
        country_time.push(time_use[time]);
      }
      time_per_country.push(country_time);
      start += 5;
    };

		// initialize datamap and default bar chart of time use in the USA
		makeMap(data_life_map, time_per_country);
		makeBarchart(time_per_country[27][0]["LOCATION"], time_per_country);
	};

  // interactive datamap to display the life satisfaction data
	function makeMap(data_life_map, time_per_country){
	    var map = new Datamap({
	     element: document.getElementById("map"),
			 fills: {
					location: "firebrick",
					defaultFill: "bisque"
			 },
			 data: data_life_map,
			 responsive: true,
			 done: function(datamap){
				 datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography){
					 var location = geography.id;
					 for (var loc = 0; loc < time_per_country.length; loc++){
					 		if (location == time_per_country[loc][0]["LOCATION"]){
								 removeBarchart();
								 makeBarchart(location, time_per_country);
						 	}
					 }
				 });
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

			// add legend to datamap
			var leg = {
				defaultFillName: "no data available for this country:",
			};

			map.legend(leg);

			// resize map when window size is changed
			d3.select(window).on('resize', function() {
        map.resize();
    });
		};

		// barchart displaying how time is used in the selected country
		function makeBarchart(location, time_per_country){
	    var margin = {top: 25, right: 20, bottom: 50, left: 50};
	    var fullwidth = 500;
	    var fullheight = 300;
	    var width = fullwidth - margin.left - margin.right;
	    var height = fullheight - margin.top - margin.bottom;

	    // Create SVG element
	    var svg = d3.select("#barchart")
	      .append("svg")
				 .attr("viewBox", [0, 0, fullwidth, fullheight])
	      .append("g")
	       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// select data for the country clicked
			for (var loc = 0; loc < time_per_country.length; loc++){
				if (time_per_country[loc][0]["LOCATION"] == location){
					var time_data = time_per_country[loc];
				}
			};

			// set x scale
			var xscale = d3.scale.ordinal()
				 .domain(d3.range(time_data.length))
			   .rangeRoundBands([0, width], .05);

			// set y scale
			var yscale = d3.scale.linear()
				 .domain([0, Math.max(time_data[3]["Value"])])
			   .range([height, margin.top]);

			// create axes
			var xaxis = d3.svg.axis()
			    .scale(xscale)
			    .orient("bottom")
			    .tickFormat(function(d) { return time_data[d]["Description"]; });

			var yaxis = d3.svg.axis()
			                  .scale(yscale)
			                  .orient("left")
												.ticks(6);

			svg.append("g")
			     .attr("class", "axis")
			     .attr("transform", "translate(0," + height + ")")
			     .call(xaxis)
					 .append("text")
					 .attr("text-anchor", "middle");

			 // x axis label
			 svg.append("text")
	     .attr("text-anchor", "end")
	     .attr("x", width)
	     .attr("y", height + 40)
			 .attr("dy", ".71em")
	     .text("Time use");

			// y axis label
			svg.append("g")
			    .attr("class", "axis")
			    .call(yaxis)
			  .append("text")
			    .text("Minutes per day")
			    .style("text-anchor", "end")
			    .attr("y", 5)
			    .attr("dy", ".71em")
			    .attr("transform", "rotate(-90)");

			// create the tooltip
			var tooltip = d3.tip()
			  .attr("class", "d3-tip")
			  .offset([-10, 0])
			  .html(function(d){
			     return "<strong>Minutes per day:</strong> <span style='color:crimson'>" + d.Value + "</span>"
			  });
				svg.call(tooltip);

			// create bars
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
				.on("mouseout", tooltip.hide);

			 // title of bar chart
			 svg.append("text")
		    .attr("x", (width / 2))
		    .attr("y", 0 - (margin.top/2))
		    .attr("text-anchor", "middle")
		    .style("font-size", "14px")
		    .text("Time use in " + location);
	};

	function removeBarchart(){
		d3.select("#barchart").select("svg").remove()
	};
