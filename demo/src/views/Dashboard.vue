<template>
    <div class="about">
    <b-tabs content-class="mt-3">
        <b-tab title="Carrier Analysis" active>
            <h1>Interactive & Animated Line Chart</h1>
            <div class="title"> Number Of Delayed Flight Count For Carriers Through Time</div>
            <br />
            <label class="guideline">
              Show Guideline & Curtain
              <input type="checkbox" id="show_guideline" />
            </label>
            <br />
            <svg width="1200" height="600" id="line_chart"></svg>
        </b-tab>

        <b-tab title="States Analysis">
            <h1>D3 Animated Treemap</h1>
            <div class="title"> Number Of Delayed Flight Count For Carriers Through Time</div>
            <svg width="954" height="954" id="treemap"></svg>
        </b-tab>

        <b-tab title="Reasons Analysis">
            <h1>What are the reasons a flight gets delayed?</h1>
            <div class="title"> Percentage of Each Delayed Reasons Shown in Donut Chart</div>
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
    chart(){

      var width = 800;
      var height = 600;
      var margin = 50;
      var xScale = d3.scaleLinear()
                .domain([0,2021])
                .range([0, width]);

      var yScale = d3.scaleLinear()
                .domain([0, 1000])
                .range([height, 0]);

      var svg = d3.select("#line_chart")
              .append("svg")
              .attr("width", width+margin)
              .attr("height", height+margin)
              .append('g')
              .attr("transform", `translate(${margin}, ${margin})`);
              
      var xAxis = d3.axisBottom(xScale).ticks(5);
      var yAxis = d3.axisLeft(yScale).ticks(5);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height-margin})`)
        .call(xAxis)
        .text("Year");
        
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append('text')
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("fill", "#000")
        .text("Number of Delayed Flights");
    },
    buildLineChart() {
      /*var width = 800;
      var height = 800;
      var margin = 50;
      var duration = 250;
      */
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
      var width = 954;
      var height = 954;

      const keys = d3.range(1, 32);
      //console.log(keys)
      //console.log(this.treemapData)

      var data = this.treemapData;

      data.forEach(function(d) { 
        d.name = d.ORIGIN_STATE_NM
        d.values =  keys.map(key => +d[key].replace(/,/g, ""))
      });
      //console.log(data)
      
      const regionByState = new Map(this.region.map(d => [d.State, d.Region]));
      //console.log(regionByState)
      const divisionByState = new Map(this.region.map(d => [d.State, d.Division]));
      //console.log(divisionByState)

      const group = d3.group(data, d => regionByState.get(d.ORIGIN_STATE_NM), d => divisionByState.get(d.ORIGIN_STATE_NM))
      //console.log(group)

      var color = d3.scaleOrdinal(group.keys(), d3.schemeCategory10.map(d => d3.interpolateRgb(d, "white")(0.5)))
      //console.log(color)

      var sums = keys.map((d, i) => d3.hierarchy(group).sum(d => d.values[i]).value);
      //console.log(sums)

      var max = d3.max(sums);
      //console.log(max)

      const treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([width, height])
      .padding(d => d.height === 1 ? 1 : 0)
      .round(true);

      //console.log(treemap)

      const root = treemap(d3.hierarchy(group)
        .sum(d => Array.isArray(d.values) ? d3.sum(d.values) : 0)
        .sort((a, b) => b.value - a.value));
      //console.log(root)
    

    var svg = d3.select("#treemap")
        .append("svg")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .style("overflow", "visible");

    var formatNumber = d3.format(",d");
    var duration = 2500;
    var parseNumber = string => +string.replace(/,/g, "");

    var box = svg.append("g")
    .selectAll("g")
    .data(keys.map((key, i) => {
      const value = root.sum(d => d.values[i]).value;
      return {key, value, i, k: Math.sqrt(value / max)};
    }).reverse())
    .join("g")
      .attr("transform", ({k}) => `translate(${(1 - k) / 2 * width},${(1 - k) / 2 * height})`)
      .call(g => g.append("text")
          .attr("y", -6)
          .attr("fill", "#777")
        .selectAll("tspan")
        .data(({key, value}) => [key, ` ${formatNumber(value)}`])
        .join("tspan")
          .attr("font-weight", (d, i) => i === 0 ? "bold" : null)
          .text(d => d))
      .call(g => g.append("rect")
          .attr("fill", "none")
          .attr("stroke", "#ccc")
          .attr("width", ({k}) => k * width )
          .attr("height", ({k}) => k * height));
      
      //console.log(box)

       const leaf = svg.append("g")
          .selectAll("g")
          .data(layout(keys))
          .join("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);
        //console.log(leaf)
        
        leaf.append("rect")
            //.attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(keys); })
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);
        /*
        leaf.append("clipPath")
            .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
          .append("use")
            .attr("xlink:href", d => d.leafUid.href);
        */
        leaf.append("text")
            .attr("clip-path", d => d.clipUid)
          .selectAll("tspan")
          .data([group.name, formatNumber(group.value)])
          .join("tspan")
            .attr("x", 3)
            .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
            .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
            .text(d => d);

        leaf.append("title")
            .text(group.name);

        function layout(index) {
          const k = Math.sqrt(root.sum(d => d.values[index]).value / max);
          const x = (1 - k) / 2 * width;
          const y = (1 - k) / 2 * height;
          return treemap.size([width * k, height * k])(root)
            .each(d => (d.x0 += x, d.x1 += x, d.y0 += y, d.y1 += y))
            .leaves();
        }

  return Object.assign(svg.node(), {
    update(index) {
      box.transition()
          .duration(duration)
          .attr("opacity", ({i}) => i >= index ? 1 : 0);

      leaf.data(layout(index)).transition()
          .duration(duration)
          .ease(d3.easeLinear)
          .attr("transform", d => `translate(${d.x0},${d.y0})`)
          .call(leaf => leaf.select("rect")
              .attr("width", d => d.x1 - d.x0)
              .attr("height", d => d.y1 - d.y0))
          .call(leaf => leaf.select("text tspan:last-child")
              .tween("text", function(d) {
                const i = d3.interpolate(parseNumber(this.textContent), d.value);
                return function(t) { this.textContent = formatNumber(i(t)); };
              }));
    }
  });

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
      promises.push(d3.csv('us-region.csv'))
      promises.push(d3.csv('Data_for_treemap.csv'))
      promises.push(d3.csv('delay.csv'))
      Promise.all(promises).then(values => {
        this.rawData = values
        this.lineData = values[0]
        this.region = values[1]
        this.treemapData = values[2]
        this.pieData = values[3]
        this.$store.commit('htmlMapData', this.rawData);
        //this.chart();
        this.buildLineChart();
        //this.buildTreemap();
        this.buildPieChart();
      })
    } else {
      this.rawData = this.$store.state.htmlMapData;
      this.lineData = this.rawData[0]
      this.region = this.rawData[1]
      this.treemapData = this.rawData[2]
      this.chart();
      this.buildLineChart();
      //this.buildTreemap();
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