const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpessError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
     listingControllers.ListingCreate,
     
);

//NEW ROUTE
router.get("/new",isLoggedIn, listingControllers.renderNewForm);

router
.route("/:id")
.get(listingControllers.ListingShow)
.put(  isLoggedIn, 
       isOwner,
       upload.single('listing[image]'), 
       listingControllers.updateListings)

.delete(isLoggedIn, isOwner,
     listingControllers.destroyListing
    //validateListing,
   // wrapAsync( )
);

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn,  isOwner, listingControllers.renderEdit
);

module.exports = router;












//INDEX ROUTE
// router.get("/",wrapAsync(listingControllers.index));


//NEW ROUTE
// router.get("/new",isLoggedIn, listingControllers.renderNewForm);


//SHOW ROUTE
// router.get("/:id", listingControllers.ListingShow);

//CREATE ROUTE

//     router.post("/",  isLoggedIn, listingControllers.ListingCreate
// );

//EDIT ROUTE
// router.get("/:id/edit", isLoggedIn,  isOwner, listingControllers.renderEdit
// );

//UPDATE ROUTE
// router.put("/:id",  isLoggedIn,  isOwner, listingControllers.updateListings
// );


//DELETE ROUTE
// router.delete("/:id",isLoggedIn, isOwner, listingControllers.destroyListing
//     //validateListing,
//    // wrapAsync( )
// );


module.exports = router;
