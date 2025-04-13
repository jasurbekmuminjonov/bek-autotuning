const moment = require('moment-timezone');
const User = require('../models/userModel');

exports.recordAttendance = async (req, res) => {
    try {
        const { user_id, date } = req.body;

        // Vaqtni Tashkent bo‘yicha olish
        const requestDate = moment.tz(date, "Asia/Tashkent");
        const formattedDate = requestDate.format("DD.MM.YYYY");

        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

        // User start va end vaqtlarini momentga aylantirish
        const userArriveTime = moment.tz(user.start_time, "HH:mm", "Asia/Tashkent");
        const userLeaveTime = moment.tz(user.end_time, "HH:mm", "Asia/Tashkent");

        const isLeaved = user.attendance.find(a =>
            moment.tz(a.arrive_time, "Asia/Tashkent").isSame(requestDate, 'day')
        );

        if (isLeaved) {
            // Leave diff hisoblash (qayta kelganini tekshirish uchun)
            const leaveDiff = requestDate.diff(moment.tz(isLeaved.arrive_time, "Asia/Tashkent"), 'minutes');
            if (leaveDiff < 10) {
                return res.status(400).json({ message: "Ketish vaqti juda erta" });
            }

            isLeaved.leave_time = date;

            // Erta ketish tekshiruvi
            const earlyLeaveDiff = userLeaveTime.diff(requestDate.clone().startOf('day').add(requestDate.hours(), 'hours').add(requestDate.minutes(), 'minutes'), 'minutes');
            if (earlyLeaveDiff > 10) {
                const currentDelay = user.delays.find(d => moment(d.delay_date).format("DD.MM.YYYY") === formattedDate);
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

            const currentTime = requestDate.clone().startOf('day').add(requestDate.hours(), 'hours').add(requestDate.minutes(), 'minutes');
            const arriveDiff = currentTime.diff(userArriveTime, 'minutes');

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
};
