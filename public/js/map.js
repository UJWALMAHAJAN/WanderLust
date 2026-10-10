mapboxgl.accessToken = mapToken;

const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;
const centerCoordinates = hasCoordinates ? coordinates : [77.2090, 28.6139];

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: centerCoordinates, // starting position [lng, lat]
    zoom: hasCoordinates ? 9 : 3 // starting zoom
});

if (hasCoordinates) {
    const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat(coordinates) // listing.geometry.coordinates
        .addTo(map);
}