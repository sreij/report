export default async function(event, context) {
    const { latitude, longitude } = JSON.parse(event.body);
    const username = 'chrj23020';
    try {
        const response = await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${username}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const placeName = data.geonames && data.geonames.length > 0 ? data.geonames[0].name : 'Location not found';

        return {
            statusCode: 200,
            body: JSON.stringify({ placeName }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};