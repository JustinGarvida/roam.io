let express = require("express");
let router = express.Router();
let { getCheapestFlightDates } = require("../utils/flights/flightList");

// test with
// curl "http://localhost:4000/api/flights/cheapest-dates?origin=MAD&destination=LON&viewBy=MONTH"

router.get("/cheapest-dates", async (req, res) => {
  try {
    let { origin, destination, departureDate, oneWay, duration, nonStop, maxPrice, viewBy } = req.query;

    let data = await getCheapestFlightDates({
      origin,
      destination,
      departureDate,
      oneWay: oneWay === "true",
      duration,
      nonStop: nonStop === "true",
      maxPrice,
      viewBy,
    });

    res.json({ data });
  } catch (error) {
    console.error("Cheapest Flight Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
