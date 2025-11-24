const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

let app = express();

//Need cors if frontend and backend are on different ports
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>roam.io API</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h1>Welcome to the roam.io API</h1>
        <p>For more information on the API source code, visit the GitHub repo:</p>

        <p>
          <a href="https://github.com/JustinGarvida/roam.io/tree/main/roam.io/backend" 
             target="_blank" 
             style="font-size: 18px;">
            View Backend Repository
          </a>
        </p>
      </body>
    </html>
  `);
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
const flightRoutes = require("./routes/flights");
const locationRoutes = require("./routes/location");

app.use("/api/hotels", hotelRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/location", locationRoutes)

let PORT = process.env.PORT || 4000;

// Only listen when running directly with `node server.js`
// Vercel will NOT hit this path; it will just use `module.exports = app`
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
}

module.exports = app;
