let axios = require("axios");
let { getAmadeusToken } = require("../amadeusToken");
let AMADEUS_CHEAPEST_DATES_URL = "https://test.api.amadeus.com/v1/shopping/flight-dates";

async function getCheapestFlightDates({origin, destination, departureDate, oneWay, duration, nonStop, maxPrice, viewBy}) {
  if (!origin || !destination) {
    throw new Error("origin and destination are required");
  }

  let token = await getAmadeusToken();
  let params = { origin, destination };

  if (departureDate) {
    params.departureDate = departureDate;
  }

  if (oneWay != null) {
    params.oneWay = oneWay;
  }

  if (duration) {
    params.duration = duration;
  }

  if (nonStop != null) {
    params.nonStop = nonStop;
  }

  if (maxPrice) {
    params.maxPrice = maxPrice;
  }

  if (viewBy) {
    params.viewBy = viewBy;
  }

  let response = await axios.get(AMADEUS_CHEAPEST_DATES_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  let items;
  
  if (response.data && response.data.data) {
    items = response.data.data;
  } else {
    items = [];
  }

  return items.map((item) => ({
    origin: item.origin,
    destination: item.destination,
    departureDate: item.departureDate,
    returnDate: item.returnDate,
    price: item.price?.total,
    links: item.links,
  }));
}

module.exports = { getCheapestFlightDates };
