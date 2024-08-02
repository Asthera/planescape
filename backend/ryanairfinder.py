import requests
from typing import List, Union
from dataclasses import dataclass
from datetime import datetime


# Define SearchParams and FlightProposition using dataclasses
@dataclass
class SearchParams:
    searchStartDate: datetime
    searchEndDate: datetime
    tripDurationMin: int
    tripDurationMax: int
    isSameReturnAirport: bool = True
    departureAirports: Union[List[str], str] = "all"
    arriveAirports: Union[List[str], str] = "all"
    countOfPerson: int = 1
    priceMin: float = 0.0
    priceMax: float = 0.0


@dataclass
class FlightProposition:
    departureDate: datetime
    arriveDate: datetime
    backwardDepartureDate: datetime
    backwardArriveDate: datetime
    departureAirport: str
    arriveAirport: str
    departureAirportFinal: Union[str, None]
    price: float
    linkForwardTrip: str
    linkBackwardTrip: str

@dataclass
class OneWayFlight:
    departureDate: datetime
    arriveDate: datetime
    departureAirport: str
    arriveAirport: str
    price: float
    linkTrip: str
    checkedAt: datetime





# Function to find flights using the Ryanair API
def findFlights(params: SearchParams) -> List[FlightProposition]:
    base_url = "https://services-api.ryanair.com/farfnd/3/roundTripFares"

    # Convert departure and arrival airports to comma-separated strings if they are lists
    departure_airports = ",".join(params.departureAirports) if isinstance(params.departureAirports,
                                                                          list) else params.departureAirports
    arrive_airports = ",".join(params.arriveAirports) if isinstance(params.arriveAirports,
                                                                     list) else params.arriveAirports

    print(departure_airports, arrive_airports)

    flight_propositions = []

    for departure_airport in departure_airports.split(','):
        for arrive_airport in arrive_airports.split(','):
            url = (f"{base_url}?departureAirportIataCode={departure_airport}"
                   f"&arrivalAirportIataCode={arrive_airport}"
                   f"&outboundDepartureDateFrom={params.searchStartDate.strftime('%Y-%m-%d')}"
                   f"&outboundDepartureDateTo={params.searchEndDate.strftime('%Y-%m-%d')}"
                   f"&inboundDepartureDateFrom={params.searchStartDate.strftime('%Y-%m-%d')}"
                   f"&inboundDepartureDateTo={params.searchEndDate.strftime('%Y-%m-%d')}"
                   f"&priceValueFrom={params.priceMin}"
                   f"&priceValueTo={params.priceMax}"
                   f"&limit=16"
                   f"&market=en-en"
                   f"&offset=0")

            response = requests.get(url)
            print(response.json())
            if response.status_code == 200:
                data = response.json()
                for fare in data.get('fares', []):
                    outbound = fare.get('outbound')
                    inbound = fare.get('inbound')
                    if outbound and inbound:
                        departure_date = datetime.fromisoformat(outbound['departureDate'])
                        arrive_date = datetime.fromisoformat(outbound['arrivalDate'])
                        backward_departure_date = datetime.fromisoformat(inbound['departureDate'])
                        backward_arrive_date = datetime.fromisoformat(inbound['arrivalDate'])

                        flight_proposition = FlightProposition(
                            departureDate=departure_date,
                            arriveDate=arrive_date,
                            backwardDepartureDate=backward_departure_date,
                            backwardArriveDate=backward_arrive_date,
                            departureAirport=outbound['departureAirport']['iataCode'],
                            arriveAirport=outbound['arrivalAirport']['iataCode'],
                            departureAirportFinal=outbound['departureAirport'][
                                'iataCode'] if params.isSameReturnAirport else inbound['departureAirport']['iataCode'],
                            price=fare['price']['value'],
                            linkForwardTrip=fare['links']['outbound']['flight']['href'],
                            linkBackwardTrip=fare['links']['inbound']['flight']['href']
                        )

                        flight_propositions.append(flight_proposition)
            else:
                print(f"Failed to retrieve data for {departure_airport} to {arrive_airport}")

    return flight_propositions


# Example usage
departure_airports = ["BER", "DRS", "NUE"]
arrive_airports = ["BUD"]
start_date_search = datetime(2024, 8, 18)
end_date_search = datetime(2024, 9, 22)
trip_duration_min = 3
trip_duration_max = 7
is_same_return_airport = False
count_person = 1
price_min = 30
price_max = 300

example_search_params = SearchParams(
    searchStartDate=start_date_search,
    searchEndDate=end_date_search,
    tripDurationMin=trip_duration_min,
    tripDurationMax=trip_duration_max,
    isSameReturnAirport=is_same_return_airport,
    departureAirports=departure_airports,
    arriveAirports=arrive_airports,
    countOfPerson=count_person,
    priceMin=price_min,
    priceMax=price_max
)
print(example_search_params)

flights = findFlights(example_search_params)
for flight in flights:
    print(flight)
