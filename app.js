if(process.env.NODE_ENV != "production"){
    require('dotenv').config();    
}


//console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
//const { title } = require("process");
const methodOverride = require("method-override");
//const { allowedNodeEnvironmentFlags } = require("process");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpessError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter= require("./routes/user.js");

//const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;



main()
.then(()=>{
    console.log("Connect to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/Public")));


const store = MongoStore.create({
    mongoUrl: dbURL,
     crypto: {
    secret: process.env.SECRET,
},
     touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("Error on Mongo-Session Store", err);
});

const sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,  
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// app.get("/", (req,res)=>{
//     res.send("Hii I am root");
// });




app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.danger = req.flash("danger");
    res.locals.currUser = req.user;
   // res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    next();
});

// app.use("/demouser",async (req, res) =>{
//     let fakeUser = new User({
//         email: "maso8001@gmail.com",
//         username: "sulabhmarathi1",
//     });
//  let registerUser = await  User.register(fakeUser, "helloworld2");
//  res.send(registerUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.listen(8080, ()=>{
    console.log("Server is listening on port 8080");
});
// app.get("/testListing",async (req,res)=>{
//     let sampleList = new Listing({
//         title: "My Villa",
//         description:"By the beach",
//         price:1500,
//         location:"Butterfly beach Goa",
//         country:"India",
//     });
//      await sampleList.save();
//     // console.log("Sample was saved");
//      res.send("Successfully tested");

// });

// app.all("*", (req,res,next)=>{
// next(new ExpressError(404, "Page not found!"));
// });

//  app.use((err, res,req, next)=>{
//   let {status = 500, message = "Something went wrong"} = err;
// res.status(status).render("error.ejs");
// //   res.send("Something went wrong!");
//res.status(status).send(message);
 ///});

