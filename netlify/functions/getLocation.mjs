export default async (req) => {
    const params = new URL(req.url).searchParams;
    const latitude = +params.get('lat');
    const longitude = +params.get('lon');
    const username = 'chrj23020';
    try {
        const response = await fetch(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${username}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const placeName = data.geonames && data.geonames.length > 0 ? data.geonames[0].name : 'Location not found';

        return new Response(json.stringify({placeName: {placeName}}));
    } catch (error) {
        return new Response( json.stringify({
            placeName: JSON.stringify({ error: error.message })
        }));
    }
};