const Review = require("../models/review");
const Listing = require("../models/listing");
const {listingSchema, reviewSchema} = require("../schema.js");


module.exports.createReview = async(req,res) =>{
    let listing = await  Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
   // console.log(newReview);
    listing.reviews.push(newReview);
  
     await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  
    //console.log("New review saved");
    //res.send("New Review Send");
  }

  module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;
      await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("danger", " Review deleted!");
     res.redirect(`/listings/${id}`);
    }
