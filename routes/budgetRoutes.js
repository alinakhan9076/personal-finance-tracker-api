const express = require("express");
const Budget = require("../models/Budget");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month ) {
            return res.status(400).json({
                message: "Year and month are required",
            });
        }

        const budget = await Budget.findOne({
            userId: req.user.id,
            year: Number(year),
            month: Number(month),
        });

        res.json(budget);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
});

router.put("/", authMiddleware, async (req, res) => {
    try {
        const { year, month, limit } = req.body;

        if (
            year === undefined || month === undefined || limit === undefined
        ) {
            return res.status(400).json({
                message: "Year month and limit are required",
            });
        }

        if (
            !Number.isInteger(Number(year)) || 
            !Number.isInteger(Number(month)) || 
            !Number.isInteger(limit) || 

            Number(month) < 1 || 
            Number(month) > 12 ||
            limit < 0
        ) {
            return res.status(400).json({
                message: "Invalid budget data",
            });
        }

        const budget = await Budget.findOneAndUpdate(
            {
                userId: req.user.id,
                year: Number(year),
                month: Number(month),
            },
            {
                limit,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        res.json(budget);
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
});

module.exports = router;