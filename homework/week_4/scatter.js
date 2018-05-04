// Dewi Mooij
// 10752978
// D3 scatterplot
// information on how to use d3 was obtained from https://alignedleft.com/tutorials/d3/
// information on how to update a d3 chart was obtained from https://bl.ocks.org/anupsavvy/9513382

window.onload = function() {
  console.log("Yes, you can!")
};

//  get data APIs
var pop_met_area_data = "https://stats.oecd.org/SDMX-JSON/data/CITIES/AUT+BEL+CZE+DEU+DNK+EST+ESP+FIN+FRA+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SWE+SVN+GBR.POP/all?startTime=2000&endTime=2014&dimensionAtObservation=allDimensions"

var pop_density_data = "https://stats.oecd.org/SDMX-JSON/data/CITIES/AUT+BEL+CZE+DEU+DNK+EST+ESP+FIN+FRA+GRC+HUN+IRL+ITA+NLD+NOR+POL+PRT+SWE+SVN+GBR.POP_DENS/all?startTime=2000&endTime=2014&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, pop_met_area_data)
  .defer(d3.request, pop_density_data)
.awaitAll(loadData);

// Load data to plot scatterplot
function loadData(error, response) {
  if (error) throw error;

      // parse responses to JSON
      var jsonpopmet = JSON.parse(response[0].responseText);
      var jsonpopdens = JSON.parse(response[1].responseText);

      // store countries
      var places = []

      for (place = 0; place < 20; place++)
      {
          place_met = jsonpopmet["structure"]["dimensions"]["observation"]["0"]["values"][place]["name"]
          places.push(place_met)
      }

      // store all metropolitan areas, new array for every year
      var pop_met_area = [];

      for (year0 = 0; year0 < 15; year0++)
      {
        var met_area = [];

        for (area0 = 0; area0 < 20; area0++)
        {
            popmet = jsonpopmet["dataSets"]["0"]["observations"][area0 + ":0:" + year0][0]
            met_area.push(popmet)
        }
          pop_met_area.push(met_area)
      }

      // store population density of each area, new array for every year
      var pop_density = [];

      for (year1 = 0; year1 < 15; year1++)
      {
        var dens_area = [];

        for (area1 = 0; area1 < 20; area1++)
        {
            denspop = jsonpopdens["dataSets"]["0"]["observations"][area1 + ":0:" + year1][0]
            dens_area.push(denspop)
        }
          pop_density.push(dens_area)
      }

      // store population density and population metropolitan area as x and y in data
      var data = [];

      for (datapoint = 0; datapoint < 15; datapoint++)
      {
        var datap = [];

        for (dp = 0; dp < 20; dp++)
        {
            datapopmetdens = [pop_met_area[datapoint][dp], pop_density[datapoint][dp]]
            datap.push(datapopmetdens)
        }
        data.push(datap);
      }

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

      // colorbrewer category20 colors
      var color = d3.scaleOrdinal(d3.schemeCategory20);

      // create circles for scatterplot, initialize with data from the year 2000
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
        .attr("r", 8)
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

        // text y axis
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
          .attr('transform', function(d,i){ return 'translate(0,' + i * 21 + ')'; });

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
              return (d); });

        // update chart to other years in the period 2000-2014
        d3.selectAll(".year")
          .on("click", function(){

              // get data for selected year
              var value = this.getAttribute("value");
              var yeardata;

              if (value == "2000"){
                yeardata = data[0]
              };
              if (value == "2001"){
                yeardata = data[1]
              };
              if (value == "2002"){
                yeardata = data[2]
              };
              if (value == "2003"){
                yeardata = data[3]
              };
              if (value == "2004"){
                yeardata = data[4]
              };
              if (value == "2005"){
                yeardata = data[5]
              };
              if (value == "2006"){
                yeardata = data[6]
              };
              if (value == "2007"){
                yeardata = data[7]
              };
              if (value == "2008"){
                yeardata = data[8]
              };
              if (value == "2009"){
                yeardata = data[9]
              };
              if (value == "2010"){
                yeardata = data[10]
              };
              if (value == "2011"){
                yeardata = data[11]
              };
              if (value == "2012"){
                yeardata = data[12]
              };
              if (value == "2013"){
                yeardata = data[13]
              };
              if (value == "2014"){
                yeardata = data[14]
              };

                // rescale x scale
                var xscale = d3.scaleLinear()
                   .domain([0, d3.max(yeardata, function(d) { return d[0];})])
                   .range([0, width])

                // rescale y scale
                var yscale = d3.scaleLinear()
                   .domain([0, d3.max(yeardata, function(d) { return d[1];})])
                   .range([height, margin.top]);

                // update scatterplot
                svg.selectAll("circle")
                  .data(yeardata)
                  .transition()
                  .duration(1000)
                  .attr("cx", function(d) {
                       return xscale(d[0]);
                  })
                  .attr("cy", function(d) {
                       return yscale(d[1]);
                  })
                  .attr("r", 8)
                  .style('fill', function(d){
                      return color(d); });

                  // update x axis
                  svg.select("axis")
                      .transition()
                      .duration(1000)
                      .call(d3.axisBottom(xscale))

                  // update y axis
                  svg.select("axis")
                      .transition()
                      .duration(100)
                      .call(d3.axisLeft(yscale))
          });
};
