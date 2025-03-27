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
            title: "Kech qolish(minut)",
            dataIndex: "delays",
            key: "_id",
            render: (delays) => {
                const record = delays.find(d => moment(d.delay_date).format("YYYY-MM-DD") === selectedDate);
                return record ? record.delay_minutes : "—";
            }
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
