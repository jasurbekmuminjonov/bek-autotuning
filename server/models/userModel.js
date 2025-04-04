const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    middle_name: {
        type: String,
        required: true
    },
    first_phone: {
        type: String,
        required: true
    },
    second_phone: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    start_time: {
        type: String,
        required: true
    },
    end_time: {
        type: String,
        required: true
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    paychecks: {
        type: [
            {
                amount: {
                    type: Number,
                    required: true
                },
                paycheck_date: {
                    type: Date,
                    required: true
                }
            }
        ],
        default: []
    },
    delays: {
        type: [
            {
                delay_date: {
                    type: Date,
                    required: true
                },
                delay_minutes: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    },
    attendance: {
        type: [{
            arrive_time: Date,
            leave_time: Date
        }],
        default: []
    },
    isSpecial: {
        type: Boolean,
        default: false
    },
    weekends: {
        type: [Date],
        default: []
    }

}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);