const express = require("express");
require("colors");
require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000; // http://localhoste:5000

// Conect to database
connectDB();

const app = express();

app.use(express.json()); // pozwala na wysyłanie JSON
app.use(express.urlencoded({ extended: false })); // pozwala na wysyłanie url-encoded www form
// z Express bierzemy get request która przymuje route(ścieżkę w naszym przypadku root (http://localhoste:5000/)) i funkcję z  2 zmiennymi reqest i response
app.get("/", (req, res) => {
  //   res.send("Hello"); // jak zrobimy GET request w postman to otrzymamy Hello  (status:200)
  //   res.json({ message: "Welcome to Support Desk API" }); // zwraca JSON "message": "Welcome to Support Desk API"  (status:200)
  res.status(200).json({ message: "Welcome to Support Desk API" }); // mimo że powyższe i tak zwraca status 200 lepiej dodać status(200) możemy np. zwrócić status 201- created
});

// Routes
app.use("/api/users", require("./routes/userRoutes")); // use(endPoint, źródło pliku )
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
