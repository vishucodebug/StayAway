const express=require("express");
const router=express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport =require("passport");
const { saveRedirectUrl } = require("../middleware.js");



//signup user
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) =>{
   try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
               return next(err)
            };
            req.flash("success2", "Welcome to ");
            res.redirect("/listings");
        });
       
   }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
   }
}));


//login user
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login", 
    saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect: '/login',
    failureFlash: true }),
    async(req, res) => {
         req.flash("success2"," You are logged in. Welcome back to ");
         let redirectUrl = res.locals.redirectUrl || "/listings";
         res.redirect(redirectUrl);

})

//logout user
router.get("/logout", (req, res ) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out !");
        res.redirect("/listings");
    })
})


module.exports = router;