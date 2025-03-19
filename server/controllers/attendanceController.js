const moment = require('moment');
const User = require('../models/userModel');

exports.recordAttendance = async (req, res) => {
    try {
        const { user_id, date } = req.body;
        const user = await User.findById(user_id);
        const userArriveTime = moment(user.start_time, "HH:mm");
        const userLeaveTime = moment(user.end_time)
        const formattedDate = moment(date).format("DD.MM.YYYY")
        const isLeaved = user.attendance.find(a =>
            moment(a.arrive_time).format("DD.MM.YYYY") === formattedDate
        );
        if (isLeaved) {
            const leaveDiff = moment(date).diff(moment(isLeaved.arrive_time), 'minutes')
            if (leaveDiff < 30) {
                return res.status(400).json({ message: "Ketish vaqti juda erta" });
            }
        } else {
            user.attendance.push({
                arrive_time: date,
                leave_time: null
            })
            const arriveDiff = moment(moment(date).format("HH:mm"), "HH:mm").diff(userArriveTime, 'minutes');
            if (arriveDiff > 1) {
                user.delays.push({
                    delay_date: date,
                    delay_minutes: arriveDiff
                })
            }
        }
        await user.save()
        return res.json({ message: "Saqlandi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}