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

export default router;
