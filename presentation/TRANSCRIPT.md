# Final presentation transcript

Topic: Visualizing Air Travel Delays 

Team name: Elements

Team members:

- Aishwarya Krishnakumar <kris184@usc.edu>
- Weidi Lou <wlou@usc.edu>
- Zixin Zhang <zzhang09@usc.edu>

---

## Slide 0

Hi, I'm Aishwarya, I'm Weidi, and I'm Zixin and our team name is the Elements. We chose to do our project on air travel delays.

## Slide 1
We chose to do our final project on air travel since it’s widely used by people around the country, especially us college students. Our goal was to create a visualization  to  present  data  about  flight  delays,  primarily  domestic.  By  creating  a dashboard, the users will be able to understand the reasons why flights are delayed, which airports around the country deal with the most delays, which travel dates see the most delays, and which airlines experience the most departure delays.

The  end  user  for  our  project  includes  current  and  future  passengers,  airport and airline employees  who  are  interested  in  learning  about  flight delays. Our project was inspired by many of our own travel journeys and our own experiences with delayed flights

## Slide 2

We decided to split the work by section while also allowing each other to put a little time in each other's tasks. Aishwarya focused on creating the powerpoints and writing the paper. She also created an interactive donut/pie chart. Zixin focused her efforts on the line chart and the tree map. She also gave input for the powerpoints. Weidi created the d3 map and the mapbox map. The video was a group effort.

## Slide 3

Our project’s dataset is from the United States Bureau of Transportation.The data on this website allowed us to filter based on carrier, airport, and date.

We ended up choosing all carriers, all major airports, and the dates of August 2021. We then downloaded the data as a csv file. 

In total, we had 81,779 rows of data. This dataset includes flight date, airline identification codes, individual flight numbers, origin airport, destination airport, departure time, arrival time, and delay times. The dataset categorizes the causes of delays in five expansive categories: Air Carrier, Weather, National Aviation System (NAS), Security, andLate-Arriving  Aircraft.  These  categories  encompass  all  possible  reasons  for  aflight to be delayed. Another dataset we used was from the Humanitarian Data Exchange. This data had the local code, longitude, and latitude of the airports. This dataset had 27,917 rows of data. This dataset was necessary since our initial dataset did not have the physical locations of the airports.

## Slide 4

Similar works of the same topic have been done by the Federal Aviation Administration and by the flight tracking application, FlightAware. The Federal Aviation Administration has a website which contains some visualization about general airport conditions. For those specific flight requests, it provides the link to airline.FlightAware has a real-time worldwide flight traffic visualization on the map.It  also  includes  some  other  visualizations  about  data  trend  such  as  airplane velocity  and  elapsed  flight  time.  FlightAware’s  map,  however,  only  shows  the flight route and does not provide any information about delayed flight routes.

Similar works have been done in other areas by the Metropolitan Transportation Authority and the California Highway Patrol. The Metropolitan Trans-portation Authority has an online dashboard that tracks subway performance in the state of New York. This is similar to our project because it provides a barchart of performance over time.The California Highway Patrol maintains a dashboard to track where theyhave conducted stops throughout the state of California. This work is similar toour project in the sense that both include interactive maps with tooltips.

## Slide 5

Similar works have been done by the Federal Aviation Administration and by theflight tracking application, FlightAware. We decided to model our map based onthe visualizations in FlightAware. However, the map in FlightAware only shows
Visualizing Air Travel Delays the flight route. It does not provide any information about delayed flight routes. Therefore, in our project, we decided to create a map that shows delayed flightroutes. The  Federal  Aviation  Administration  has  a  website  which  contains  some visualization about general airport conditions. For those specific flight requests,it provides the link to airline. In our project, we provide additional information about  a  certain  delayed  flight  when  the  route  is  hovered  over.  Although  our contributions to this project are inspired by existing work such as FlightAware,we have made it unique as we focus our information on delayed flights

## Slide 6

We wanted to create something that told a story about air travel delays. Our design process was first sketching out a rough layout. We wanted to show the dates of most delays, states with most delays, air carriers with most delays, and finally reasons why flights are delayed. Then, we selected the types of graphs that would best fit what we wanted to show. We chose to represent the air carriers with a line graph. The states would be best with a tree map since it would be clearer than a line graph with 50 lines. Then, we chose to do a donut chart to show the reasons why flights are delayed.

## Slide 7

We optimized user interaction mostly on the maps. The user can click on a state to see the destinations that have had delayed flights on a certain date. Then, the user can hover over a path to see.... 

## Slide 8

(Explain what you have built with d3 and other tools including framework, and node, pythons tools, etc. you used.)

## Slide 9

To expand on this project, we would add more dates instead of just one month. In addition, we would expand to international flights as well. This would mean our dataset would expand tremendously.

## Slide 10
Thank you for listening.