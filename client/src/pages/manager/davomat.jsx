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
                return record ? moment(record.leave_time).format("HH:mm") : "—";
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
                // Hozirgi sana
                const today = moment().format("YYYY-MM-DD");
                // Tanlangan sana kelajak emasligini tekshiramiz
                const isPastOrToday = moment(selectedDate).isSameOrBefore(today, "day");
                // Tanlangan sana dam olish kunlari ichida bor-yo‘qligini tekshiramiz
                const isWeekend = record.weekends.some(t => moment(t).format("YYYY-MM-DD") === selectedDate);

                // Agar dam olish kuni bo‘lsa yoki kelajak bo‘lsa jarima 0 bo‘ladi
                if (isWeekend || !isPastOrToday) {
                    return (<span style={{ padding: "6px", background: "green", color: "#fff" }}>{"0 UZS"}</span>);
                }

                // Davomatni topamiz
                const attendance = record.attendance.find(a => moment(a.arrive_time).format("YYYY-MM-DD") === selectedDate);
                // Kechikishni topamiz
                const delay = record.delays.find(d => moment(d.delay_date).format("YYYY-MM-DD") === selectedDate);

                let fine = 0;

                if (attendance) {
                    // Agar kelgan bo‘lsa, faqat kechikish jarimasi hisoblanadi
                    fine = delay ? (delay.delay_minutes / 60) * 10000 : 0;
                } else {
                    // Agar kelmagan bo‘lsa, ish vaqti asosida jarima hisoblanadi
                    const workHours = moment(record.end_time, "HH:mm").diff(
                        moment(record.start_time, "HH:mm"),
                        "hours"
                    );
                    fine = workHours * 10000;
                }

                return (<span style={{ padding: "6px", background: "red", color: "#fff" }}>{"-" + fine.toLocaleString() + " UZS"}</span>);
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
            <Table dataSource={users} columns={columns} rowKey="_id" />
        </div>
    );
};

export default Davomat;
