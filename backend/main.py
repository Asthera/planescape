from datetime import datetime
from typing import Dict, List

from fastapi import FastAPI

from my_types import SearchParams, FlightProposition
from scraper import RyanAir

from fastapi.middleware.cors import CORSMiddleware
from time import sleep

app = FastAPI()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # The origin(s) that may access the backend
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Example 1
example_1: Dict[int, List[FlightProposition]] = {
    1: [
        FlightProposition(
            departureDate=datetime(2024, 7, 21, 10, 0),
            arriveDate=datetime(2024, 7, 21, 14, 0),
            backwardDepartureDate=datetime(2024, 7, 22, 16, 0),
            backwardArriveDate=datetime(2024, 7, 22, 20, 0),
            departureAirport="JUMBO",
            arriveAirport="LAX",
            departureAirportFinal=None,
            priceForward=300.0,
            priceBackward=320.0,
            forwardCurrency="USD",
            backwardCurrency="USD"
        ),
        FlightProposition(
            departureDate=datetime(2024, 7, 21, 12, 0),
            arriveDate=datetime(2024, 7, 21, 16, 0),
            backwardDepartureDate=datetime(2024, 7, 22, 18, 0),
            backwardArriveDate=datetime(2024, 7, 22, 22, 0),
            departureAirport="JFK",
            arriveAirport="SFO",
            departureAirportFinal="ORD",
            priceForward=350.0,
            priceBackward=370.0,
            forwardCurrency="USD",
            backwardCurrency="USD"
        )
    ],
    2: [
        FlightProposition(
            departureDate=datetime(2024, 8, 5, 9, 0),
            arriveDate=datetime(2024, 8, 5, 13, 0),
            backwardDepartureDate=datetime(2024, 8, 7, 15, 0),
            backwardArriveDate=datetime(2024, 8, 7, 19, 0),
            departureAirport="LHR",
            arriveAirport="JFK",
            departureAirportFinal=None,
            priceForward=500.0,
            priceBackward=520.0,
            forwardCurrency="GBP",
            backwardCurrency="GBP"
        )
    ]
}

example_of_cheapest = [(300.0, 320.0) , (500.0, 520.0)]

@app.post("/flights")
async def receive_flights(params: dict):

    print("Recieved request")
    # rewrite to it
    # def get_flights(params: SearchParams) -> Dict[int, List[FlightProposition]]:

    searchStartDate = params['departureDate']
    searchEndDate = params['returnDate']

    transformed = SearchParams(
        searchStartDate=searchStartDate,
        searchEndDate=searchEndDate,
        tripDurationMin=params['tripDurationMin'],
        tripDurationMax=params['tripDurationMax'],
        isSameReturnAirports=params['departureAirport'] == params['arrivalAirport'],
        departureAirports=[params['departureAirport']],
        arriveAirports=[params['arrivalAirport']],
        countOfPerson=params['countOfPersons'],
        priceMin=0.0,
        priceMax=params["priceMax"]

    )

    print(params)

    print()
    print(transformed)

    ryanair = RyanAir(headless=True)


    # get the data
    f_flights, b_flights, prices = ryanair.find_two_way_flights(transformed)
    print(f_flights)
    print(b_flights)

    data = ryanair.find_flight_propositions(f_flights, b_flights , transformed.tripDurationMin, transformed.tripDurationMax)
    print(data)
    sleep(5)

    return {"received_data": [data, prices]}
