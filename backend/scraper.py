# import libraries
import time
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timedelta, date
from typing import List, Dict
from my_types import SearchParams, FlightProposition, OneWayFlight
from selenium.webdriver.common.by import By
import undetected_chromedriver as uc
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import re
from currency_converter import CurrencyConverter


class RyanAir:

    def __init__(self, headless=True):
        if headless:
            # config headless undetected chromedriver
            options = uc.ChromeOptions()
            options.add_argument('--headless')
            self.driver = uc.Chrome(options=options)
        else:
            self.driver = uc.Chrome()

    def one_way_flight(self, flyout, flyin, orig, dest, adults='1', teens='0', children='0', infants='0') -> List[
        OneWayFlight]:
        # set url
        url = f'https://www.ryanair.com/gb/en/trip/flights/select?adults=1&teens=0&children=0&infants=0&dateOut={flyout}&dateIn=&isConnectedFlight=false&discount=0&isReturn=false&promoCode=&originIata={orig}&destinationIata={dest}&tpAdults={adults}&tpTeens={teens}&tpChildren={children}&tpInfants={infants}&tpStartDate={flyout}&tpEndDate=&tpDiscount=0&tpPromoCode=&tpOriginIata={orig}&tpDestinationIata={dest}'

        # get the page
        self.driver.get(url)
        self.driver.implicitly_wait(10)

        # close cookies in button tag with cookie-popup-with-overlay__button class
        try:
            # wait till button with class name cookie-popup-with-overlay__button is clickable
            WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CLASS_NAME, 'cookie-popup-with-overlay__button')))
            # click the button
            self.driver.find_element(By.CLASS_NAME, 'cookie-popup-with-overlay__button').click()
        except Exception as e:
            print(f'Error closing cookies: {e}')

        # get the page source
        page = self.driver.page_source

        flights = self.get_flights_from_page(page, flyout, orig, dest, url, 0)

        # Calculate the difference in days between departure and arival dates (nights)
        difference = (datetime.strptime(flyin, "%Y-%m-%d").date() - datetime.strptime(flyout, "%Y-%m-%d").date()).days

        for i in range(difference):
            if i == 0:
                self.close_pop_xpath()
            self.go_to_next_day(i)
            page = self.driver.page_source
            flights.extend(self.get_flights_from_page(page, flyout, orig, dest, url, i+1))

        return flights

    def get_cheapest_prices_per_day(self, flights: List[OneWayFlight]) -> List[float]:
        # Dictionary to hold the minimum price for each date
        min_prices = defaultdict(lambda: float('inf'))

        for flight in flights:
            # Extract the departure date (without time) to use as a key
            departure_day = flight.departureDate.date()
            # Update the minimum price for the departure day
            if flight.price < min_prices[departure_day]:
                min_prices[departure_day] = flight.price

        # Extract the minimum prices and sort by date
        sorted_dates = sorted(min_prices.keys())
        cheapest_prices = [min_prices[date] for date in sorted_dates]

        return cheapest_prices

    def extract_float_and_string(self, input_str):
        # Regular expression to match alphabetic/currency symbols and numeric parts
        match = re.match(r"([^\d\.\,]+)?\s*([\d,\.]+)", input_str)

        if match:
            # Extract the parts
            string_part = match.group(1) if match.group(1) else ""
            number_part = match.group(2)

            # Handle localization of decimal separator
            if "." not in number_part:
                number_part = number_part.replace(',', '')

            # Convert to float
            float_part = float(number_part)

            return string_part.strip(), float_part
        else:
            print(input_str)
            raise ValueError("Input string format is incorrect")

    def get_flights_from_page(self, page, flyout, orig, dest, url, addDays) -> List[OneWayFlight]:

        # parse the page source
        soup = BeautifulSoup(page, 'html.parser')

        flights = []
        flight_cards = soup.find_all('div',
                                     class_='flight-card__header')  # Adjust the class name according to actual structure

        for id, card in enumerate(flight_cards):
            try:
                time_elements = card.find_all('span', class_='flight-info__hour title-l-lg title-l-sm')

                if time_elements and len(time_elements) >= 2:
                    departure_flyout_times = time_elements[0].text.replace(' ', '')
                    arrival_flyout_times = time_elements[1].text.replace(' ', '')
                else:
                    departure_flyout_times = 'N/A'
                    arrival_flyout_times = 'N/A'

                price_elem = card.find('flights-price-simple', class_='flight-card-summary__full-price').text.replace(
                    ' ', '')

                if price_elem:
                    price = price_elem
                else:
                    price = 'No flights available'

                departure_datetime = datetime.strptime(flyout + ' ' + departure_flyout_times, '%Y-%m-%d %H:%M') + timedelta(days=addDays)
                arrival_datetime = datetime.strptime(flyout + ' ' + arrival_flyout_times, '%Y-%m-%d %H:%M') + timedelta(days=addDays)

                if arrival_datetime < departure_datetime:
                    arrival_datetime += timedelta(days=1)

                currency, price = self.extract_float_and_string(price)

                print(currency, price)
                price = round(self.convert_to_eur(price, currency), 2)
                currency = "€"


                print(currency, price)

                print(departure_datetime)

                flight_info = OneWayFlight(
                    departureDate=departure_datetime,
                    arriveDate=arrival_datetime,
                    departureAirport=orig,
                    arriveAirport=dest,
                    price=price,
                    linkTrip=url,
                    checkedAt=datetime.now(),
                    currency=currency
                )

                flights.append(flight_info)

            except Exception as e:
                print(f"Error processing flight card: {e}")

        return flights

    def go_to_next_day(self, id):

        self.driver.save_screenshot(f'nowsecure{id}_0.png')

        try:
            # wait till button with class name cookie-popup-with-overlay__button is clickable
            WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH,
                                            '/html/body/app-root/flights-root/div/div/div/div/flights-lazy-content/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/div/div[2]/div/carousel-container/carousel/div/ul/li[4]/carousel-item/button')))

            self.driver.save_screenshot(f'nowsecure{id}_1.png')
            # click the button

            self.driver.find_element(By.XPATH,
                                     '/html/body/app-root/flights-root/div/div/div/div/flights-lazy-content/flights-summary-container/flights-summary/div/div[1]/journey-container/journey/div/div[2]/div/carousel-container/carousel/div/ul/li[4]/carousel-item/button').click()
        except Exception as e:
            print(f'Error pressing buttonee: {e}')

        self.driver.save_screenshot(f'nowsecure{id}_2.png')
        time.sleep(10)

    def close_pop_xpath(self):
        try:
            # wait till button with class name cookie-popup-with-overlay__button is clickable
            WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="cookie-popup-with-overlay"]/div/div[3]/button[3]')))
            # click the button
            self.driver.find_element(By.XPATH, '//*[@id="cookie-popup-with-overlay"]/div/div[3]/button[3]').click()
        except Exception as e:
            print(f'Error pressing buttoneey: {e}')

    def find_two_way_flights(self, SearchParams) -> (List[OneWayFlight], List[OneWayFlight], List[(float)]):

        print(SearchParams.searchStartDate, SearchParams.searchEndDate)

        depart = SearchParams.searchStartDate
        arrive = SearchParams.searchEndDate

        forward_flights = self.one_way_flight(depart,
                                              arrive,
                                              SearchParams.departureAirports[0],
                                              SearchParams.arriveAirports[0])

        print("Prices Forward")
        print(self.get_cheapest_prices_per_day(forward_flights))
        f_prices = self.get_cheapest_prices_per_day(forward_flights)
        self.close()
        options = uc.ChromeOptions()
        options.add_argument('--headless')
        self.driver = uc.Chrome(options=options)

        backward_flights = self.one_way_flight(depart,
                                               arrive,
                                               SearchParams.arriveAirports[0],
                                               SearchParams.departureAirports[0])
        print("Prices Backward")
        print(self.get_cheapest_prices_per_day(backward_flights))
        b_prices = self.get_cheapest_prices_per_day(backward_flights)

        prices = []

        for i in range(len(b_prices)):
            prices.append((f_prices[i], b_prices[i]))

        return forward_flights, backward_flights, prices

    # close the driver
    def close(self):
        self.driver.quit()

    def convert_to_eur(self, price: float, currency_symbol: str) -> float:
        converter = CurrencyConverter()
        # Define a mapping of currency symbols to currency codes
        symbol_to_code = {
            '€': 'EUR',  # Euro
            'Ft': 'HUF',  # Hungarian Forint
            '$': 'USD',  # US Dollar
            '£': 'GBP',  # British Pound
            '¥': 'JPY',  # Japanese Yen
            '₹': 'INR',  # Indian Rupee
            'C$': 'CAD',  # Canadian Dollar
            'A$': 'AUD',  # Australian Dollar
            'Fr': 'CHF',  # Swiss Franc
            'R': 'ZAR',  # South African Rand
            # Add more currencies as needed
        }

        # Get the currency code from the symbol
        currency_code = symbol_to_code.get(currency_symbol)

        # Check if the currency symbol is recognized
        if currency_code is None:
            raise ValueError(f"Unsupported currency symbol: {currency_symbol}")

        # If the currency is already in Euros, return the price as is
        if currency_code == 'EUR':
            return price

        # Convert the price to Euros
        try:
            price_in_eur = converter.convert(price, currency_code, 'EUR')
            return price_in_eur
        except ValueError as e:
            raise ValueError(f"Conversion error: {e}")

    def find_flight_propositions(self,
                                 forward_flights: List[OneWayFlight], backward_flights: List[OneWayFlight], min_days,
                                 max_days) -> Dict[int, List[FlightProposition]]:
        flight_propositions = {}

        for forward in forward_flights:
            for backward in backward_flights:
                days_interval = (backward.departureDate - forward.arriveDate).days

                if min_days <= days_interval <= max_days:

                    if days_interval not in flight_propositions.keys():
                        flight_propositions[days_interval] = []

                    proposition = FlightProposition(
                        departureDate=forward.departureDate,
                        arriveDate=forward.arriveDate,
                        backwardDepartureDate=backward.departureDate,
                        backwardArriveDate=backward.arriveDate,
                        departureAirport=forward.departureAirport,
                        arriveAirport=forward.arriveAirport,
                        departureAirportFinal=backward.arriveAirport,
                        priceForward=forward.price,
                        priceBackward=backward.price,
                        forwardCurrency=forward.currency,
                        backwardCurrency=backward.currency
                    )

                    flight_propositions[days_interval].append(proposition)

        return flight_propositions


departure_airports = ["BER"]
arrive_airports = ["BUD"]
start_date_search = datetime(2024, 8, 18)
end_date_search = datetime(2024, 8, 22)
trip_duration_min = 1
trip_duration_max = 2
is_same_return_airport = False
count_person = 1
price_min = 30
price_max = 300

example_search_params = SearchParams(
    searchStartDate=start_date_search,
    searchEndDate=end_date_search,
    tripDurationMin=trip_duration_min,
    tripDurationMax=trip_duration_max,
    isSameReturnAirports=is_same_return_airport,
    departureAirports=departure_airports,
    arriveAirports=arrive_airports,
    countOfPerson=count_person,
    priceMin=price_min,
    priceMax=price_max
)


## test
#if __name__ == '__main__':
#    # create the object
#    ryanair = RyanAir(headless=True)
#
#    # get the data
#    f, b = ryanair.find_two_way_flights(example_search_params)
#    print(f)
#    print(b)
#
#    r = ryanair.find_flight_propositions(f, b , 1, 3)
#
#    print(r)