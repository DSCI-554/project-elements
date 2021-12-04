# Project video transcript

Topic: Visualizing air travel delays

Team name: Elements

Team members:

- Aishwarya Krishnakumar kris184@usc.edu

- Weidi Lou wlou@usc.edu

- Zixin Zhang zzhang09@usc.edu

## Introduction (0-30s)

Hello everyone, we are team Elements and our project topic is visualizing air travel delays. Our goal is to create a dashboard and maps that helps the users to better understand the reasons of flight delays, whether carriers, time, and locations of airport have different delay count and causes. 

## Dashboard Page (2 mins)
To gain a statistical understanding of the data, we created a dashboard page and split tabs for the 3 major directions that we are most interested in. They are carriers, states, delayed reasons. 

In order to answer the question of Which carriers have more delays, we used an animated and interactive line chart to display the number of delayed flights on each day throughout time. Each line represents a carrier, it shows the carrier's when we put the mouse on lines. From the chart, we notice that there is a gap, which indicates the major carriers have more flights on each day to begin with. This also increases their delayed flight count. The information I just explained can also be found when you click the Explanation button, which is available on all pages. And the instruction illustrates all available functions.

Next, we used an animated treemap to show the proportion of the delayed flight count for each state. The states are sorted and colored by their geographical division.
The detailed information of each state can be found when you put the mouse on each state, including their geographical division, state name, and the exact count of delayed flights. And we can also learn the difference in delay count between weekend and weekday by simply clicking the radio buttons. 

We then used a donut chart to analyze the reasons for flight delays. All 5 reasons are colored differently and we can see the details when hovered over. We can see that the delay due to weather issues is only 5% of the time, which is interesting.


## Maps Page (2 mins)
There are two maps in our web application. The first one is using d3.map. The instruction is default as visible that users can learn how to use the page. The explanation is only shown when clicking on the explanation button. The default date is August 1, 2021. Users can change it at any time they want. The legend indicates the causes of delay in different colors. By clicking on a state, paths of all delayed flights in colors would be shown. The detailed delay information will pop up once the mouse moves over the path. For keeping the map clear, users must click the shown state again to close it before checking another state.
The second map is Mapbox. This page has similar instruction and explanation buttons as the previous one. This map asks for airport code as the other input. Once both inputs are selected, the flight paths will be shown. Then clicking on one path, the detailed information will be shown in infobox.
