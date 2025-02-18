const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const expressError=require("./utils/expressError.js");
const {listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js");




const MONGO_URL="mongodb://127.0.0.1:27017/stayaway";
main()
   .then(()=> {
    console.log("Connected to DB");
    })                                        //basic codde to connect a databases mongoose
    .catch(err =>{
    console.log(err);                                      
    });
async function main(){
    await mongoose.connect(MONGO_URL);
};


app.get("/",(req,res)=>{
    res.send("hii.. i'm here");
})


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static('public'));


//for server side validation
const validateReview =(req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
}

//for server side validation
const validateListing =(req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
}

//for listings
//Index route
app.get("/listings", wrapAsync( async  (req, res) =>{
    const allListings=  await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//Show route
app.get("/listings/:id", wrapAsync(async (req, res) =>{
    let {id}=req.params;
   const listing=await Listing.findById(id).populate("reviews");
   res.render("listings/show.ejs", {listing});
}));

//Create route
app.post(
    "/listings",
    validateListing,
    wrapAsync(async(req, res, next) =>{       
        const newListing= new Listing(req.body.listing);
        await  newListing.save();
         res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req, res) =>{
    let {id} = req.params;
    const listing = await  Listing.findById(id);
    res.render('listings/edit.ejs', {listing});
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async(req, res) =>{
    
    let {id} = req.params;
     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));







//Reviews
//POST review route
app.post("/listings/:id/reviews", validateReview, wrapAsync( async(req, res) =>{
    let listing = await  Listing.findById(req.params.id);
    let newReview  =  new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId } =req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)

}));

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });

app.all("*", (req, res, next) =>{
    next(new expressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
    let {statusCode=500, message="Something Went Wrong!"} = err;
    res.status(statusCode).
    render("error.ejs",{message});
    // res.status(statusCode).send(message);
});



app.listen(8080,() => {
    console.log("Server is listing on port 8080");
})