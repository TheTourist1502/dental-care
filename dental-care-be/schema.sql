CREATE TABLE IF NOT EXISTS bookings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name  TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  booking_date  TEXT NOT NULL,
  time_slot     TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
