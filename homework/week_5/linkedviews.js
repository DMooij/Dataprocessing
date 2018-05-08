// Dewi Mooij
// 10752978
// D3 linked linkedviews

queue()
	.defer(d3.json, 'time.json')
	.defer(d3.json, 'life.json')
	.awaitAll(LoadData);

function LoadData(error, response){
  if (error) throw error;

    time_use = response[0];
    life_sat = response[1];

    console.log(time_use);
    console.log(life_sat);

    var time_per_country = [];
    var start = 0

    for (var country = 0; country < 30; country++)
    {
      var country_time = [];

      for (var time = start; time < (5 + start); time++)
      {
        country_time.push(time_use[time])
      }

      time_per_country.push(country_time);
      start += 5
    };

    console.log(time_per_country);

    // datamap for life satisfaction data
    var map = new Datamap({
      element: document.getElementById('container')
    });


    // below map make barchart that shows the time use in the country
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





};
