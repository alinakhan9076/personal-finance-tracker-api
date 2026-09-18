const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const expenses = await Expense.find({
            userId: req.user.id,
        }).sort({ date: -1 });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { amount, category, date, note } = req.body;

        if (
            amount === undefined || !category || !date
        ) {
            return res.status(400).json({
                message: "Amount, category and date are required",
            });
        }

        if (!Number.isInteger(amount) || amount < 0) {
            return res.status(400).json({
                message: "Amount must be a valid paise value",
            });
        }

        const expense = await Expense.create({
            userId: req.user.id,
            amount,
            category,
            date,
            note,
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
});

module.exports = router;