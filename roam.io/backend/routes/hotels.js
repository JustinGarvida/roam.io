const express = require("express");
const router = express.Router();
const { getAmadeusToken } = require("../utils/amadeusToken");

// For a smaller scaled application, we decided to always get a token on any call to the Amadeus API

// Get Hotels
router.get("/", async (req, res) =>{
    let amaduesToken = getAmadeusToken()



}
)
