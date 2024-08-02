from dataclasses import dataclass
from datetime import datetime
from typing import Union, List

@dataclass
class OneWayFlight:
    departureDate: datetime
    arriveDate: datetime
    departureAirport: str
    arriveAirport: str
    price: float
    linkTrip: str
    checkedAt: datetime
    currency: str


@dataclass
class FlightProposition:
    departureDate: datetime
    arriveDate: datetime
    backwardDepartureDate: datetime
    backwardArriveDate: datetime
    departureAirport: str
    arriveAirport: str
    departureAirportFinal: Union[str, None]
    priceForward: float  # Renamed from 'price' to 'priceForward'
    priceBackward: float  # New field for backward flight price
    forwardCurrency: str
    backwardCurrency: str



@dataclass
class SearchParams:
    searchStartDate: datetime
    searchEndDate: datetime
    tripDurationMin: int
    tripDurationMax: int
    isSameReturnAirports: bool = True
    departureAirports: Union[List[str], str] = "all"
    arriveAirports: Union[List[str], str] = "all"
    countOfPerson: int = 1
    priceMin: float = 0.0
    priceMax: float = 0.0
    def __str__(self):
        return (
            f"SearchParams(\n"
            f"  searchStartDate: {self.searchStartDate},\n"
            f"  searchEndDate: {self.searchEndDate},\n"
            f"  tripDurationMin: {self.tripDurationMin},\n"
            f"  tripDurationMax: {self.tripDurationMax},\n"
            f"  isSameReturnAirport: {self.isSameReturnAirports},\n"
            f"  departureAirports: {self.departureAirports},\n"
            f"  arriveAirports: {self.arriveAirports},\n"
            f"  countOfPerson: {self.countOfPerson},\n"
            f"  priceMin: {self.priceMin},\n"
            f"  priceMax: {self.priceMax}\n"
            f")"
        )
