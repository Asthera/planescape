# Project Smart-Fly

first Functional: Find good trip with controlled dates:

## TODO:

1. Make class for RyanAir:
  that take: (start date, end date, trip duration min, trip duration max, isSameReturnAirport: by default True, departure airports: list or String (if it all country), arrive airports: list or String (if it all country), countOfPerson, price min, price max )
  and return list of classes ClearFlight

  ClearFlight: departureAirport: str, arriveAirport: str, departureAirportFinale: None or str (if isSameReturnAirport is True then it is None, otherwise str), price: float,  
  

errors solved:

1. SSl certificate not founded:
   just gived certificate to python which used here
2. Big trouble with undetected_chromedriver, 
  played few hours with versions of chrome and chrome driver and one moment started working, (MacOS :) )
3. changed some classes names in html for which founding date departure/arrival
    from "title-l-lg title-l-sm time__hour" to "flight-info__hour title-l-lg title-l-sm"
4. function one_way_flight was returning only one flight but more was avalable
5. Here is error when very slow internet
   - not solved

## 23.07.2024

[] - TODO

1. Make that data from frontend are good getted (as SearchParams) on backend - [V]

## 24.07.2024

for frontend send also array of cheapest flights per day (f and b) 