// Dewi Mooij
// 10752978

window.onload = function() {
  console.log("Yes, you can!")
};

var pop_met_area = "http://stats.oecd.org/SDMX-JSON/data/CITIES/AUT+AT001+AT002+AT003+BEL+BE001+BE002+BE003+BE005+CHE+CH001+CH002+CH003+CZE+CZ001+CZ002+CZ003+DEU+DE001+DE002+DE003+DE004+DE005+DE007+DE006+DE008+DE009+DE010+DE011+DE012+DE013+DE014+DE015+DE027+DE033+DE034+DE035+DE040+DE501+DE502+DE504+DE507+DNK+DK001+EST+EE001+ESP+ES001+ES002+ES003+ES004+ES005+ES006+ES008+ES019+FIN+FI001+FRA+FR001+FR003+FR203+FR004+FR006+FR007+FR008+FR009+FR010+FR011+FR013+FR026+FR032+FR205+FR215+GRC+GR001+GR002+HUN+HU001+IRL+IE001+ITA+IT001+IT002+IT003+IT004+IT005+IT006+IT007+IT008+IT009+IT010+IT011+NLD+NL002+NL001+NL003+NL004+NL005+NOR+NO001+POL+PL001+PL010+PL002+PL003+PL004+PL005+PL006+PL009+PRT+PT001+PT002+SWE+SE001+SE002+SE003+SVN+SI001+SVK+SK001+GBR+UK001+UK002+UK003+UK004+UK005+UK006+UK007+UK008+UK009+UK010+UK011+UK017+UK023+UK097+UK098.POP/all?startTime=2000&endTime=2014&dimensionAtObservation=allDimensions"

var pop_density = "http://stats.oecd.org/SDMX-JSON/data/CITIES/AUT+AT001+AT002+AT003+BEL+BE001+BE002+BE003+BE005+CHE+CH001+CH002+CH003+CZE+CZ001+CZ002+CZ003+DEU+DE001+DE002+DE003+DE004+DE005+DE007+DE006+DE008+DE009+DE010+DE011+DE012+DE013+DE014+DE015+DE027+DE033+DE034+DE035+DE040+DE501+DE502+DE504+DE507+DNK+DK001+EST+EE001+ESP+ES001+ES002+ES003+ES004+ES005+ES006+ES008+ES019+FIN+FI001+FRA+FR001+FR003+FR203+FR004+FR006+FR007+FR008+FR009+FR010+FR011+FR013+FR026+FR032+FR205+FR215+GRC+GR001+GR002+HUN+HU001+IRL+IE001+ITA+IT001+IT002+IT003+IT004+IT005+IT006+IT007+IT008+IT009+IT010+IT011+NLD+NL002+NL001+NL003+NL004+NL005+NOR+NO001+POL+PL001+PL010+PL002+PL003+PL004+PL005+PL006+PL009+PRT+PT001+PT002+SWE+SE001+SE002+SE003+SVN+SI001+SVK+SK001+GBR+UK001+UK002+UK003+UK004+UK005+UK006+UK007+UK008+UK009+UK010+UK011+UK017+UK023+UK097+UK098.POP_DENS/all?startTime=2000&endTime=2014&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, pop_met_area)
  .defer(d3.request, pop_density)
.awaitAll(loadData);

function loadData(error, response) {
  if (error) throw error;

      var jsonpopmet = JSON.parse(response[0].responseText);

      // store metropolitan population for each area for the 15 years
      var met_area_pop = [];

      for (area0 = 0; area0 < 136; area0++)
      {
        var met_area = [];

        for (year0 = 0; year0 < 15; year0++)
        {
            popmet = jsonpopmet["dataSets"]["0"]["observations"][area0 + ":0:" + year0][0]
            met_area.push(popmet)
        }
          met_area_pop.push(met_area)
      }
      console.log(met_area_pop)

      var jsonpopdens = JSON.parse(response[1].responseText);

      // store population density for each area for the 15 years
      var pop_dens = [];

      for (area1 = 0; area1 < 136; area1++)
      {
        var dens_area = [];

        for (year1 = 0; year1 < 15; year1++)
        {
            denspop = jsonpopdens["dataSets"]["0"]["observations"][area1 + ":0:" + year1][0]
            dens_area.push(denspop)
        }
          pop_dens.push(dens_area)
      }
      console.log(pop_dens)

};

// function updateChart(year){
//
// }
