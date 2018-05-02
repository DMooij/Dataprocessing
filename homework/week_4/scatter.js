// Dewi Mooij
// 10752978

window.onload = function() {
  console.log("Yes, you can!")
};

var pop_met_area_data = "https://stats.oecd.org/SDMX-JSON/data/CITIES/AUT+BEL+CZE+DEU+DNK+EST+ESP+FIN+FRA+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SWE+SVN+SVK+GBR.POP/all?startTime=2000&endTime=2014&dimensionAtObservation=allDimensions"

var pop_density_data = "https://stats.oecd.org/SDMX-JSON/data/CITIES/AUT+BEL+CZE+DEU+DNK+EST+ESP+FIN+FRA+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SWE+SVN+SVK+GBR.POP_DENS/all?startTime=2000&endTime=2014&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, pop_met_area_data)
  .defer(d3.request, pop_density_data)
.awaitAll(loadData);

function loadData(error, response) {
  if (error) throw error;

      // parse responses to JSON
      var jsonpopmet = JSON.parse(response[0].responseText);
      var jsonpopdens = JSON.parse(response[1].responseText);

      // store metropolitan areas
      var places = []

      for (place = 0; place < 21; place++)
      {
          place_met = jsonpopmet["structure"]["dimensions"]["observation"]["0"]["values"][place]["name"]
          places.push(place_met)
      }

      console.log(places)

      // store all metropolitan areas, new array for every year
      var pop_met_area = [];

      for (year0 = 0; year0 < 15; year0++)
      {
        var met_area = [];

        for (area0 = 0; area0 < 21; area0++)
        {
            popmet = jsonpopmet["dataSets"]["0"]["observations"][area0 + ":0:" + year0][0]
            met_area.push(popmet)
        }
          pop_met_area.push(met_area)
      }
      console.log(pop_met_area)

      // store population density of each area, new array for every year
      var pop_density = [];

      for (year1 = 0; year1 < 15; year1++)
      {
        var dens_area = [];

        for (area1 = 0; area1 < 21; area1++)
        {
            denspop = jsonpopdens["dataSets"]["0"]["observations"][area1 + ":0:" + year1][0]
            dens_area.push(denspop)
        }
          pop_density.push(dens_area)
      }
      console.log(pop_density)

      // store population density and population metropolitan area as x and y in data
      var data = [];

      for (datapoint = 0; datapoint < 15; datapoint++)
      {
        var datap = [];

        for (dp = 0; dp < 21; dp++)
        {
            datapopmetdens = [pop_met_area[datapoint][dp], pop_density[datapoint][dp]]
            datap.push(datapopmetdens)
        }
        data.push(datap);
      }

      console.log(data);

      // set width and height of svg and scatterplot area
      var margin = {top: 10, right: 200, bottom: 70, left: 60};
      var fullwidth = 1000;
      var fullheight = 500;
      var width = fullwidth - margin.left - margin.right;
      var height = fullheight - margin.top - margin.bottom;

      // Create SVG element
      var svg = d3.select("body")
        .append("svg")
         .attr("width", fullwidth)
         .attr("height", fullheight)
        .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       // set x scale
       var xscale = d3.scaleLinear()
          .domain([0, d3.max(data[0], function(d) { return d[0];})])
          .range([0, width])

       // set y scale
       var yscale = d3.scaleLinear()
          .domain([0, d3.max(data[0], function(d) { return d[1];})])
          .range([height, margin.top]);

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      // create circles
      svg.selectAll("circle")
        .data(data[0])
        .enter()
        .append("circle")
        .attr("cx", function(d) {
             return xscale(d[0]);
        })
        .attr("cy", function(d) {
             return yscale(d[1]);
        })
        .attr("r", 5)
        .style('fill', function(d){
            return color(d); });

        // create x axis
        svg.append("g")
             .attr("class", "axis")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(xscale))

         // text x axis
         svg.append("text")
             .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 30) + ")")
             .style("text-anchor", "middle")
             .text("Total population of the metropolitan area (persons)");

        // create y axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yscale))

        // text  y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Population density (persons per km2)");

        // create legend
        var legend = svg.selectAll('legend')
          .data(color.domain())
          .enter().append('g')
          .attr('class', 'legend')
          .attr('transform', function(d,i){ return 'translate(0,' + i * 20 + ')'; });

        // create rectangles for legend
        legend.append('rect')
          .attr('x', fullwidth - margin.right)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', color);

        // add text to rectangles in legend
        legend.append('text')
          .attr('x', fullwidth - margin.right + 20)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'start')
          .data(places)
          .text(function(d){
              return (d); });;

};


// update charset

            d3.select("dropdown")
                .on("click", function() {
                    // var numValues = dataset.length;  // Get original dataset's length
                    // var maxRange = Math.random() * 1000;  // Get max range of new values
                    // dataset = [];  // Initialize empty array
                    // for(var i=0; i<numValues; i++) {
                    //     var newNumber1 = Math.floor(Math.random() * maxRange);  // Random int for x
                    //     var newNumber2 = Math.floor(Math.random() * maxRange);  // Random int for y
                    //     dataset.push([newNumber1, newNumber2]);  // Add new numbers to array

                    // Update scale domains
                    xscale.domain([0, d3.max(data, function(d) {
                        return d[0]; })]);
                    yscale.domain([0, d3.max(data, function(d) {
                        return d[1]; })]);

                    // Update circles
                    svg.selectAll("circle")
                        .data(data)  // Update with new data
                        .transition()  // Transition from old to new
                        .duration(1000)  // Length of animation
                        // .each("start", function() {  // Start animation
                        //     d3.select(this)  // 'this' means the current element
                        //         .attr("fill", "red")  // Change color
                        //         .attr("r", 5);  // Change size
                        // })
                        // .delay(function(d, i) {
                        //     return i / dataset.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                        // })
                        //.ease("linear")  // Transition easing - default 'variable' (i.e. has acceleration), also: 'circle', 'elastic', 'bounce', 'linear'
                        .attr("cx", function(d) {
                            return xscale(d[0]);  // Circle's X
                        })
                        .attr("cy", function(d) {
                            return yscale(d[1]);  // Circle's Y
                        })
                        // .each("end", function() {  // End animation
                        //     d3.select(this)  // 'this' means the current element
                        //         .transition()
                        //         .duration(500)
                        //         .attr("fill", "black")  // Change color
                        //         .attr("r", 2);  // Change radius
                        // });

                        // Update X Axis
                        svg.select(".x.axis")
                            .transition()
                            .duration(1000)
                            .call(d3.axisBottom(xscale));

                        // Update Y Axis
                        svg.select(".y.axis")
                            .transition()
                            .duration(100)
                            .call(d3.axisLeft(yscale));
                });
