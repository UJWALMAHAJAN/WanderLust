const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



//index and create route
router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post( isLoggedIn,
   upload.single("listing[image][url]"),
   validateListing,
   wrapAsync(ListingController.createListing))

//New Route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

//show and update route and delete 
router.route("/:id")
.get( wrapAsync(ListingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(ListingController.updateListing)
)
.delete(isLoggedIn,isOwner, wrapAsync(ListingController.destroyListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = router;
