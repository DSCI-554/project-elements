<template>
    <div class="d3_map">
      <h1>This is an Map page</h1>
      <div>
        <label for="datepicker">Choose a date</label>
        <b-form-datepicker id="datepicker" :min="min" :max="max" v-model="dateValue" class="mb-2" placeholder="Sunday, August 1, 2021"></b-form-datepicker>
        <p>Value: '{{ dateValue }}'</p>
      </div>
      <svg id='us_map'></svg>
    </div>
</template>

<script>
import * as d3 from "d3"
import * as topojson from 'topojson'

export default {
  name: 'us_map',
  data: function () {

    return {
      mapData: null,
      flightsData: null,
      rawData: null,
      airport_geo: null,
      curr_airport: null,
      dateValue: '2021-08-01',
      min: '2021-08-01',
      max: '2021-08-31'
    }
  }, 
  methods: {
    drawPath(state) {
      console.log(state)
      console.log(this.curr_state)
      var stateData = this.flightsData.filter(d => d.ORIGIN_STATE_NM == state && d.FL_DATE == this.dateValue)
      var local_airport = stateData[0].ORIGIN
      if (this.curr_airport == null){
        this.curr_airport = local_airport
        var link = []
        for (let i = 0; i < stateData.length; i++) {
          var from = stateData[i].ORIGIN
          var to = stateData[i].DEST
          var from_lng = this.airport_geo.filter(d => d.local_code == from)[0].longitude_deg
          var from_lat = this.airport_geo.filter(d => d.local_code == from)[0].latitude_deg
          var to_lng = this.airport_geo.filter(d => d.local_code == to)[0].longitude_deg
          var to_lat = this.airport_geo.filter(d => d.local_code == to)[0].latitude_deg
          link.push({
            type: "LineString",
            coordinates: [[from_lng, from_lat],[to_lng, to_lat]]
          })
        }
        var projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
        var path = d3.geoPath().projection(projection);
        var svg = d3.select('#us_map')
        svg.selectAll("myPath")
          .data(link)
          .enter()
          .append("path")
            .attr('class', `${this.curr_airport}`)
            .attr('display', 'visible')
            .attr("d", function(d){ return path(d)})
            .style("fill", "none")
            .style("stroke", "orange")
            .style("stroke-width", 2)
      } else if (this.curr_airport == local_airport) {
        d3.selectAll(`.${this.curr_airport}`)
          .attr('display', 'none')
        this.curr_airport = null
      } else {
        alert('click the state shown first')
      }
      
    },
    created(){window.drawPath =this.drawPath;},
    buildMap () {
      // var drawPath = this.drawPath()
      var svg = d3.select('#us_map')
        .attr('viewBox', [0, 0, 975, 610])
      // var projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);
      var path = d3.geoPath();
      
				svg.append('g')
					.attr('class', 'states')
					.selectAll('path')
					.data(topojson.feature(this.mapData, this.mapData.objects.states).features)  
					.enter()
					.append('path')
          .attr('onclick', d => (`drawPath('${d.properties.name}')`))
					.attr('d', path)
          
          // .attr('onclick', d => `alert('${d.properties.name}')`)
          // .on('click', d => (`drawPath('${d.properties.name}')`))
			
				svg.append('path')  //🎒 explain:
					.attr('class', 'state-borders')
					.attr('d', path(topojson.mesh(this.mapData, this.mapData.objects.states, (a, b) => a !== b))); 
        // svg.selectAll("circle")
        //   .data(airports).enter()
        //   .append("circle")
        //   .attr('class', 'airport')
        //   .attr("cx", d => { return projection(d)[0]})
        //   .attr("cy", d => { return projection(d)[1]})
        //   .attr("r", "4px")
        //   .attr("fill", "red")
    }
  },
  mounted: function () {
    if (!this.$store.state.htmlMapData) {
      var promises = []
      promises.push(d3.json('states-albers-10m.json'))
      promises.push(d3.csv('flights.csv'))
      promises.push(d3.csv('airport_geo.csv'))
      Promise.all(promises).then(values => {
        this.rawData = values
        this.mapData = values[0]
        this.flightsData = values[1]
        this.airport_geo = values[2]
        this.$store.commit('htmlMapData', this.rawData);
        this.created();
        this.buildMap();
      })
      // d3.json('states-albers-10m.json').then(data => {
      //   this.mapData = data;
      //   // console.log('chartData set from file');
      //   // console.log('chartData contains', this.mapData);
      //   this.$store.commit('htmlMapData', this.mapData);

      //   this.buildMap();
      //   });
    } else {
      this.rawData = this.$store.state.htmlMapData;
      this.mapData = this.rawData[0]
      this.flightsData = this.rawData[1]
      this.airport_geo = this.rawData[2]
      // console.log('chartData set from store');
      // console.log('chartData contains', this.mapData.length, 'rows');
      this.created();
      this.buildMap();
    }
  }
}
</script>

<style>
.states {
  fill: #ccc;
}
		
.airport :hover {
  fill:black;
}

.state-borders {
  fill: none;
  stroke: white;
  /* stroke-width: 0.5px; */
  stroke-linejoin: round;
  stroke-linecap: round;
  pointer-events: none;
}
</style>