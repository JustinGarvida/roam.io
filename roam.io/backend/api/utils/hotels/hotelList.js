const axios = require("axios");
const { getAmadeusToken } = require("../amadeusToken");
const {
  getCoordinatesByZip,
  getCoordinatesByLocation,
} = require("../geocodeCoordniates");

const AMADEUS_HOTELS_BY_GEOCODE_URL =
  "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode";

// Helper Function that gets hotels based off coordinates
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
    rating: h.rating ?? h.hotelRating?.rating ?? null,
  }));
}

// Fetch Hotels By ZIP Code.
async function getHotelsByZip({ zipCode, miles, countryCode = "US" }) {
  if (!zipCode) throw new Error("zipCode is required");
  if (!miles) throw new Error("miles is required");
  const { lat, lng } = await getCoordinatesByZip(zipCode, countryCode);
  return getHotelsByCoordinates({ lat, lng, miles });
}

// Fetch Hotel by Location String
async function getHotelsByLocation({ location, miles }) {
  if (!location) throw new Error("location is required");
  if (!miles) throw new Error("miles is required");
  const { lat, lng } = await getCoordinatesByLocation(location);
  return getHotelsByCoordinates({ lat, lng, miles });
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
};
