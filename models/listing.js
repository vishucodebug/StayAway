const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js")

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,  
    image:{
        type:String,
        default:"https://samujana.com/wp-content/uploads/2020/06/BlogSize_Villa.jpg",
        set: (v) =>
         v==="" ? "https://samujana.com/wp-content/uploads/2020/06/BlogSize_Villa.jpg"
        : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id  :{$in: listing.reviews}})
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;