const express = require("express");
const cors = require("cors");
const pg = require("pg");
const dotenv = require("dotenv");

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

// Define + Register Routes
const hotelRoutes = require("./routes/hotels");

app.use("/api/hotels", hotelRoutes);

let PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
