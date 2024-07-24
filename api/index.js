require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
})

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Error handling
app.use(errorHandler);

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
