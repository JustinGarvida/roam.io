const express = require("express");
const router = express.Router();
const generateLocation = require("../utils/openai/generateLocation");

router.post("/", async (req, res) => {
  try {
    const surveyData = req.body;

    if (!surveyData || Object.keys(surveyData).length === 0) {
      return res.status(400).json({ error: "Missing survey payload" });
    }

    const locationResult = await generateLocation(surveyData);

    return res.status(200).json(locationResult);
  } catch (err) {
    console.error("Error generating location:", err);
    return res.status(500).json({
      error: "Failed to generate location",
      details: err.message,
    });
  }
});

module.exports = router;
