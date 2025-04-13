import React, { useState } from 'react';
import moment from 'moment';
import { Table } from 'antd';
import { useGetUsersQuery } from '../../context/services/user.service';

const Davomat = () => {
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
    const { data: users = [] } = useGetUsersQuery();

    const columns = [
        { title: "Ishchi", dataIndex: "name", key: "_id" },
        {
            title: "Kelish vaqti", dataIndex: "start_time", key: "_id"
        },
        {
            title: "Ketish vaqti", dataIndex: "end_time", key: "_id"
        },
        {
            title: "Kelgan vaqti",
            dataIndex: "attendance",
            key: "arrive_time",
            render: (attendance) => {
                const record = attendance.find(a => moment(a.arrive_time).format("YYYY-MM-DD") === selectedDate);
                return record ? moment(record.arrive_time).format("HH:mm") : "—";
            }
        },
        {
            title: "Ketgan vaqti",
            dataIndex: "attendance",
            key: "leave_time",
            render: (attendance) => {
                const record = attendance.find(a => moment(a.leave_time).format("YYYY-MM-DD") === selectedDate);
                return record ? moment(record.leave_time).utc().format("HH:mm") : "—";
            }
        },
        {
            title: "Kech qolish(soat)",
            dataIndex: "delays",
            key: "_id",
            render: (delays) => {
                const record = delays.find(d => moment(d.delay_date).format("YYYY-MM-DD") === selectedDate);
                return record ? moment.utc().startOf('day').add(record.delay_minutes, 'minutes').format('HH:mm') : "—";
            }
        },
        {
            title: "Dam olish kuni",
            dataIndex: "weekends",
            key: "_id",
            render: (text) => {
                const isWeekend = text.find(t => moment(t).format("YYYY-MM-DD") === selectedDate)
                return isWeekend ? "Ha" : "Yo'q";
            }
        },
        {
            title: "Jarima",
            render: (_, record) => {
                const today = moment().format("YYYY-MM-DD");
                const isPast = moment(selectedDate).isSameOrBefore(today, "day");
                const isWeekend = record.weekends.some(t =>
                    moment(t).format("YYYY-MM-DD") === selectedDate
                );

                if (moment(record.createdAt).isAfter(selectedDate, "day") || !isPast || isWeekend) {
                    return (
                        <span >
                            {"0"}
                        </span>
                    );
                }

                const attendance = record.attendance.find(a =>
                    moment(a.arrive_time).format("YYYY-MM-DD") === selectedDate
                );
                const delay = record.delays.find(d =>
                    moment(d.delay_date).format("YYYY-MM-DD") === selectedDate
                );

                // KECHIKISH VA KELMASLIKLARNI sanaganimizda, faqat selectedDate'ga qadar hisoblanadi
                let lateOrAbsentCount = 0;

                const currentDate = moment(selectedDate);
                const monthStart = moment(selectedDate).startOf("month");
                const dayCount = currentDate.date();

                for (let i = 1; i < dayCount; i++) {
                    const date = monthStart.clone().date(i).format("YYYY-MM-DD");

                    if (date >= today) continue;
                    if (moment(record.createdAt).isAfter(date, "day")) continue;

                    const wasPresent = record.attendance.some(att =>
                        moment(att.arrive_time).format("YYYY-MM-DD") === date
                    );
                    const wasDelayed = record.delays.some(d =>
                        moment(d.delay_date).format("YYYY-MM-DD") === date
                    );
                    const wasWeekend = record.weekends.some(w =>
                        moment(w).format("YYYY-MM-DD") === date
                    );

                    if (!wasWeekend && (!wasPresent || wasDelayed)) {
                        lateOrAbsentCount++;
                    }
                }

                let fine = 0;
                const rate = lateOrAbsentCount < 3 ? 10000 : 20000;
                if (attendance) {
                    fine = delay ? (delay.delay_minutes / 60) * rate : 0;
                } else {
                    const workHours = moment(record.end_time, "HH:mm").diff(
                        moment(record.start_time, "HH:mm"),
                        "hours"
                    );
                    fine = workHours * rate;
                }
                if (fine === 0) {
                    return (
                        <span>
                            {"0"}
                        </span>
                    );
                }

                return (
                    <span>
                      {(Math.round(fine / 1000) * 1000).toLocaleString() + " UZS"}
                    </span>
                  );
            },
            key: "_id"
        }
    ];

    return (
        <div className='manager_page'>
            <div className="manager_page_header">
                <p>Davomat</p>
                <div className="manager_page_header_actions">
                    <input
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        type="date"
                    />
                </div>
            </div>
            <Table dataSource={users.filter(u => !u.isSpecial)} columns={columns} rowKey="_id" />
        </div>
    );
};

export default Davomat;
