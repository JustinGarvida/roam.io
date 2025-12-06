const { getCheapestHotelsByZip } = require("../hotels/hotelList");
const { getCheapestFlightDates } = require("../flights/flightList");

async function generateTrips({
  origin,
  destination,
  zipCode,
  miles = 10,
  countryCode = "US",

  checkInDate,
  checkOutDate,

  adults = 1,
  roomQuantity = 1,
  currencyCode = "USD",

  oneWay = false,
  duration,
  nonStop,
  maxPrice,
  viewBy,

  numOptions = 5,
}) {
  if (!zipCode) {
    throw new Error("zipCode is required");
  }
  if (!checkInDate || !checkOutDate) {
    throw new Error("checkInDate and checkOutDate are required");
  }
  if (!origin || !destination) {
    throw new Error("origin and destination (IATA codes) are required");
  }

  const hotels = await getCheapestHotelsByZip({
    zipCode,
    miles,
    checkInDate,
    checkOutDate,
    countryCode,
    adults,
    roomQuantity,
    currencyCode,
  });

  if (!hotels || hotels.length === 0) {
    return [];
  }

  hotels.sort((a, b) => a.totalPrice - b.totalPrice);
  const selectedHotels = hotels.slice(0, numOptions);

  const flights = await getCheapestFlightDates({
    origin,
    destination,
    departureDate: checkInDate,
    oneWay,
    duration,
    nonStop,
    maxPrice,
    viewBy,
  });

  if (!flights || flights.length === 0) {
    return [];
  }

  const validFlights = flights.filter(
    (f) => f && f.price != null && !Number.isNaN(Number(f.price))
  );

  if (validFlights.length === 0) {
    return [];
  }

  let trips = [];

  for (const hotel of selectedHotels) {
    const hotelPrice = Number(hotel.totalPrice || 0);

    for (const flight of validFlights) {
      const flightPrice = Number(flight.price || 0);
      const totalPrice = hotelPrice + flightPrice;

      trips.push({
        destination: hotel.city || destination,
        checkInDate: hotel.checkInDate || checkInDate,
        checkOutDate: hotel.checkOutDate || checkOutDate,
        hotel,
        flight,
        currency: currencyCode,
        totalTripPrice: totalPrice,
      });
    } 
  }

  if (maxPrice) {
    const numericMax = Number(maxPrice);
    trips = trips.filter((trip) => trip.totalTripPrice <= numericMax);

    if (trips.length === 0) {
      return [];
    }
  }

  trips.sort((a, b) => a.totalTripPrice - b.totalTripPrice);

  return trips.slice(0, numOptions);
}

module.exports = { generateTrips };
         