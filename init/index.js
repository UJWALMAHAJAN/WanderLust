const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"6ab8a1221913f69840a462da"}));
    await Listing.insertMany(initData.data);
    console.log("data was init");
};

main()
    .then(async () => {
        console.log("connected to db");
        await initDB();
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });