const express = require("express");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/by-category", authMiddleware, async (req, res) => {
    try {
        const { year, month } = req.query;

        const y = Number(year);
        const m = Number(month);

        const start = new Date(y, m - 1, 1);
        const end = new Date(y, m, 1);

        const summary = await Expense.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id),

                    date: {
                        $gte: start,
                        $lt: end,
                    },
                },
            },

            {
                $group: {
                    _id: "$category",
                    total: {
                        $sum: "$amount",
                    },
                },
            },

            {
                $sort: {
                    total: -1,
                },
            },
        ]);

        res.json(summary);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
});

module.exports = router;