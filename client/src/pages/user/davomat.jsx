import React, { useState } from 'react';
import { useGetUsersQuery } from '../../context/services/user.service';
import moment from 'moment'
const Davomat = () => {
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const { data: users = [] } = useGetUsersQuery();
    const user_id = localStorage.getItem("user_id")
    const user = users.find((user) => user._id === user_id) || null
    // if (!user_id || !user) {
    //     localStorage.clear();
    //     window.location.href = "/"
    // }
    const calculateFine = (record) => {
        const today = moment().format("YYYY-MM-DD");
        const isPast = moment(selectedDate).isSameOrBefore(today, "day");
        const isWeekend = record?.weekends.some(t =>
            moment(t).format("YYYY-MM-DD") === selectedDate
        );

        if (moment(record?.createdAt).isAfter(selectedDate, "day") || !isPast || isWeekend) {
            return 0;
        }

        const attendance = record?.attendance.find(a =>
            moment(a.arrive_time).format("YYYY-MM-DD") === selectedDate
        );
        const delay = record?.delays.find(d =>
            moment(d.delay_date).format("YYYY-MM-DD") === selectedDate
        );

        let lateOrAbsentCount = 0;
        const currentDate = moment(selectedDate);
        const monthStart = moment(selectedDate).startOf("month");
        const dayCount = currentDate.date();

        for (let i = 1; i < dayCount; i++) {
            const date = monthStart.clone().date(i).format("YYYY-MM-DD");

            if (date >= today) continue;
            if (moment(record?.createdAt).isAfter(date, "day")) continue;

            const wasPresent = record?.attendance.some(att =>
                moment(att.arrive_time).format("YYYY-MM-DD") === date
            );
            const wasDelayed = record?.delays.some(d =>
                moment(d.delay_date).format("YYYY-MM-DD") === date
            );
            const wasWeekend = record?.weekends.some(w =>
                moment(w).format("YYYY-MM-DD") === date
            );

            if (!wasWeekend && (!wasPresent || wasDelayed)) {
                lateOrAbsentCount++;
            }
        }

        const rate = lateOrAbsentCount < 3 ? 10000 : 20000;

        if (attendance) {
            return delay ? (delay.delay_minutes / 60) * rate : 0;
        } else {
            const workHours = moment(record?.end_time, "HH:mm").diff(
                moment(record?.start_time, "HH:mm"),
                "hours"
            );
            return workHours * rate;
        }
    };

    return (
        <div className='user_page'>
            <div className="user_page_header" style={{ justifyContent: "space-between" }}>
                <p>Davomat</p>
                <input
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    type="date" />
            </div>
            <p>
                Kelish vaqti: {
                    user?.attendance.find(item => moment(item?.arrive_time).isSame(selectedDate, 'day'))?.arrive_time
                        ? moment(user.attendance.find(item => moment(item.arrive_time).isSame(selectedDate, 'day'))?.arrive_time).format("HH:mm")
                        : "-"
                }
            </p>            <p>
                Ketish vaqti: {
                    user?.attendance.find(item => moment(item?.arrive_time).isSame(selectedDate, 'day'))?.leave_time
                        ? moment(user.attendance.find(item => moment(item.arrive_time).isSame(selectedDate, 'day'))?.leave_time).utc().format("HH:mm")
                        : "-"
                }
            </p>
            <p>
                Jarima: {Number(Math.round(Math.abs(calculateFine(user)) / 1000) * 1000).toLocaleString()}
            </p>

        </div>
    );
};


export default Davomat;