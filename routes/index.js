import express from "express";
import * as myDb from "../db/mySqliteDB.js";

const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.redirect("/carlist");
});

// http://localhost:3000/references?pageSize=24&page=3&q=John
router.get("/carlist", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  try {
    let total = await myDb.getCarListCount(query);
    let cars = await myDb.getCarList(query, page, pageSize);
    let availableCars = await myDb.getAvailableCars();
  
    res.render("./pages/index", {
      cars,
      availableCars,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total / pageSize),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/bookCar", async (req, res, next) => {
  const book = req.body;
  
  const pricePerDay = parseFloat(book.price);
  const startDate = new Date(book.start_date);
  const endDate = new Date(book.end_date);
  const timeDifference = endDate - startDate;
  const bookDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;
  const totalCost = bookDays * pricePerDay;

  book.total_cost = totalCost;
  console.log("😁 POST", book);

  try {
    const {insertBook, last_id} = await myDb.insertBooking(book);

    if (insertBook && insertBook.changes == 1) {
      const addBookingId = await myDb.addBookingId(last_id, book.car_id);
      if (addBookingId && addBookingId.changes == 1) {
        const updateavailability = await myDb.updateCarAvailability(book.car_id);
        if (updateavailability && updateavailability.changes == 1) {
          res.redirect("/carlist/?msg=Boking successful");
        }
        else {
          res.redirect("/carlist/?msg=Booking failed");
        }
      }
    }
    
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

router.get("/bookings", async (req, res, next) => {
  const msg = req.query.msg || null;
  try {
    const bookings = await myDb.getBookingList();
    // console.log("📚 bookings", bookings);
    res.render("./pages/bookingList", { bookings , msg });
  } catch (err) {
    next(err);
  }
});

router.post("/bookings/:booking_id/delete", async (req, res, next) => {
  const booking_id = req.params.booking_id;
  
  try {

    const makeCarAvailable = await myDb.makeCarAvailable(booking_id);
    if (makeCarAvailable && makeCarAvailable.changes == 1) {
      const deleteBooking = await myDb.deleteBooking(booking_id);
      if (deleteBooking && deleteBooking.changes == 1) {
        res.redirect("/bookings/?msg=Delete successful");
      } else {
        res.redirect("/bookings/?msg=Delete failed");
      }
    }    
    
  } catch (err) {
    next(err);
  }

});

export default router;
