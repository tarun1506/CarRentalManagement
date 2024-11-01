import express from "express";
import * as myDb from "../db/mySqliteDB.js";

const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.redirect("/carlist");
});


router.get("/carlist", async (req, res, next) => {
  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  const success = req.query.success || null;
  const error = req.query.error || null;

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
      success,
      error,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/carlist/:car_id/edit", async (req, res, next) => {
  const car_id = req.params.car_id;
  try {
    const car = await myDb.getCarById(car_id);
    const priceList = await myDb.getPriceList();
    if (car.rental_status == 'Rented')
    {
      res.redirect("/carlist/?error=Car is rented and cannot be edited");
    }
    else if (car.rental_status == 'Maintenance')
    {
      res.redirect("/carlist/?error=Car is under maintenance and cannot be edited");
    }
      
    else
    {
      res.render("./pages/editCar", { car, priceList });
    }
    
  } catch (err) {
    next(err);
  }
});

router.post("/carlist/:car_id/edit", async (req, res, next) => {
  const car = req.body;
  try {
    if (car.rental_status == 'Maintenance')
    {
      const addToMaintenance = await myDb.addToMaintenance(car.car_id);
    }  
    const updateCar = await myDb.updateCar(car);
    if (updateCar && updateCar.changes == 1) {
      res.redirect("/carlist/?success=Update successful");
    } else {
      res.redirect("/carlist/?error=Update failed");
    }
  } catch (err) {
    next(err);
  }

});

router.get("/carlist/:car_id/delete", async (req, res, next) => {
  const car_id = req.params.car_id;
  try {
    const car = await myDb.getCarById(car_id);
    if (car.rental_status == 'Rented')
    {
      res.redirect("/carlist/?error=Car is rented and cannot be deleted");
    }
    else
    {
      const deleteCar = await myDb.deleteCar(car_id);
      if (deleteCar && deleteCar.changes == 1) {
        res.redirect("/carlist/?success=Delete successful");
      } else {
        res.redirect("/carlist/?error=Delete failed");
      }
    }
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

  try {
    const {insertBook, last_id} = await myDb.insertBooking(book);

    if (insertBook && insertBook.changes == 1) {
      const addBookingId = await myDb.addBookingId(last_id, book.car_id);
      if (addBookingId && addBookingId.changes == 1) {
        const updateavailability = await myDb.updateCarAvailability(book.car_id);
        if (updateavailability && updateavailability.changes == 1) {
          res.redirect("/carlist/?success=Boking successful");
        }
        else {
          res.redirect("/carlist/?error=Booking failed");
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
  const success = req.query.success || null;
  const error = req.query.error || null;
  try {
    const bookings = await myDb.getBookingList();
    
    res.render("./pages/bookingList", { bookings , success, error });
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
        res.redirect("/bookings/?success=Delete successful");
      } else {
        res.redirect("/bookings/?error=Delete failed");
      }
    }    
    
  } catch (err) {
    next(err);
  }

});

export default router;
