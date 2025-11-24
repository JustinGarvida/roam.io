const generateLocation = require("./generateLocation");

const mockSurvey = {
  activities: "Outdoor adventures, Relaxing on the beach",
  budget: "105",
  climatePreference: "cold",
  departureCity: "Philadelphia",
  destinationType: "beach",
  notes: "",
  travelCompanions: "1",
  travelVibe: "relax",
  tripEndDate: "2025-11-26",
  tripStartDate: "2025-11-25",
};

(async () => {
  try {
    const result = await generateLocation(mockSurvey);
    console.log("Generated location result:");
    console.log(result);
  } catch (err) {
    console.error(" Error running generateLocation:");
    console.error(err);
  }
})();
