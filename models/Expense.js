const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: Date,
            required: true,
            default: Date.now,
        },

        note: {
            type: String,
            trim: true,
            maxlength: 200,
        },
    },{
        timestamps: true,
    }
);

module.exports = mongoose.model("Expense", expenseSchema);