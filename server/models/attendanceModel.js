const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    attendance_date: {
        type: Date,
        required: true
    },
    arrival_time: {
        type: Date,
        required: true
    },
    leave_time: {
        type: Date,
        required: true,
        default: null
    }

});

module.exports = mongoose.model('attendance', attendanceSchema);