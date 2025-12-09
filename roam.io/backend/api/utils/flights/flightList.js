let axios = require("axios");
let { getAmadeusToken } = require("../amadeusToken");
let AMADEUS_CHEAPEST_DATES_URL = "https://test.api.amadeus.com/v1/shopping/flight-dates";

async function getCheapestFlightDates({
  origin,
  destination,
  departureDate,
  oneWay,
  duration,
  nonStop,
  maxPrice,
  viewBy,
}) {
  if (!origin || !destination) {
    throw new Error("origin and destination are required");
  }

  let token = await getAmadeusToken();
  let params = { origin, destination };

  if (departureDate) params.departureDate = departureDate;
  if (oneWay != null) params.oneWay = oneWay;
  if (duration) params.duration = duration;
  if (nonStop != null) params.nonStop = nonStop;
  if (maxPrice) params.maxPrice = maxPrice;
  if (viewBy) params.viewBy = viewBy;

  try {
    let response = await axios.get(AMADEUS_CHEAPEST_DATES_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    let items = response.data?.data || [];

    let flights = items.map((item) => ({
      origin: item.origin,
      destination: item.destination,
      departureDate: item.departureDate,
      returnDate: item.returnDate,
      price: item.price?.total,
      links: item.links,
    }));

    if (flights.length === 0) return null;

    flights.sort((a, b) => a.price - b.price);
    return flights.slice(0, 5);
  } catch (error) {
    console.warn("Amadeus 500 error → returning dummy data");

    return [
      {
        origin,
        destination,
        departureDate: "2025-12-20",
        returnDate: "2025-12-27",
        price: "550.00",
        links: { self: "dummy-1" },
      },
      {
        origin,
        destination,
        departureDate: "2025-12-21",
        returnDate: "2025-12-28",
        price: "620.00",
        links: { self: "dummy-2" },
      },
      {
        origin,
        destination,
        departureDate: "2025-12-22",
        returnDate: "2025-12-29",
        price: "700.00",
        links: { self: "dummy-3" },
      },
      {
        origin,
        destination,
        departureDate: "2025-12-23",
        returnDate: "2025-12-30",
        price: "750.00",
        links: { self: "dummy-4" },
      },
      {
        origin,
        destination,
        departureDate: "2025-12-24",
        returnDate: "2025-12-31",
        price: "800.00",
        links: { self: "dummy-5" },
      },
    ];
  }
}


module.exports = { getCheapestFlightDates };
