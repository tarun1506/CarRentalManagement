-- 1. Insert Data into Customer
INSERT INTO Customer (name, contact, driving_license) VALUES 
('Alice Johnson', 1234567890, 'DL12345'),
('Bob Smith', 9876543210, 'DL67890'),
('Charlie Adams', 5551234567, 'DL54321'),
('David Brown', 2223334444, 'DL11111'),
('Emma Wilson', 6667778888, 'DL22222'),
('Frank White', 4445556666, 'DL33333'),
('Grace Green', 8889990000, 'DL44444'),
('Hannah Black', 9998887777, 'DL55555'),
('Ian Grey', 7776665555, 'DL66666'),
('Jackie Blue', 1112223333, 'DL77777');

-- 2. Insert Data into Price
INSERT INTO Price (base_price, seasonal_adjustment, promotion_discount) VALUES 
(100.0, 10.0, 5.0),
(150.0, 20.0, 10.0),
(200.0, 15.0, 8.0),
(250.0, 25.0, 12.0),
(300.0, 30.0, 15.0);

-- 3. Insert Data into Car
INSERT INTO Car (model, make, year, color, category, rental_status, price_id) VALUES 
('Model S', 'Tesla', 2022, 'Red', 'Electric', 'Available', 1),
('Corolla', 'Toyota', 2020, 'White', 'Sedan', 'Available', 2),
('Mustang', 'Ford', 2021, 'Blue', 'Sports', 'Rented', 3),
('Civic', 'Honda', 2019, 'Black', 'Sedan', 'Maintenance', 2),
('Camry', 'Toyota', 2023, 'Silver', 'Sedan', 'Available', 2),
('Cybertruck', 'Tesla', 2024, 'Grey', 'Truck', 'Rented', 1),
('RAV4', 'Toyota', 2021, 'Green', 'SUV', 'Available', 3),
('Wrangler', 'Jeep', 2020, 'Black', 'SUV', 'Rented', 3),
('Charger', 'Dodge', 2018, 'Orange', 'Sports', 'Maintenance', 4),
('Leaf', 'Nissan', 2022, 'White', 'Electric', 'Available', 1);

-- 4. Insert Data into Booking
INSERT INTO Booking (customer_id, start_date, end_date, total_cost) VALUES 
(1, '2024-10-01', '2024-10-05', 400.0),
(2, '2024-10-02', '2024-10-07', 600.0),
(3, '2024-10-05', '2024-10-10', 800.0),
(4, '2024-10-03', '2024-10-06', 300.0),
(5, '2024-10-04', '2024-10-08', 500.0),
(6, '2024-10-09', '2024-10-13', 700.0),
(7, '2024-10-11', '2024-10-15', 900.0),
(8, '2024-10-12', '2024-10-14', 250.0),
(9, '2024-10-16', '2024-10-20', 1000.0),
(10, '2024-10-18', '2024-10-22', 750.0);

-- 5. Insert Data into Car_Booking (Association Table)
INSERT INTO Car_Booking (car_id, booking_id) VALUES 
(1, 1), (2, 2), (3, 3), 
(4, 4), (5, 5), (6, 6), 
(7, 7), (8, 8), (9, 9), 
(10, 10);

-- 6. Insert Data into Maintenance_Record
INSERT INTO Maintenance_Record (car_id, maintenance_type, maintenance_date) VALUES 
(4, 'Oil Change', '2024-09-01'),
(9, 'Brake Inspection', '2024-09-15'),
(6, 'Tire Rotation', '2024-09-20'),
(3, 'Battery Check', '2024-09-25'),
(5, 'Alignment', '2024-09-30');

-- 7. Insert Data into Report
INSERT INTO Report (booking_id, type, generated_date, details) VALUES 
(1, 'Invoice', '2024-10-05', 'Rental completed, amount paid: $400'),
(2, 'Invoice', '2024-10-07', 'Rental completed, amount paid: $600'),
(3, 'Damage Report', '2024-10-10', 'Minor scratches on the Ford Mustang'),
(4, 'Invoice', '2024-10-06', 'Rental completed, amount paid: $300'),
(5, 'Invoice', '2024-10-08', 'Rental completed, amount paid: $500'),
(6, 'Invoice', '2024-10-13', 'Rental completed, amount paid: $700'),
(7, 'Damage Report', '2024-10-15', 'Jeep Wrangler tire punctured'),
(8, 'Invoice', '2024-10-14', 'Rental completed, amount paid: $250'),
(9, 'Invoice', '2024-10-20', 'Rental completed, amount paid: $1000'),
(10, 'Invoice', '2024-10-22', 'Rental completed, amount paid: $750');
