const express = require("express");
const router = express.Router();
const { generateTrips } = require("../utils/plans/generateTrips");

router.post("/", async (req, res) => {
  try {
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

    return res.status(200).json({ trips });
  } catch (err) {
    console.error("Error generating trips:", err);
    return res.status(500).json({
      error: "Failed to generate trips",
      details: err.message,
    });
  }
});

module.exports = router;
