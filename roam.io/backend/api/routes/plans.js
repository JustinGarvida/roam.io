const express = require("express");
const router = express.Router();
const { generateTrips } = require("../utils/plans/generateTrips");

router.post("/", async (req, res) => {
  try {
    if (req.body.survey && req.body.location) {
      const { survey, location } = req.body;

      const {
        budget,
        tripStartDate,
        tripEndDate,
        travelCompanions,
        departureCity,
      } = survey;

      const zipCode = location.zipCode || location.zipcode;
      const destination = location.displayName || location.location;

      if (!zipCode) {
        return res.status(400).json({
          error: "zipCode is required from location.",
        });
      }

      if (!tripStartDate || !tripEndDate) {
        return res.status(400).json({
          error: "tripStartDate and tripEndDate are required in survey.",
        });
      }

      const origin = departureCity || "MAD"; // TODO: map to actual IATA if needed

      const adults = Number(travelCompanions || 1);
      const roomQuantity = Math.max(1, Math.ceil(adults / 2));

      const trips = await generateTrips({
        origin,
        destination,
        zipCode,
        checkInDate: tripStartDate,
        checkOutDate: tripEndDate,
        countryCode: "US",
        miles: 10,
        adults,
        roomQuantity,
        currencyCode: "USD",
        oneWay: false,
        duration: undefined,
        nonStop: undefined,
        maxPrice: budget,
        viewBy: "DATE",
        numOptions: 5,
      });

      return res.status(200).json({ plans: trips, trips });
    }

    const {
      origin,
      destination,
      zipCode,
      miles,
      countryCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      currencyCode,
      oneWay,
      duration,
      nonStop,
      maxPrice,
      viewBy,
      numOptions,
    } = req.body;

    if (!origin || !destination || !zipCode || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        error:
          "origin, destination, zipCode, checkInDate, and checkOutDate are required",
      });
    }

    const trips = await generateTrips({
      origin,
      destination,
      zipCode,
      miles,
      countryCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      currencyCode,
      oneWay,
      duration,
      nonStop,
      maxPrice,
      viewBy,
      numOptions,
    });

    return res.status(200).json({ plans: trips, trips });
  } catch (err) {
    console.error("Error generating trips:", err);
    return res.status(500).json({
      error: "Failed to generate trips",
      details: err.message,
    });
  }
});

module.exports = router;