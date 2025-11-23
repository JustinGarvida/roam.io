const axios = require("axios");
const { getAmadeusToken } = require("../amadeusToken");
const {
  getCoordinatesByZip,
  getCoordinatesByLocation,
} = require("../geocodeCoordniates");

const AMADEUS_HOTELS_BY_GEOCODE_URL =
  "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode";

const AMADEUS_HOTEL_OFFERS_URL =
  "https://test.api.amadeus.com/v3/shopping/hotel-offers";

// Helper Function that gets hotels based off coordinates (metadata only)
async function getHotelsByCoordinates({ lat, lng, miles, amadeusToken }) {
  if (lat == null || lng == null) throw new Error("lat and lng are required");
  if (!miles) throw new Error("miles (radius) is required");

  const radiusKm = Math.round(miles * 1.60934);
  const token = amadeusToken || (await getAmadeusToken());

  const resp = await axios.get(AMADEUS_HOTELS_BY_GEOCODE_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      latitude: lat,
      longitude: lng,
      radius: radiusKm,
      radiusUnit: "KM",
      hotelSource: "ALL",
    },
  });

  const items = resp.data?.data ?? [];
  return items.map((h) => ({
    hotelId: h.hotelId,
    name: h.name,
    chainCode: h.chainCode,
    iataCode: h.iataCode,
    latitude: h.geoCode?.latitude,
    longitude: h.geoCode?.longitude,
    address: h.address?.lines?.join(", "),
    city: h.address?.cityName,
    countryCode: h.address?.countryCode,
  }));
}

/**
 * Helper that takes a list of hotels (with hotelId metadata)
 * and returns the cheapest offers for those hotels.
 */
async function getCheapestOffersForHotels({
  hotels,
  checkInDate,
  checkOutDate,
  adults = 1,
  roomQuantity = 1,
  currencyCode = "USD",
  amadeusToken,
}) {
  if (!Array.isArray(hotels) || hotels.length === 0) {
    return [];
  }
  if (!checkInDate) throw new Error("checkInDate is required");
  if (!checkOutDate) throw new Error("checkOutDate is required");

  const token = amadeusToken || (await getAmadeusToken());

  const hotelIds = hotels.map((h) => h.hotelId).filter(Boolean);

  if (!hotelIds.length) {
    return [];
  }

  const hotelIdsParam = hotelIds.slice(0, 50).join(",");

  const hotelMetaById = new Map();
  hotels.forEach((h) => {
    if (h.hotelId) {
      hotelMetaById.set(h.hotelId, h);
    }
  });

  const resp = await axios.get(AMADEUS_HOTEL_OFFERS_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      hotelIds: hotelIdsParam,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      currencyCode,
      sort: "PRICE",
    },
  });

  const items = resp.data?.data ?? [];
  const offers = [];

  for (const item of items) {
    const hotel = item.hotel || {};
    const meta = hotelMetaById.get(hotel.hotelId) || {};

    for (const offer of item.offers || []) {
      const priceTotal = Number(offer.price?.total);
      if (Number.isNaN(priceTotal)) continue;

      offers.push({
        hotelId: hotel.hotelId,
        name: meta.name || hotel.name,
        chainCode: meta.chainCode || hotel.chainCode,
        iataCode: meta.iataCode || hotel.iataCode,
        latitude: meta.latitude || hotel.geoCode?.latitude,
        longitude: meta.longitude || hotel.geoCode?.longitude,
        address: meta.address || hotel.address?.lines?.join(", "),
        city: meta.city || hotel.address?.cityName,
        countryCode: meta.countryCode || hotel.address?.countryCode,
        checkInDate: offer.checkInDate || checkInDate,
        checkOutDate: offer.checkOutDate || checkOutDate,
        roomQuantity: offer.roomQuantity || roomQuantity,
        adults: offer.guests?.adults || adults,
        currency: offer.price?.currency || currencyCode,
        totalPrice: priceTotal,
      });
    }
  }

  offers.sort((a, b) => a.totalPrice - b.totalPrice);
  return offers.slice(0, 10);
}

async function getCheapestHotelsByCoordinates({
  lat,
  lng,
  miles,
  checkInDate,
  checkOutDate,
  adults = 1,
  roomQuantity = 1,
  currencyCode = "USD",
  amadeusToken,
}) {
  if (lat == null || lng == null) throw new Error("lat and lng are required");
  if (!miles) throw new Error("miles (radius) is required");
  if (!checkInDate) throw new Error("checkInDate is required");
  if (!checkOutDate) throw new Error("checkOutDate is required");

  const token = amadeusToken || (await getAmadeusToken());

  const hotels = await getHotelsByCoordinates({
    lat,
    lng,
    miles,
    amadeusToken: token,
  });

  return getCheapestOffersForHotels({
    hotels,
    checkInDate,
    checkOutDate,
    adults,
    roomQuantity,
    currencyCode,
    amadeusToken: token,
  });
}

async function getHotelsByZip({ zipCode, miles, countryCode = "US" }) {
  if (!zipCode) throw new Error("zipCode is required");
  if (!miles) throw new Error("miles is required");
  const { lat, lng } = await getCoordinatesByZip(zipCode, countryCode);
  return getHotelsByCoordinates({ lat, lng, miles });
}

async function getCheapestHotelsByZip({
  zipCode,
  miles,
  checkInDate,
  checkOutDate,
  countryCode = "US",
  adults = 1,
  roomQuantity = 1,
  currencyCode = "USD",
}) {
  if (!zipCode) throw new Error("zipCode is required");
  if (!miles) throw new Error("miles is required");
  const { lat, lng } = await getCoordinatesByZip(zipCode, countryCode);
  return getCheapestHotelsByCoordinates({
    lat,
    lng,
    miles,
    checkInDate,
    checkOutDate,
    adults,
    roomQuantity,
    currencyCode,
  });
}

// Fetch Hotel by Location String
async function getHotelsByLocation({ location, miles }) {
  if (!location) throw new Error("location is required");
  if (!miles) throw new Error("miles is required");
  const { lat, lng } = await getCoordinatesByLocation(location);
  return getHotelsByCoordinates({ lat, lng, miles });
}

// Helper Function to get the cheapest hotels based on string location
async function getCheapestHotelsByLocation({
  location,
  miles,
  checkInDate,
  checkOutDate,
  adults = 1,
  roomQuantity = 1,
  currencyCode = "USD",
}) {
  if (!location) throw new Error("location is required");
  if (!miles) throw new Error("miles is required");
  const { lat, lng } = await getCoordinatesByLocation(location);
  return getCheapestHotelsByCoordinates({
    lat,
    lng,
    miles,
    checkInDate,
    checkOutDate,
    adults,
    roomQuantity,
    currencyCode,
  });
}

// Main function for getting hotels. We only want to return 20 hotels to prevent payload overload.
// At the current moment, hotels can be fetched via zipcode or location, not both at once.
async function getHotels({ zipCode, location, miles, countryCode = "US" }) {
  if (!miles) throw new Error("miles (radius) is required");
  if (zipCode) return getHotelsByZip({ zipCode, miles, countryCode });
  if (location) return getHotelsByLocation({ location, miles });
  throw new Error("Provide either zipCode or location");
}

module.exports = {
  getHotels,
  getHotelsByZip,
  getHotelsByLocation,
  getHotelsByCoordinates,
  getCheapestHotelsByCoordinates,
  getCheapestHotelsByZip,
  getCheapestHotelsByLocation,
  getCheapestOffersForHotels, 
};
