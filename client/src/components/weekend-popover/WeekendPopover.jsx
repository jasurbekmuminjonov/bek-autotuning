import { useState } from "react";
import { Popover, DatePicker, Button } from "antd";
import { FaRegCalendarAlt } from "react-icons/fa";
import dayjs from "dayjs";

const WeekendPopover = ({ record, setWeekend, removeWeekend }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const isWeekend = (date) => {
        return record?.weekends?.some((d) => dayjs(d).isSame(date, "day"));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleAddWeekend = () => {
        if (selectedDate) {
            setWeekend({ body: { date: selectedDate.format("YYYY-MM-DD") }, user_id: record._id });
            setSelectedDate(null);
        }
    };

    const handleRemoveWeekend = () => {
        if (selectedDate) {
            removeWeekend({ body: { date: selectedDate.format("YYYY-MM-DD") }, user_id: record._id });
            setSelectedDate(null);
        }
    };

    return (
        <Popover
            content={
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <DatePicker
                        placeholder="Kalendar"
                        value={selectedDate}
                        onChange={handleDateChange}
                        dateRender={(current) => {
                            const style = {};
                            if (isWeekend(current)) {
                                style.backgroundColor = "#ffccc7";
                            }
                            return (
                                <div className="ant-picker-cell-inner" style={style}>
                                    {current.date()}
                                </div>
                            );
                        }}
                    />
                    <Button
                        type="primary"
                        disabled={!selectedDate || isWeekend(selectedDate)}
                        onClick={handleAddWeekend}
                    >
                        Qo'shish
                    </Button>
                    <Button
                        danger
                        disabled={!selectedDate || !isWeekend(selectedDate)}
                        onClick={handleRemoveWeekend}
                    >
                        O'chirish
                    </Button>
                </div>
            }
            title="Dam olish kunlari"
            trigger="click"
        >
            <button>
                <FaRegCalendarAlt />
            </button>
        </Popover>
    );
};

export default WeekendPopover;
