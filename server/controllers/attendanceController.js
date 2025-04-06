const moment = require('moment');
const User = require('../models/userModel');

exports.recordAttendance = async (req, res) => {
    try {
        const { user_id, date } = req.body;
        const user = await User.findById(user_id);
        const userArriveTime = moment(user.start_time, "HH:mm");
        const userLeaveTime = moment(user.end_time, "HH:mm");
        const formattedDate = moment(date).format("DD.MM.YYYY");

        const isLeaved = user.attendance.find(a =>
            moment(a.arrive_time).format("DD.MM.YYYY") === formattedDate
        );

        if (isLeaved) {
            const leaveDiff = moment(date).diff(moment(isLeaved.arrive_time), 'minutes');
            if (leaveDiff < 10) {
                return res.status(400).json({ message: "Ketish vaqti juda erta" });
            }
            isLeaved.leave_time = date;

            const earlyLeaveDiff = userLeaveTime.diff(moment(moment(date).format("HH:mm"), "HH:mm"), 'minutes');
            if (earlyLeaveDiff > 10) {
                const currentDelay = user.delays.find(d => moment(d).format("DD.MM.YYYY") === formattedDate)
                if (currentDelay) {
                    currentDelay.delay_minutes += earlyLeaveDiff;
                } else {
                    user.delays.push({
                        delay_date: date,
                        delay_minutes: earlyLeaveDiff
                    });
                }
            }
        } else {
            user.attendance.push({
                arrive_time: date,
                leave_time: null
            });

            const arriveDiff = moment(moment(date).format("HH:mm"), "HH:mm").diff(userArriveTime, 'minutes');

            if (arriveDiff > 10) {
                user.delays.push({
                    delay_date: date,
                    delay_minutes: arriveDiff
                });
            }
        }

        await user.save();
        return res.json({ message: "Saqlandi" });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
