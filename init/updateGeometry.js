const path = require("path");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

const updateGeometry = async () => {
    const listings = await Listing.find({
        $or: [
            { geometry: { $exists: false } },
            { "geometry.coordinates": { $exists: false } },
            { "geometry.coordinates": { $size: 0 } }
        ]
    });

    console.log(`Found ${listings.length} listings without geometry.`);

    for (let listing of listings) {
        try {
            const query = listing.location ? `${listing.location}, ${listing.country || ""}` : listing.country;
            if (!query) continue;

            const response = await geocodingClient
                .forwardGeocode({
                    query: query,
                    limit: 1,
                })
                .send();

            if (response.body.features && response.body.features.length > 0) {
                listing.geometry = response.body.features[0].geometry;
                await listing.save();
                console.log(`Updated coordinates for: ${listing.title} (${listing.location})`);
            } else {
                console.log(`No coordinates found for: ${listing.title} (${listing.location})`);
            }
        } catch (err) {
            console.error(`Failed to update ${listing.title}:`, err.message);
        }
    }
    console.log("Done updating listings!");
};

main()
    .then(async () => {
        console.log("Connected to DB");
        await updateGeometry();
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
