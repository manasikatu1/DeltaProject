const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next) =>{
   // console.log(req.path, "..", req.originalUrl);
   // console.log(req.user);
    if(!req.isAuthenticated()){
        //redirect save
        req.session.redirectUrl = req.originalUrl;
        req.flash("danger", "you must be logged in to create listing!");
       return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();

}

module.exports.isOwner= async(req, res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
 if(!listing.owner.equals(res.locals.currUser._id)){
     req.flash("danger", "You are not owner of this listing!");
      return res.redirect(`/listings/${id}`);
 }
 next();
 
}

// module.exports.isReviewAuthor= async(req, res,next)=>{
//     let {id, reviewId} = req.params;
//     let review = await Review.findById(reviewId);
//     if(!review ){
//         req.flash("danger", "Review not found");
    
// return res.redirect(`/listings/${id}`);
// }

//  if(!review.author.equals(res.locals.currUser._id)){
//      req.flash("danger", "You are not author of this review!");
//       return res.redirect(`/listings/${id}`);
//  }
//  next();

// };