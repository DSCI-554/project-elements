<template>
    <div class="about">
    <b-tabs content-class="mt-3">
        <b-tab title="Analysis on Carriers" active>
          <b-button v-b-toggle.collapse-2 class="m-1">Instruction</b-button>

            <!-- Using value -->
            <b-button v-b-toggle="'collapse-1'" class="m-1">Explanation</b-button>

            <!-- Element to collapse -->
            <b-collapse visible id="collapse-2">
              <b-card>
                The Line chart shows the number of delayed flight on each day in August 2020. <br> 
                It'll show carrier name when hovered over on lines. <br>
                When "Show Guideline & Curtain" is checked during the initial animation, <br>
                the progress of line drawing will show. <br> 
                For explanation of this page, please click the <code>Explanation</code> button
              </b-card>
            </b-collapse>
            <b-collapse id="collapse-1">
              <b-card>
                Through out time, Carrier AA has the most delayed flight count, and Carrier HA has the least. <br>
                However, major carriers do have more flights on each day to begin with,<br>
                which directly increase the delayed flight count.<br>
                This phenomenon can be observed by the gap (between 200~300 in y-axis) in line chart between carriers, <br>
                where the 4 major carriers AA, UA, WN, and DL are above the gap while the rest is below.
              </b-card>
            </b-collapse>

            <h1>Which carriers have more delay?</h1>
            <div class="title">Interactive & Animated Line Chart: Number Of Delayed Flight Count For Carriers Through Time</div>
            <br />
            <label class="guideline">
              Show Guideline & Curtain
              <input type="checkbox" id="show_guideline"/>
            </label>
            <br />
            <svg width="1200" height="600" id="line_chart"></svg>
        </b-tab>

        <b-tab title="Analysis on States">
          <b-button v-b-toggle.collapse-3 class="m-1">Instruction</b-button>

          <!-- Using value -->
          <b-button v-b-toggle="'collapse-4'" class="m-1">Explanation</b-button>

          <!-- Element to collapse -->
          <b-collapse visible id="collapse-3">
            <b-card>
              The treemap shows the count of delayed flight on each state in the U.S..<br>
              Select "Weekday" to see data on a typical weekday, and "Weekend" for a typical weekend data. <br>
              Mouse over each state to check the details. <br>
              For explanation of this page, please click the <code>Explanation</code> button
            </b-card>
          </b-collapse>
          <b-collapse id="collapse-4">
            <b-card>
              The states are sorted and colored by their geographical division. <br>
              The detailed information of each state can be found when you put mouse on each state,<br>
              including their geographical division, state name, and exact count of delayed flight.<br>
              One key advantage of treemap is that it can show the proportion of delayed flight directly through the size of each cell.<br>
              Larger cells contain more flight delays.
            </b-card>
          </b-collapse>
            <h1>What is proportion of the delayed flight count for each state?</h1>
            <div class="title"> Treemap: Number Of Delayed Flight Count of Each State with Comparsion on Weekend and Weekday</div>
            <label class="selection"><input type="radio" name="mode" value="sumBySat" checked> Weekend</label>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <label class="selection"><input type="radio" name="mode" value="sumByWed"> Weekday</label>
            <br />
            <svg width="960" height="960" id="treemap"></svg>
        </b-tab>

        <b-tab title="Analysis on Reasons">
          <b-button v-b-toggle.collapse-6 class="m-1">Instruction</b-button>

            <!-- Using value -->
            <b-button v-b-toggle="'collapse-5'" class="m-1">Explanation</b-button>

            <!-- Element to collapse -->
            <b-collapse visible id="collapse-6">
              <b-card>
                Hover over each section to see the percentage value of each delay reason.
                For explanation of this page, please click the <code>Explanation</code> button
              </b-card>
            </b-collapse>
            <b-collapse id="collapse-5">
              <b-card>
                The most frequent reason of flight delay is Air Carrier Delay(38%), <br>
                followed by delays caused by Aircraft Arriving Late (34%). <br>
                Delays caused by Security reason is the least. <br>
                Surprisingly, delays caused by weather is only 5%.
              </b-card>
            </b-collapse>

            <h1>What are the reasons a flight gets delayed?</h1>
            <div class="title"> Donut Chart: Percentage of Each Delayed Reasons</div>
            <br/>
            <svg width="600" height="600" id="pie_chart"></svg>
        </b-tab>
    </b-tabs>
  </div>
</template>

<script>

import * as d3 from 'd3';
import {nest} from 'd3-collection';

export default {
  name: 'd3Chart',
  data: function () {
    return {
      rawData: null,
      lineData: null,
      region:null,
      treemapData:null,
      pieData:null
    }
  },
  methods: {
    buildLineChart() {

      var lineOpacity = "0.25";
      var lineOpacityHover = "0.85";
      var otherLinesOpacityHover = "0.25";
      var lineStroke = "2px";
      var lineStrokeHover = "3.5px";
      /*
      var circleOpacity = '0.85';
      var circleOpacityOnLineHover = "0.25"
      var circleRadius = 3;
      var circleRadiusHover = 6;*/

      var parseDate = d3.timeParse("%Y-%m-%d");

      var data = this.lineData;
      //console.log(data[0].FL_DATE); //this works

      data.forEach(function(d) { 
        d.date = parseDate(d.FL_DATE);
        d.carrier = d.MKT_UNIQUE_CARRIER;
        d.delay = +d.NUM_OF_DELAY;  

      });

      
      var sumstat = nest() // nest function allows to group the calculation per level of a factor
          .key(function(d) { return d.carrier;})
          .entries(data);

      //console.log(sumstat); //working

      var arr_time = d3.extent(data, function(d) { return d.date; })
      
      var margin = {top: 10, right: 30, bottom: 30, left: 60},
          width = 1200 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select("#line_chart")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      //console.log(arr_time); //working
      //Add x-axis
      var x = d3.scaleLinear()
        .domain(arr_time)
        .range([ 0, width ]);
      svg.append("g")
        .transition()
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(32).tickFormat(d3.timeFormat('%b %d')));

      var max_data = d3.max(data, function(d) { return +d.delay; })
      //console.log(max_data)

      // Add y-axis
      var y = d3.scaleLinear()
        .domain([0, max_data])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y))
        .append('text')
        .attr("x", -150)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#696969")
        .attr("font-size", "14px")
        .text("Number of Delayed Flights");

      var color = d3.scaleOrdinal(d3.schemeCategory10);

      /*
      const transitionPath = d3
        .transition()
        .ease(d3.easeSin)
        .duration(1000);*/
      //console.log(transitionPath)

      svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", lineStroke)
        .attr("opacity", lineOpacity)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(+d.delay); })(d.values)
        })
        .on("mouseover", function(d,i) {
          //console.log(i)
            svg.append("text")
              .transition()
              .ease(d3.easeSin)
              .attr("class", "title-text")
              .style("fill", color(i.key))  
              .style("font-size", "22px")      
              .text("Carrier: "+i.key)
              .attr("text-anchor", "middle")
              .attr("x", 100)
              .attr("y", 20);
            d3.selectAll('.line')
            .style('opacity', otherLinesOpacityHover);
            d3.select(this)
              .style('opacity', lineOpacityHover)
              .style("stroke-width", lineStrokeHover)
              .style("cursor", "pointer");
          })
        .on("mouseout", function() {
            svg.select(".title-text").remove();
            d3.selectAll(".line")
                .style('opacity', lineOpacity);
            d3.select(this)
              .style('opacity', lineOpacity)
              .style("stroke-width", lineStroke)
              .style("cursor", "none");
          })
          ;

        
      
        var curtain = svg.append('rect')
          .attr('x', -1 * width)
          .attr('y', -1 * height)
          .attr('height', height)
          .attr('width', width)
          .attr('class', 'curtain')
          .attr('transform', 'rotate(180)')
          .style('fill', '#ffffff');
          
        /* Optionally add a guideline */
        var guideline = svg.append('line')
          .attr('stroke', '#333')
          .attr('stroke-width', 0)
          .attr('class', 'guide')
          .attr('x1', 1)
          .attr('y1', 1)
          .attr('x2', 1)
          .attr('y2', height)
          
        /* Create a shared transition for anything we're animating */
        var t = svg.transition()
          .delay(750)
          .duration(6000)
          .ease(d3.easeLinear)
          .on('end', function() {
            d3.select('line.guide')
              .transition()
              .style('opacity', 0)
              .remove()
          });
        
        t.select('rect.curtain')
          .attr('width', 0);
        t.select('line.guide')
          .attr('transform', 'translate(' + width + ', 0)')

        d3.select("#show_guideline").on("change", function() {
          guideline.attr('stroke-width', this.checked ? 1 : 0);
          curtain.attr("opacity", this.checked ? 0.75 : 1);
        })                              
    },
    buildTreemap() {
      var width = 960;
      var height = 960;
      var margin = {top: 10, right: 10, bottom: 10, left: 10}

      const keys = d3.range(1, 32);
      console.log(keys)
      console.log(this.treemapData)

      var data = this.treemapData;

      data.forEach(function(d) { 
        d.name = d.ORIGIN_STATE_NM
        d.Sat =  +d["1"]
        d.Sun = +d["2"]
        d.Mon = +d["3"]
        d.Tue = +d["4"]
        d.Wed = +d["5"]
        d.Thu = +d["6"]
        d.Fri = +d["7"]

      });
      console.log(data)
      
      const regionByState = new Map(this.region.map(d => [d.State, d.Region]));
      console.log(regionByState)
      const divisionByState = new Map(this.region.map(d => [d.State, d.Division]));
      console.log(divisionByState)

      const group = d3.group(data, d => regionByState.get(d.ORIGIN_STATE_NM), d => divisionByState.get(d.ORIGIN_STATE_NM)) //
      console.log(group)

      var color = d3.scaleOrdinal(group.keys(), d3.schemeCategory10.map(d => d3.interpolateRgb(d, "white")(0.5)))
      console.log(color)
    

    var svg = d3.select("#treemap")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


      console.log(svg)

    var format = d3.format(",d");

    var treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width, height])
        .round(true)
        .paddingInner(1);

  var root = d3.hierarchy(group)
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum(sumBySat)
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
    console.log(root)
  treemap(root);

  var cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cell.append("rect")
      .attr("id", function(d) {  return d.data.id; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) {return color(d.parent.data[0]); });

  cell.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.data.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.data.id; });

  cell.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .selectAll("tspan")
      .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g)})
    .enter().append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; });

  cell.append("title")
      .text(function(d) { return "Geographical Division: " + d.parent.data[0] + "\n" + "State Name: " + d.data.name + "\n" + "Delayed Flight Count: " +format(d.value); });

  
  var f_selected = d3.selectAll('input[type="radio"]').node().value;
  console.log(f_selected)
  
  d3.selectAll('input[type="radio"]')
    .on("change", changed)

  
  /*
function change_f(){
    var t = (this.value == "sumBySat") ? sumBySat :sumByWed
    console.log(t);
    return t
  }
  d3.selectAll('input[type="radio"]')
      .data([sumBySat, sumByWed], function(d) { 
                        return d ? d.name : this.value; })
      .on("change", changed);*/

  var timeout = d3.timeout(function() {
    d3.select('input[value="sumByWed"]')
        .property("checked", true)
        .dispatch("change");
  }, 2000);

  
  function changed() {
    timeout.stop();

    var t = (this.value == "sumBySat") ? sumBySat :sumByWed
    console.log(t)
    treemap(root.sum(t));

    cell.transition()
        .duration(750)
        .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
      .select("rect")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; });
  }
  

function sumByWed(d) {
  return d.Wed;
}

function sumBySat(d) {
  return d.Sat;
}


    },
    buildPieChart(){

        var width = 600;
        var height = 600;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 120;
        var legendRectSize = 15;
        var legendSpacing = 5;

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var dataset = this.pieData;
        
        dataset.forEach(function(d) {
            d.count = +d.count;
          });

        console.log(dataset);

        var svg = d3.select('#pie_chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) + 
            ',' + (height / 2) + ')');

        var arc = d3.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) { return d.count; })
          .sort(null);
                                 

          var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d) { 
              return color(d.data.label);
            })
            .on('mouseover', function(d,i) {                            
            var total = d3.sum(dataset.map(function(d) {  
              return d.count;                                           
            }));                                                          
            var percent = Math.round(1000 * i.data.count / total) / 10; 

            d3.select(this)
            .attr("stroke", "#000")

            svg.append("text")
            .attr("y", 100)
            .style("text-anchor", "middle")
            .style("font-size", 24)
            .attr("class","label")
            .style("fill", color(i.data.label))
            .text("Percentage:" + percent + "%");

            svg.append("text")
            .attr("y", -90)
            .style("text-anchor", "middle")
            .style("font-size", 24)
            .attr("class","label2")
            .style("fill", color(i.data.label))
            .text(i.data.label);

          });               
          
          path.on('mouseout', function() {                                
            d3.select(this).attr("stroke", null);  
            svg.select(".label").remove();
            svg.select(".label2").remove();                         
          });                                                             

        /*
          path.on('mousemove', function(d) {  
            tooltip.style('top', (d.pageY + 10) + 'px')          
              .style('left', (d3.pageX + 10) + 'px');             
          });      */                                                     
            
          var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var height = legendRectSize + legendSpacing;
              var offset =  height * color.domain().length / 2;
              var horz = -6 * legendRectSize;
              var vert = i * height - offset;
              return 'translate(' + horz + ',' + vert + ')';
            });

          legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)                                   
            .style('fill', color)
            .style('stroke', color);
            
          legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });
    }

  },
  mounted: function () {

    if (!this.$store.state.htmlMapData) {
      var promises = []
      promises.push(d3.csv('Data_for_line_chart.csv'))
      promises.push(d3.csv('us_region.csv'))
      promises.push(d3.csv('Data_for_treemap.csv'))
      //promises.push(d3.csv('test_data.json'))
      promises.push(d3.csv('delay.csv'))
      Promise.all(promises).then(values => {
        this.rawData = values
        this.lineData = values[0]
        this.region = values[1]
        this.treemapData = values[2]
        this.pieData = values[3]
        this.$store.commit('htmlMapData', this.rawData);
        this.buildLineChart();
        this.buildTreemap();
        this.buildPieChart();
      })
    } else {
      this.rawData = this.$store.state.htmlMapData;
      this.lineData = this.rawData[0]
      this.region = this.rawData[1]
      this.treemapData = this.rawData[2]
      this.buildLineChart();
      this.buildTreemap();
      this.buildPieChart();
    }

    }
  }

</script>

<style>
.title{
  font-size: 24px;

}

</style>

/*reference:
Overall:
https://observablehq.com/@hydrosquall/d3-tutorial-interactivity-animated-transitions

Line Plot:
https://www.d3-graph-gallery.com/graph/line_several_group.html

MouseOver:
http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774
https://codepen.io/zakariachowdhury/pen/JEmjwq

Animation:
https://bl.ocks.org/phvaillant/53b90038b9c5ac5f6b817a4f63fbc2af
http://bl.ocks.org/atmccann/8966400

*/