const User = require("../models/user.js");

module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
};

module.exports.showProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    const listings = await Listing.find({ owner: req.user._id });
    const bookings = await Booking.find({ user: req.user._id }).populate('listing');
    
    res.render("users/profile.ejs", { user, listings, bookings });
};


module.exports.addToWishlist = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user.wishlist.includes(id)) {
        user.wishlist.push(id);
        await user.save();
        req.flash("success", "Added to wishlist!");
    } else {
        req.flash("error", "Already in wishlist!");
    }
    
    res.redirect(`/listings/${id}`);
};

module.exports.removeFromWishlist = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: id }
    });
    
    req.flash("success", "Removed from wishlist!");
    res.redirect("/wishlist");
};

module.exports.showWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.render("users/wishlist.ejs", { listings: user.wishlist });
};