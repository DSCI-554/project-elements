<template>
    <div class="d3_map">
      <b-tabs content-class="mt-3">
        <b-tab title="D3.map" active>
          <div>
            <label for="datepicker">Choose a date</label>
            <b-form-datepicker id="datepicker" :min="min" :max="max" v-model="dateValue" class="mb-2" placeholder="Sunday, August 1, 2021"></b-form-datepicker>
          </div>
          <svg id='us_map'></svg>
        </b-tab>
        <b-tab title="Mapbox.map">
          <p>I'm the second tab</p>
          <b-row>
            <b-col>
              <b-container>
                <label for="datepicker1">Choose a date</label>
                <b-form-datepicker id="datepicker1" :min="min" :max="max" v-model="dateValue" class="mb-2" placeholder="Sunday, August 1, 2021"></b-form-datepicker>
              </b-container>
            </b-col>
            <b-col>
              <b-container>
                <label for="aiportpicker" >Choose Departure Airport</label>
                <b-form-select id = "airportpicker" v-model="selected" :options="options" size='lg'></b-form-select>
              </b-container>
            </b-col>
          </b-row>
          <!-- <div id='mbfm' class="mapbox_container"> -->
            <!-- <div class='map-overlay' id='features'><h2>Building Capacity</h2><div id='pd'><p>Hover over a building!</p></div></div> -->
            <!-- <div class='map-overlay' id='legend'></div> -->
          <!-- </div> -->
          <b-container id='mbfm' class="mapbox_container">
            <!-- Content here -->
            <div id='features'><h4>Flight Delay Info</h4><div id='pd'><p>Hover over a path!</p></div></div>

          </b-container>
        </b-tab>
      </b-tabs>
    </div>
</template>

<script>
import * as d3 from "d3"
import * as topojson from 'topojson'
import Mapbox from "mapbox-gl";
import * as turf from "@turf/turf";
// import { MglMap } from "vue-mapbox";

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
      max: '2021-08-31',
      selected: null,
      options: [
        { value: null,text: 'Please select an airport'},
        'ABQ','ANC','ATL','BDL','BHM','BNA','BOI','BOS','BTV','BWI','BZN','CHS','CLE','CLT','CRW','CVG','DCA','DEN','DFW','DSM','DTW',
        'EWR','FAR','FSD','GUM','HNL','ICT','ILG','IND','JAC','JAN','JFK','LAS','LAX','LIT','MCO','MHT','MKE','MSP','MSY','OKC','OMA',
        'ORD','PDX','PHL','PHX','PVD','PWM','SEA','SJU','SLC','STL','STT'],
      routes: {
        'type': 'FeatureCollection',
        'features': []
      },
      map: null
    }
  }, 
  watch: {
    selected() {
      if (this.selected != null) {
        this.updateRoute()
      }
    }
  },
  methods: {
    drawPath(state) {
      var stateData = this.flightsData.filter(d => d.ORIGIN_STATE_NM == state && d.FL_DATE == this.dateValue)
      var local_airport = stateData[0].ORIGIN
      if (this.curr_airport == null){
        this.curr_airport = local_airport
        var link = []
        for (let i = 0; i < stateData.length; i++) {
          var from = stateData[i].ORIGIN
          var to = stateData[i].DEST
          // var from_city = stateData[i].ORIGIN_CITY_NAME
          // var to_city = stateData[i].DEST_CITY_NAME
          var del_t = stateData[i].ARR_DELAY
          var carrier = stateData[i].CARRIER_DELAY
          var weather = stateData[i].WEATHER_DELAY
          var nas = stateData[i].NAS_DELAY
          var sec = stateData[i].SECURITY_DELAY
          var aircraft = stateData[i].LATE_AIRCRAFT_DELAY
          var from_lng = this.airport_geo.filter(d => d.local_code == from)[0].longitude_deg
          var from_lat = this.airport_geo.filter(d => d.local_code == from)[0].latitude_deg
          var to_lng = this.airport_geo.filter(d => d.local_code == to)[0].longitude_deg
          var to_lat = this.airport_geo.filter(d => d.local_code == to)[0].latitude_deg
          link.push({
            type: "LineString",
            coordinates: [[from_lng, from_lat],[to_lng, to_lat]],
            from: from,
            to: to,
            del_t: del_t,
            carrier: carrier,
            weather: weather,
            nas: nas,
            sec: sec,
            aircraft: aircraft

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
            .on('mouseover', function () {
              d3.select(this)
              .style('stroke', 'red')
              .style('stroke-width', 8)
            })
            .on('mouseout', function () {
              d3.select(this)
                .style('stroke', 'orange')
                .style('stroke-width', 2)
            })
            .append('title')
            .text(d => `From: ${d.from} \nTo: ${d.to} \nDelayed Time: ${del_t} \nCarrier: ${carrier} \nWeather: ${weather} \nNAS: ${nas} \n Security: ${sec} \nAircraft: ${aircraft}`)
            
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
      var path = d3.geoPath();
      
				svg.append('g')
					.attr('class', 'states')
					.selectAll('path')
					.data(topojson.feature(this.mapData, this.mapData.objects.states).features)  
					.enter()
					.append('path')
          .attr('onclick', d => (`drawPath('${d.properties.name}')`))
					.attr('d', path)
        
			
				svg.append('path')  //🎒 explain:
					.attr('class', 'state-borders')
					.attr('d', path(topojson.mesh(this.mapData, this.mapData.objects.states, (a, b) => a !== b))); 
    },
    buildMapbox () {
      Mapbox.accessToken = 'pk.eyJ1Ijoid2xvdSIsImEiOiJja3Y2cGEwMm8xbWtsMm5ubmNtd2tlNnE0In0.Wy7wOVN5-NJ6Ye8kzCVcBg';
      const map = new Mapbox.Map({
        container: 'mbfm', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        center: [-98.583333,39.833333], // starting position [lng, lat]
        zoom: 3.5 // starting zoom
      });

      const route = {
        'type': 'FeatureCollection',
        'features': []
      }
      map.on('load', function () { 
        map.resize()
        // map.resize()
        map.addSource(`route`, {
          'type': 'geojson',
          'data': route
        })
        map.addLayer({
          'id': `route`,
          'source': `route`,
          'type': 'line',
          'paint': {
            'line-width': 2,
            'line-color': '#007cbf'
          }
        })
      })
      this.map = map
    },
    updateRoute () {
      this.routes = {
        'type': 'FeatureCollection',
        'features': []
        }
      if (this.selected != null) {
        var stateData = this.flightsData.filter(d => d.ORIGIN == this.selected && d.FL_DATE == this.dateValue)
        for (let i = 0; i < stateData.length; i++) {
          var from = stateData[i].ORIGIN
          var to = stateData[i].DEST
          var cName = stateData[i].MKT_UNIQUE_CARRIER
          var fNum = stateData[i].MKT_CARRIER_FL_NUM
          var del_t = stateData[i].ARR_DELAY
          var del_reason = []
          if (stateData[i].CARRIER_DELAY != 0) {
            del_reason.push(`Carrier: ${stateData[i].CARRIER_DELAY} mins`)
          }
          if (stateData[i].WEATHER_DELAY != 0) {
            del_reason.push(`Weather: ${stateData[i].WEATHER_DELAY} mins`)
          }
          if (stateData[i].NAS_DELAY != 0) {
            del_reason.push(`NAS: ${stateData[i].NAS_DELAY} mins`)
          }
          if (stateData[i].SECURITY_DELAY != 0) {
            del_reason.push(`Security: ${stateData[i].SECURITY_DELAY} mins`)
          }
          if (stateData[i].LATE_AIRCRAFT_DELAY != 0) {
            del_reason.push(`Aircraft: ${stateData[i].LATE_AIRCRAFT_DELAY} mins`)
          }
          // var carrier = stateData[i].CARRIER_DELAY
          // var weather = stateData[i].WEATHER_DELAY
          // var nas = stateData[i].NAS_DELAY
          // var sec = stateData[i].SECURITY_DELAY
          // var aircraft = stateData[i].LATE_AIRCRAFT_DELAY
          var from_lng = this.airport_geo.filter(d => d.local_code == from)[0].longitude_deg
          var from_lat = this.airport_geo.filter(d => d.local_code == from)[0].latitude_deg
          var to_lng = this.airport_geo.filter(d => d.local_code == to)[0].longitude_deg
          var to_lat = this.airport_geo.filter(d => d.local_code == to)[0].latitude_deg
          // const destination = [-77.032, 38.913];

          // A simple line from origin to destination.
          var greatCircle = turf.greatCircle([from_lng, from_lat],[to_lng, to_lat], {
            properties: {'cName': cName,
                         'fNum': fNum,
                         'del_t': del_t,
                         'del_r': del_reason.join(', ')
                        }
            });
          this.routes.features.push(greatCircle)
          
        }
      }
      this.map.getSource('route').setData(this.routes);
      this.map.on('click', 'route', (d) => {
        var path = document.getElementById('pd');
        path.innerHTML = `<div>Flight: ${d.features[0].properties.cName} ${d.features[0].properties.fNum}</div>` + 
                         `<div>Delay Time(mins): ${d.features[0].properties.del_t}</div>` +
                         `<div>Reason: ${d.features[0].properties.del_r}</div>`
      })
      this.map.on('mouseenter', 'route', () => {
        this.map.getCanvas().style.cursor = 'pointer';
        });
        
        // Change the cursor back to a pointer
        // when it leaves the states layer.
      this.map.on('mouseleave', 'route', () => {
        this.map.getCanvas().style.cursor = '';
        });
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
        this.buildMapbox()
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
      this.buildMapbox()
    }
  }
}
</script>

<style>
.states {
  fill: #ccc;
}
		
.singlePath{
  /* .style("fill", "none")
            .style("stroke", "orange")
            .style("stroke-width", 2) */
  stroke-width: 4;
}
.singlePath :hover {
  /* .style("fill", "none")
            .style("stroke", "orange")
            .style("stroke-width", 2) */
  stroke: red;
  stroke-width: 4;
}



.state-borders {
  fill: none;
  stroke: white;
  /* stroke-width: 0.5px; */
  stroke-linejoin: round;
  stroke-linecap: round;
  pointer-events: none;
}
.mapbox_container {
    position: relative;
    height: 610px !important;
    width: 975px !important;
    display: inline-block;
    z-index: 1;
}

#airportpicker{
  display: block;
  width: 100%;
  height: 100%;
}

#features {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  margin-right: 20px;
  margin-left: 20px;
  font-family: Arial, sans-serif;
  overflow: auto;
  border-radius: 3px;
  right: 0;
  height: 100px;
  margin-top: 20px;
  width: 300px;
  z-index: 2;
  padding-left: 20px;
  text-anchor: middle;
}
</style>