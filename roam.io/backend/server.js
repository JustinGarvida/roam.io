import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
let { Pool } = pg;

let app = express();

//Need cors if frontend and backend are on different ports
app.use(cors());
app.use(express.json());
let pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.post("/api/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  res.status(200).json({ message: "Login successful" });
});

app.post("/api/signup", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email + " " + password);
  res.status(200).json({ message: "Signup successful" });
});

// CURRENTLY RESEARCHING API AND TRYING TO FIGURE OUT TOKEN OR BETTER ALTERNATIVE
app.get("/flights", (req, res) => {
  let origin = req.query.origin;
  let destination = req.query.destination;
  let date = req.query.date;
  let tokenUrl = `https://test.api.amadeus.com/v1/security/oauth2/token`;
  let flightUrl = `https://test.api.amadeus.com/v1/shopping/flight-dates?origin=${origin}&destination=${destination}&departureDate=${date}&oneWay=true&max=5`;
  console.log("Client requested /flights");
  axios(url).then(response => {
    console.log("API response received");
    res.json(response.data);
  }).catch(error => {
    console.log("Error when requesting from API", error);
    res.status(500).json({});
  });
  console.log("Request sent to API");
});

let PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
