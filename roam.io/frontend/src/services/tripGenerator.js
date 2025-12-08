const BASE_URL = process.env.REACT_APP_API_BASE;
// const BASE_URL = "http://localhost:4000";

export async function generateTripFromSurvey(finalData) {
  console.log("Starting generateTripFromSurvey");
  console.log("Survey Data Received:", finalData);

  console.log("Sending POST to /api/location with body:", finalData);

  const locationRes = await fetch(`${BASE_URL}/api/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalData),
  });

  console.log("Raw /api/location Response:", locationRes);

  if (!locationRes.ok) {
    const errorText = await locationRes.text();
    console.error("Location Generation Failed:", errorText);
    throw new Error("Failed to generate location");
  }

  const locationData = await locationRes.json();
  console.log("Parsed Location Data:", locationData);

  const location = {
    displayName: locationData.location,
    zipCode: locationData.zipcode,
  };

  console.log("Final Location Object:", location);

  const plansPayload = { survey: finalData, location };
  console.log("Sending POST to /api/plans with payload:", plansPayload);

  const plansRes = await fetch(`${BASE_URL}/api/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plansPayload),
  });

  console.log("Raw /api/plans Response:", plansRes);

  if (!plansRes.ok) {
    const errorText = await plansRes.text();
    console.error("Plan Generation Failed:", errorText);
    throw new Error("Failed to generate trip plans");
  }

  const plansData = await plansRes.json();
  console.log("Parsed Plans Data:", plansData);

  const plans = plansData.plans || plansData;
  console.log("Final Plans Object:", plans);

  console.log("generateTripFromSurvey complete");
  return { location, plans };
}
