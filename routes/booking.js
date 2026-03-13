const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");
const wrapAsync = require("../utils/wrapAsync");

router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));
router.get("/bookings/:id", isLoggedIn, wrapAsync(bookingController.showBooking));
router.get("/my-bookings", isLoggedIn, wrapAsync(bookingController.myBookings));

module.exports = router;