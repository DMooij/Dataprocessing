// Dewi Mooij
// 10752978
// D3 linked linkedviews

queue()
	.defer(d3.json, 'time.json')
	.defer(d3.json, 'life.json')
	.awaitAll(LoadData);

function LoadData(error, response){
  if (error) throw error;

    var time_use = response[0];
    var life_satJSON = response[1];

		console.log(life_satJSON)

			var loc = [];

			for (var i = 1; i < life_satJSON.length; i++){
					loc.push({
						key:   life_satJSON[i]["LOCATION"],
						value: life_satJSON[i]["Value"]
			})

		}

		// console.log(location)
		console.log(loc)

		console.log(loc[1])

		// create arrays per country for the bar chart
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

    console.log(time_per_country);

    // datamap for life satisfaction data
    var map = new Datamap({
      element: document.getElementById('container'),
			fills: {
				 defaultFill: 'firebrick'
		 },
		 // data: {
			// 	 // IRL: {
			// 		// 	 fillKey: 'LOW',
			// 		// 	 numberOfThings: 2002
			// 	 // },
			// 	 // USA: {
			// 		// 	 fillKey: 'MEDIUM',
			// 		// 	 numberOfThings: 10381
			// 	 // }
		 // },
		 geographyConfig: {
				 popupTemplate: function(geo, data) {
						 return ['<div class="hoverinfo"><strong>',
										 'Life satisfaction in ' + geo.properties.name,
										 ': ' + life_satJSON.Value,
										 '</strong></div>'].join('');
				 }
		 }
 });

    // below map make barchart that shows the time use in the country when clicked

    // set width and height of svg and bar chart area
    var margin = {top: 10, right: 20, bottom: 70, left: 50};
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

			 var xscale = d3.scale.ordinal()
          .domain(time_per_country[0].map(function(d) { return d.Description;}))
          .rangeRoundBands([0, width], .05);

       // set y scale
       var yscale = d3.scale.linear()
          .domain([0, d3.max(time_per_country[0], function(d) { return d.Value;})])
          .range([height, margin.top]);

       // create the tooltip
       // var tooltip = d3.tip()
       //   .attr("class", "d3-tip")
       //   .offset([-10, 0])
       //   .html(function(d){
       //      return "<strong>Sightings:</strong> <span style='color:green'>" + d + "</span>"
       //   });
			 //
       // svg.call(tooltip);

       // create bar chart and make tooltip pop up
       svg.selectAll("rect")
         .data(time_per_country[0])
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
         // .on("mouseover", tooltip.show)
         // .on("mouseout", tooltip.hide)

       // create axes
       var xaxis = d3.svg.axis()
           .scale(xscale)
           .orient("bottom")
           .tickFormat(function(d) { return time_per_country[d]; })

       var yaxis = d3.svg.axis()
                         .scale(yscale)
                         .orient("left")

       // x axis
       svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xaxis)
           .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(60)")
            .style("text-anchor", "start");

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

     // });





};
