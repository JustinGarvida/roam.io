const BASE_URL = process.env.REACT_APP_API_BASE;

export async function generateTripFromSurvey(finalData) {
    // We first need to generate a location based on the survey resultd
  const locationRes = await fetch(`${BASE_URL}/api/location`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalData),
  });

  if (!locationRes.ok) {
    throw new Error("Failed to generate location");
  }

  // Once we have this location data, we can generate a plan
  const locationData = await locationRes.json();
  const location = locationData.location || locationData;

  const plansRes = await fetch(`${BASE_URL}/api/trip-plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      survey: finalData,
      location,
    }),
  });

  if (!plansRes.ok) {
    throw new Error("Failed to generate trip plans");
  }

  const plansData = await plansRes.json();
  const plans = plansData.plans || plansData;

  return { location, plans };
}
