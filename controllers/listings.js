const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


const {listingSchema, reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");


module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    
}


module.exports.renderNewForm =  (req,res)=>{
    console.log(req.user);
 
    res.render("listings/new.ejs");
}

module.exports.ListingShow = async(req,res)=>{
    let {id} = req.params;
    const listing =await Listing.findById(id)
    .populate({
        path: "reviews",
        populate:{
            path: "author",
  },
    })
    .populate("owner");
    if(!listing){
        req.flash("danger", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}


module.exports.ListingCreate = async(req,res,next) =>{

  let response =  await  geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();

      console.log(response.body.features[0].geometry);
       // res.send("Done!");
    let result = listingSchema.validate(req.body);
   let url = req.file.path;
   let filename = req.file.filename;
   //console.log(url, "..", filename);
     const newlisting = new Listing(req.body.listing);
     //console.log(req.user);
     newlisting.owner = req.user._id;
     newlisting.image = {url, filename};
     newlisting.geometry = response.body.features[0].geometry;
    let savedListing =   await newlisting.save();
    console.log(savedListing);
      req.flash("success", "New listing created!");
    //console.log(newlisting);
    res.redirect("/listings");
    };



    module.exports.renderEdit = async (req,res)=>{
        let {id} = req.params;
        const listing =await Listing.findById(id);

        let orignalUrl = listing.image.url;
        orignalUrl=orignalUrl.replace("/upload", "/upload/h_250,w_250");
        res.render("listings/edit.ejs", { listing , orignalUrl});
    };

    module.exports.updateListings = async(req,res)=>{
        let {id} = req.params;
   let listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
  if( typeof req.file !== "undefined"){
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image = {url, filename};
   await listing.save();
  }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    const deleteList = await Listing.findByIdAndDelete(id);
    //console.log(deleteList);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};