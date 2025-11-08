const express = require("express");
const router = express.Router();

// An access token is required to use the Almadeus API. Because of this, we need to store the token locally
let accessToken = null;
let tokenExpiresAt = 0;  