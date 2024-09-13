const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpessError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");




const validateReview = (req,res,next) =>{
  let{error} = reviewSchema.validate(req.body);
 // console.log(result);
  if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
  }
  else{
      next();
  }
};


//Review Route
//Post review route
router.post("/", isLoggedIn, reviewController.createReview
  );
  
  //Delete  review route
  router.delete("/:reviewId",
    isLoggedIn, reviewController.deleteReview    
  );


  module.exports = router;