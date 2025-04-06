import { Tooltip, Button, Popconfirm, TimePicker, Popover } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { usePauseUserMutation, useResumeUserMutation } from '../../context/services/user.service';
import { FaClock } from 'react-icons/fa';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function PauseButton({ user }) {
    const [pauseUser] = usePauseUserMutation()
    const [resumeUser] = useResumeUserMutation()
    const [time, setTime] = useState(null);

    const lastPause = user.pause_log.length ? user.pause_log[user.pause_log.length - 1] : null;
    const isPaused = lastPause && !lastPause.pause_end;

    const handlePause = async () => {
        await pauseUser({
            user_id: user._id,
            body: {
                pause_start: dayjs().tz('Asia/Tashkent').format('HH:mm'),
                scheduled_time: time ? time.format('HH:mm') : null,
            }
        });
    };

    const handleResume = async () => {
        await resumeUser({
            user_id: user._id,
            pause_id: lastPause._id,
            body: {
                pause_end: dayjs().tz('Asia/Tashkent').format('HH:mm'),
            }
        });
    };

    return (
        <Popover
            content={
                <div>
                    <p>Rejalashtirilgan vaqt</p>
                    <TimePicker
                        format="HH:mm"
                        value={isPaused ? dayjs(lastPause.scheduled_time, "HH:mm") : time}
                        onChange={setTime}
                        placeholder="Vaqtni tanlang"
                        style={{ marginBottom: 8, width: '100%' }}
                        disabled={isPaused}
                    />
                    <Popconfirm
                        title={isPaused ? "Pauzani to'xtatish?" : "Pauza qilish?"}
                        onConfirm={isPaused ? handleResume : handlePause}
                        okText="Ha"
                        cancelText="Yo'q"
                    >
                        <Button type="primary" block>
                            {isPaused ? "Pauzani to'xtatish" : "Pauza qilish"}
                        </Button>
                    </Popconfirm>
                </div>
            }
            trigger="click"
        // visible={visible}
        // onVisibleChange={setVisible}
        >
            <button>
                <FaClock />
            </button>
        </Popover>
    );
}
