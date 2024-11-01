import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function getCarList(query, page, pageSize) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT 
    Car.car_id, 
    Car.model, 
    Car.make, 
    Car.year, 
    Car.color, 
    Car.category, 
    Car.rental_status, 
    Price.base_price AS price
    FROM 
        Car
    JOIN 
        Price ON Car.price_id = Price.price_id
    WHERE 
        Car.model LIKE @query
    ORDER BY 
        Car.year DESC
    LIMIT @pageSize
    OFFSET @offset;`
  );

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  console.log("Params", params);

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getCarById(car_id) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT 
    Car.car_id, 
    Car.model, 
    Car.make, 
    Car.year, 
    Car.color, 
    Car.category, 
    Car.rental_status,
    Car.price_id,
    Price.base_price AS price
    FROM 
        Car
    JOIN 
        Price ON Car.price_id = Price.price_id
    WHERE 
        Car.car_id = @car_id;`
  );

  const params = {
    "@car_id": car_id,
  };

  try {
    return await stmt.get(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}


export async function getCarListCount(query) {
  console.log("getReferences", query);

  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Car
    WHERE model LIKE @query;
  `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getAvailableCars() {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT 
    Car.car_id, 
    Car.model, 
    Car.make, 
    Car.year, 
    Car.color, 
    Car.category, 
    Car.rental_status, 
    Price.base_price AS price
    FROM 
        Car
    JOIN 
        Price ON Car.price_id = Price.price_id
    WHERE 
        Car.rental_status = 'Available';`
  );

  try {
    return await stmt.all();
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getPriceList() {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`SELECT * FROM Price;`);

  try {
    return await stmt.all();
  } finally {
    await stmt.finalize();
    db.close();
  }
}


export async function insertBooking(book) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`INSERT INTO
    Booking(customer_id, start_date, end_date, total_cost)
    VALUES (@customer_id, @start_date, @end_date, @total_cost);`);

  try {
    const insertBook = await stmt.run({
      "@customer_id": book.customer_id,
      "@start_date": book.start_date,
      "@end_date": book.end_date,
      "@total_cost": book.total_cost,
    });
    const last_id = insertBook.lastID;
    console.log("➡️ Last ID", last_id);
    return {insertBook, last_id};
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function updateCarAvailability(car_id) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`UPDATE Car
    SET rental_status = 'Rented'
    WHERE car_id = @car_id;`);

  try {
    return await stmt.run({
      "@car_id": car_id,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function addBookingId(booking_id, car_id) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`INSERT INTO
    Car_Booking(car_id, booking_id)
    VALUES (@car_id, @booking_id);`);

  try {
    return await stmt.run({
      "@car_id": car_id,
      "@booking_id": booking_id,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getBookingList() {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT 
    Booking.booking_id, 
    Booking.start_date, 
    Booking.end_date, 
    Booking.total_cost, 
    Car.model, 
    Car.make, 
    Car.year, 
    Car.color, 
    Car.category,
    Customer.name
    FROM 
        Booking
    JOIN 
        Car_Booking ON Booking.booking_id = Car_Booking.booking_id
    JOIN 
        Car ON Car_Booking.car_id = Car.car_id
    JOIN 
        Customer ON Booking.customer_id = Customer.customer_id;`
  );

  try {
    return await stmt.all();
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function makeCarAvailable(booking_id) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`UPDATE Car
    SET rental_status = 'Available'
    WHERE car_id = (
      SELECT car_id
      FROM Car_Booking
      WHERE booking_id = @booking_id
    );`);

  try {
    return await stmt.run({
      "@booking_id": booking_id,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function deleteBooking(booking_id) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });
  db.run("PRAGMA foreign_keys = ON;");

  const stmt = await db.prepare(`DELETE FROM Booking
    WHERE booking_id = @booking_id;`);

  try {
    return await stmt.run({
      "@booking_id": booking_id,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function updateCar(car) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`UPDATE Car
    SET
      model = @model,
      make = @make,
      year = @year,
      color = @color,
      category = @category,
      rental_status = @rental_status,
      price_id = @price_id
    WHERE
      car_id = @car_id;`);

  try {
    return await stmt.run({
      "@car_id": car.car_id,
      "@model": car.model,
      "@make": car.make,
      "@year": car.year,
      "@color": car.color,
      "@category": car.category,
      "@rental_status": car.rental_status,
      "@price_id": car.price_id,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
  
}

export async function deleteCar(car_id) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`DELETE FROM Car
    WHERE car_id = @car_id;`);

  try {
    return await stmt.run({
      "@car_id": car_id,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function addToMaintenance(car_id) {
  const db = await open({
    filename: "./db/car_rental.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`INSERT INTO Maintenance_Record(car_id)
    VALUES (@car_id);`);

  try {
    return await stmt.run({
      "@car_id": car_id,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}
  

// export async function getReferenceByID(reference_id) {
//   console.log("getReferenceByID", reference_id);

//   const db = await open({
//     filename: "./db/car_rental.db",
//     driver: sqlite3.Database,
//   });

//   const stmt = await db.prepare(`
//     SELECT * FROM Reference
//     WHERE reference_id = @reference_id;
//   `);

//   const params = {
//     "@reference_id": reference_id,
//   };

//   try {
//     return await stmt.get(params);
//   } finally {
//     await stmt.finalize();
//     db.close();
//   }
// }

// export async function updateReferenceByID(reference_id, ref) {
//   console.log("updateReferenceByID", reference_id, ref);

//   const db = await open({
//     filename: "./db/car_rental.db",
//     driver: sqlite3.Database,
//   });

//   const stmt = await db.prepare(`
//     UPDATE Reference
//     SET
//       title = @title,
//       published_on = @published_on
//     WHERE
//       reference_id = @reference_id;
//   `);

//   const params = {
//     "@reference_id": reference_id,
//     "@title": ref.title,
//     "@published_on": ref.published_on,
//   };

//   try {
//     return await stmt.run(params);
//   } finally {
//     await stmt.finalize();
//     db.close();
//   }
// }

// export async function deleteReferenceByID(reference_id) {
//   console.log("deleteReferenceByID", reference_id);

//   const db = await open({
//     filename: "./db/car_rental.db",
//     driver: sqlite3.Database,
//   });

//   const stmt = await db.prepare(`
//     DELETE FROM Reference
//     WHERE
//       reference_id = @reference_id;
//   `);

//   const params = {
//     "@reference_id": reference_id,
//   };

//   try {
//     return await stmt.run(params);
//   } finally {
//     await stmt.finalize();
//     db.close();
//   }
// }

// export async function insertReference(ref) {
//   const db = await open({
//     filename: "./db/car_rental.db",
//     driver: sqlite3.Database,
//   });

//   const stmt = await db.prepare(`INSERT INTO
//     Reference(title, published_on)
//     VALUES (@title, @published_on);`);

//   try {
//     return await stmt.run({
//       "@title": ref.title,
//       "@published_on": ref.published_on,
//     });
//   } finally {
//     await stmt.finalize();
//     db.close();
//   }
// }

// export async function getAuthorsByReferenceID(reference_id) {
//   console.log("getAuthorsByReferenceID", reference_id);

//   const db = await open({
//     filename: "./db/car_rental.db",
//     driver: sqlite3.Database,
//   });

//   const stmt = await db.prepare(`
//     SELECT * FROM Reference_Author
//     NATURAL JOIN Author
//     WHERE reference_id = @reference_id;
//   `);

//   const params = {
//     "@reference_id": reference_id,
//   };

//   try {
//     return await stmt.all(params);
//   } finally {
//     await stmt.finalize();
//     db.close();
//   }
// }

// export async function addAuthorIDToReferenceID(reference_id, author_id) {
//   console.log("addAuthorIDToReferenceID", reference_id, author_id);

//   const db = await open({
//     filename: "./db/car_rental.db",
//     driver: sqlite3.Database,
//   });

//   const stmt = await db.prepare(`
//     INSERT INTO
//     Reference_Author(reference_id, author_id)
//     VALUES (@reference_id, @author_id);
//   `);

//   const params = {
//     "@reference_id": reference_id,
//     "@author_id": author_id,
//   };

//   try {
//     return await stmt.run(params);
//   } finally {
//     await stmt.finalize();
//     db.close();
//   }
// }

// export async function getAuthors(query, page, pageSize) {
//   console.log("getAuthors query", query);

//   const db = await open({
//     filename: "./db/car_rental.db",
//     driver: sqlite3.Database,
//   });

//   const stmt = await db.prepare(`
//     SELECT * FROM Author
//     WHERE
//       first_name LIKE @query OR
//       last_name LIKE @query
//     ORDER BY last_name DESC
//     LIMIT @pageSize
//     OFFSET @offset;
//   `);

//   const params = {
//     "@query": query + "%",
//     "@pageSize": pageSize,
//     "@offset": (page - 1) * pageSize,
//   };

//   try {
//     return await stmt.all(params);
//   } finally {
//     await stmt.finalize();
//     db.close();
//   }
// }

// export async function getAuthorsCount(query) {
//   console.log("getAuthorsCount query", query);

//   const db = await open({
//     filename: "./db/car_rental.db",
//     driver: sqlite3.Database,
//   });

//   const stmt = await db.prepare(`
//     SELECT COUNT(*) AS count
//     FROM Author
//     WHERE
//       first_name LIKE @query OR
//       last_name LIKE @query;
//   `);

//   const params = {
//     "@query": query + "%",
//   };

//   try {
//     return (await stmt.get(params)).count;
//   } finally {
//     await stmt.finalize();
//     db.close();
//   }
// }
