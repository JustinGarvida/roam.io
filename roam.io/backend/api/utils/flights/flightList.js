let axios = require("axios");
let { getAmadeusToken } = require("../amadeusToken");
let AMADEUS_CHEAPEST_DATES_URL =
  "https://test.api.amadeus.com/v1/shopping/flight-dates";

function buildDummyFlights({ origin, destination, departureDate }) {
  const baseDeparture = departureDate || "2025-12-19";
  return [
    {
      origin,
      destination,
      departureDate: baseDeparture,
      returnDate: "2025-12-26",
      price: 650.0,
      links: { self: "https://example.com/dummy-flight-1" },
    },
    {
      origin,
      destination,
      departureDate: "2025-12-20",
      returnDate: "2025-12-27",
      price: 720.0,
      links: { self: "https://example.com/dummy-flight-2" },
    },
    {
      origin,
      destination,
      departureDate: "2025-12-21",
      returnDate: "2025-12-28",
      price: 810.0,
      links: { self: "https://example.com/dummy-flight-3" },
    },
  ];
}

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

  const token = await getAmadeusToken();
  const params = { origin, destination };

  if (departureDate) params.departureDate = departureDate;
  if (oneWay != null) params.oneWay = oneWay;
  if (duration) params.duration = duration;
  if (nonStop != null) params.nonStop = nonStop;
  if (maxPrice) params.maxPrice = maxPrice;
  if (viewBy) params.viewBy = viewBy;

  try {
    const response = await axios.get(AMADEUS_CHEAPEST_DATES_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    const items = response.data && response.data.data ? response.data.data : [];

    const allFlights = items.map((item) => ({
      origin: item.origin,
      destination: item.destination,
      departureDate: item.departureDate,
      returnDate: item.returnDate,
      price: item.price?.total,
      links: item.links,
    }));

    if (allFlights.length === 0) {
      return null;
    }

    allFlights.sort((a, b) => a.price - b.price);
    return allFlights.slice(0, 5);
  } catch (error) {
    if (error.response && error.response.status === 500) {
      console.warn(
        "Amadeus returned 500, falling back to dummy flight data:",
        JSON.stringify(error.response.data, null, 2)
      );
      const dummy = buildDummyFlights({ origin, destination, departureDate });

      dummy.sort((a, b) => a.price - b.price);
      return dummy.slice(0, 5);
    }
    throw error;
  }
}

module.exports = { getCheapestFlightDates };
