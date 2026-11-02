# How to run the app ?

Installation:
git clone -> gh repo clone bhaviljain/ByteBeam

Navigate to cd TruckData

RUN THE APPLICATION
npm install

RUN UNIT TEST
npm test

Unit tests are written using Vitest.
The current tests cover:
1: duplicate packet removal
2: grouping trucks according to truckId
3: getting latest SOC using event_time
4: getting latest speed using event_time
5: Handling missing SOC


How you derive latest values, freshness, and status ?

1: duplicate removal : TruckData()
-> Using set to know that the truck is already there and to remove the duplicates

2:Grouping Trucks according to truckid : groupTruckData()
-> Grouping the truck with the help of vehicle_id / truckId , t01:[truckpacket1,truckpacket2,....]

3: latestValues : latestData()
-> ussing reduce method and compare the event_time of all the 50 trucks.
   the truck who's data is last updated is stored here

4: Freshness : staleData()
-> here we check each signals , soc, speed and battery, with the help of event_time. here
   we compare event_time of each truck each signals latest packet arrival with the latestData output.
   and if the difference is more than 10 minutes its a stale data

5:  status :
-> since we get individual freshness data from staleData function, here we can calculate the 
   status of latest event_time truck. 


Product and UI decisions you made

I have build few dashboards previously, so I thouugh to use that UI and
display the trucks and Critical trucks in the UI and then listing 
all the 50 trucks in the.Also added icons for UX perspective, for icons 
i have used Lucide react library.
For the individual truck details page, my main focus was readability. 
I wanted every trucks information to be clearly organized and presented,
including SOC, speed, battery temperature, last updated time, and individual signal freshness.





Known limitations and what you would improve with more time

Pagination: Right now all the data are been rendered togethere
we can think to implement Pagination and show the first 10 data

Backend duplicate: I think duplicate removal of the packets 
should be done on backend

Real API : right now the data is coming from a static json file,
but if it was coming from the api then we can handle error handling,
loading state in more better way

Search and Filter: Right now Search and filter also been handler with frontend, 
we can do this as well at the backend, by pass ing the user selected Search or filter
results in the payload


#AI Tools Used
I used ChatGPT as an AI assistant throughout the development of this assignment.
Where it helped: In understanding the assignment, discussing JS approach of writing
fucntions.
Since I never used Testing framework, with the help of ChatGPT I got to know
about Vitest testing framework as well and how to implement and use it

#where you changed or rejected their suggestions
In staleData fucntion mainly and if somewhere else also if it was giving a certian logic which i wasnot able 
undertsand, so i tried to make it in simpler way and only if i get to undertsand
the logic and tell AI to dry run for me, and then only i implement it







ChatGPT links
https://chatgpt.com/share/6ae84a8a-c538-83ee-af95-bcb47184e4a5
https://chatgpt.com/share/6ae84acd-c310-83ee-abd3-5393f555d3d8