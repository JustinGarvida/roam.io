// utils/generateTrips.js (or wherever you keep it)

const { getCheapestHotelsByZip } = require("../hotels/hotelList");
const { getCheapestFlightDates } = require("../flights/flightList");

/**
 * Generate up to `numOptions` combined hotel + flight trip packages
 * based on a ZIP code for hotels.
 *
 * NOTE: Flight `links` are removed from the returned payload.
 */
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

  const cheapestFlightRaw = await getCheapestFlightDates({
    origin,
    destination,
    departureDate: checkInDate,
    oneWay,
    duration,
    nonStop,
    maxPrice,
    viewBy,
  });

  if (!cheapestFlightRaw || !cheapestFlightRaw.price) {
    return [];
  }

  const { links, ...cheapestFlight } = cheapestFlightRaw;

  const selectedHotels = hotels.slice(0, numOptions);

  const trips = selectedHotels.map((hotel) => {
    const hotelPrice = Number(hotel.totalPrice || 0);
    const flightPrice = Number(cheapestFlight.price || 0);

    return {
      destination: hotel.city || destination,
      checkInDate: hotel.checkInDate || checkInDate,
      checkOutDate: hotel.checkOutDate || checkOutDate,

      hotel,
      flight: cheapestFlight, 

      currency: currencyCode,
      totalTripPrice: hotelPrice + flightPrice,
    };
  });

  trips.sort((a, b) => a.totalTripPrice - b.totalTripPrice);
  return trips.slice(0, numOptions);
}

module.exports = {
  generateTrips,
};
