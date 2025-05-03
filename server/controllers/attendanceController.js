const moment = require("moment-timezone");
const User = require("../models/userModel");

exports.recordAttendance = async (req, res) => {
  try {
    const { uid, date } = req.body;
    console.log("req.body", req.body);

    // ✅ Date kelmasa, hozirgi Tashkent vaqti
    const requestDate = date
      ? moment.tz(date, "Asia/Tashkent")
      : moment.tz("Asia/Tashkent");

    const formattedDate = requestDate.format("DD.MM.YYYY");

    const user = await User.findOne({idcarta:uid});
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    const userArriveTime = moment.tz(user.start_time, "HH:mm", "Asia/Tashkent");
    const userLeaveTime = moment.tz(user.end_time, "HH:mm", "Asia/Tashkent");

    const isLeaved = user.attendance.find((a) =>
      moment.tz(a.arrive_time, "Asia/Tashkent").isSame(requestDate, "day")
    );

    if (isLeaved) {
      const leaveDiff = requestDate.diff(
        moment.tz(isLeaved.arrive_time, "Asia/Tashkent"),
        "minutes"
      );
      if (leaveDiff < 10) {
        return res.status(400).json({ message: "Ketish vaqti juda erta" });
      }

      isLeaved.leave_time = requestDate.clone().add(5, "hours").toISOString();

      const earlyLeaveDiff = userLeaveTime.diff(requestDate.clone(), "minutes");
      if (earlyLeaveDiff > 10) {
        const currentDelay = user.delays.find(
          (d) => moment(d.delay_date).format("DD.MM.YYYY") === formattedDate
        );
        if (currentDelay) {
          currentDelay.delay_minutes += earlyLeaveDiff;
        } else {
          user.delays.push({
            delay_date: requestDate.toISOString(),
            delay_minutes: earlyLeaveDiff,
          });
        }
      }
    } else {
      user.attendance.push({
        arrive_time: requestDate.toISOString(),
        leave_time: null,
      });

      const currentTime = requestDate.clone();
      const arriveDiff = currentTime.diff(userArriveTime, "minutes");

      if (arriveDiff > 10) {
        user.delays.push({
          delay_date: requestDate.toISOString(),
          delay_minutes: arriveDiff,
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
