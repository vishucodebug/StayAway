const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


//for listings
//Index route
router.get("/", wrapAsync( async  (req, res) =>{
    const allListings=  await Listing.find({});
    // console.log(allListings);    
    res.render("listings/index.ejs", {allListings});
}));

//search route
router.post("/search", async (req, res) =>{
    // console.log(req.body); 
    const { Search } = req.body;
    console.log(Search);
    try{
        const searchListings = await Listing.find({ location: Search }).exec();
        // console.log(searchListings); // Log the listings found
        console.log(searchListings);
        if( searchListings.length != 0){
            const allListings =  await Listing.find({});
            res.render("listings/search.ejs" , { searchListings, allListings, Search })
        }else{
            req.flash("error1", "Listings for the given location do not exist.");
            res.redirect("/listings"); 
        }

    }catch(err){
        console.log(err);
        res.send("some error in db");
    }
});

//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

//Show route
router.get("/:id", wrapAsync(async (req, res) =>{
    let {id}=req.params;
   const listing=await Listing.findById(id)
       .populate({
        path : "reviews",
        populate: {
            path: "author",
       }}).populate("owner");
   if(!listing){
    req.flash("error", "Listing you requested for doesn't exit !");
    res.redirect("/listings");
   };
   console.log(listing);
   res.render("listings/show.ejs", {listing});
}));

//Create route
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async(req, res, next) =>{       
        const newListing= new Listing(req.body.listing);
        console.log(newListing);
        newListing.owner = req.user._id;
        await  newListing.save();
        req.flash("success", "New Lisiting Created Successfully !");
         res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",
   isLoggedIn,
   isOwner,
   wrapAsync(async(req, res) =>{
    let {id} = req.params;

    const listing = await  Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for doesn't exit !");
        res.redirect("/listings");
       };
    res.render('listings/edit.ejs', {listing});
}));

//update route
router.put("/:id", 
    isLoggedIn,
    isOwner,
    validateListing,
     wrapAsync(async(req, res) =>{
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        req.flash("success", " Lisiting Updated Successfully !");
        res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", 
    isLoggedIn,
    isOwner, 
    wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success1", " Lisiting Deleted Successfully !");
    res.redirect("/listings");
}));

module.exports = router;