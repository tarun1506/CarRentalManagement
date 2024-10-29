-- 1. Customer Table
CREATE TABLE Customer (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact INTEGER,
    driving_license TEXT NOT NULL
);

-- 2. Price Table
CREATE TABLE Price (
    price_id INTEGER PRIMARY KEY AUTOINCREMENT,
    base_price REAL NOT NULL,
    seasonal_adjustment REAL,
    promotion_discount REAL
);

-- 3. Car Table
CREATE TABLE Car (
    car_id INTEGER PRIMARY KEY AUTOINCREMENT,
    model TEXT NOT NULL,
    make TEXT NOT NULL,
    year INTEGER,
    color TEXT,
    category TEXT,
    rental_status TEXT,
    price_id INTEGER,
    FOREIGN KEY (price_id) REFERENCES Price(price_id) ON DELETE CASCADE
);

-- 4. Booking Table
CREATE TABLE Booking (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_cost REAL NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

-- 5. Car_Booking Association Table
CREATE TABLE Car_Booking (
    car_id INTEGER,
    booking_id INTEGER,
    PRIMARY KEY (car_id, booking_id),
    FOREIGN KEY (car_id) REFERENCES Car(car_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE
);

-- 6. Maintenance_Record Table
CREATE TABLE Maintenance_Record (
    maintenance_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER,
    maintenance_type TEXT NOT NULL,
    maintenance_date TEXT,
    FOREIGN KEY (car_id) REFERENCES Car(car_id) ON DELETE CASCADE
);

-- 7. Report Table
CREATE TABLE Report (
    report_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    type TEXT NOT NULL,
    generated_date TEXT,
    details TEXT,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE
);
