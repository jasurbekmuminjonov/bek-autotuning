const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    expense_description: {
        type: String,
        required: true
    },
    expense_date: {
        type: Date,
        required: true
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    }
});

module.exports = mongoose.model('expense', expenseSchema);