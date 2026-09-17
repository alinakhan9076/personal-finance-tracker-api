const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/expenses", authMiddleware,
     (req, res) => {
    res.json([]);
});

const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
})
.catch((error) =>{
    console.error("MongoDB connection failed:", error.message);
});