# Final presentation transcript

Topic: Visualizing Air Travel Delays 

Team name: Elements

Team members:

- Aishwarya Krishnakumar <kris184@usc.edu>
- Weidi Lou <wlou@usc.edu>
- Zixin Zhang <zzhang09@usc.edu>

---

## Slide 0

Hi, I'm Aishwarya, my team members are Weidi and Zixin and our team name is the Elements. We chose to do our project on air travel delays.

## Slide 1
We chose to do our final project on air travel since it’s widely used by people around the country, especially us college students. Our goal was to create a dashboard that allows the users will be able to understand the reasons why flights are delayed, which airports around the country deal with the most delays, which travel dates see the most delays, and which airlines experience the most departure delays.

The  end  user  for  our  project  includes  passengers and aviation employees  who  are  interested  in  learning  about  flight delays.

## Slide 2

We decided to split the work by section while also allowing each other to put a little time in each other's tasks. Aishwarya focused on creating the powerpoints and writing the paper. She also created an interactive donut/pie chart. Zixin focused her efforts on the line chart and the tree map. She also gave input for the powerpoints. Weidi created the d3 map and the mapbox map and contributed in writing about the maps. The video was a group effort.

## Slide 3

Our project’s dataset is from the US Bureau of Transportation.The data on this website allowed us to filter based on carrier, airport, and date.

Another dataset we used was from the Humanitarian Data Exchange. This data had the local code, longitude, and latitude of the airports. This dataset was necessary since our initial dataset did not have the physical locations of the airports.

## Slide 4

Similar works have been done by the flight tracking application, FlightAware. FlightAware has a real-time worldwide flight traffic visualization on the map. It  also  includes  some  other  visualizations  about  data  trend  such  as  airplane velocity  and  elapsed  flight  time.  FlightAware’s  map,  however,  only  shows  the flight route and does not provide any information about delayed flight routes.

## Slide 5

The most unqiue point about our project is that we focus on analyzing information about delayed flights using various charts. We extended based on the website是mentioned earlier with visualizations on general airport conditions, and added delayed flight routes that shows detailed information when hovered over on maps. 

## Slide 6

To tell a story about air travel delays, we first sketched out a rough layout to decide the topics. Including reasons of flight delays, dates, locations and carriers with most delays. To best represent the information, we use an interative line graph to show carrier delays, a treemap to show location, a donut chart to show the delayed reasons and maps to show the flight routes. 

## Slide 7

We optimized user interaction mostly on the maps. The first one is a D3 map. The delayed flights would be shown in colors. Different colors represent causes of delay. The other map is Mapbox. The paths of delayed flights would be shown in a beatiful curve. Users can see detailed information of each flight by clicking on the path.

## Slide 8

We are using vue.js as the framework of the web application. BootstrapVue is also used for making the application responsive, mobile friendly. For plotting the beautiful curve of the flight path, we applied turf.js.

## Slide 9

To expand on this project, we would add more dates instead of just one month. In addition, we would expand to international flights as well. About the functionality, we want to save the infomation when user select one path, then make comparison between the saved flight information

## Slide 10
Thank you for listening.
