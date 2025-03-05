const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    car_name: {  //mashina nomi
        type: String,
        required: true
    },
    car_number: { //mashina raqami
        type: String
    },
    client_phone: { //client tel raqami
        type: String,
        required: true,
        match: /^\d{9}$/
    },
    client_name: { //client tel ismi
        type: String,
        required: true
    },
    services_providing: {  //ko'rsatilayotgan xizmatlar
        type: [
            {
                user_id: {   //user id si
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'aser',
                    required: true
                },
                amount_to_paid: {  //xizmat narxi
                    type: Number,
                    required: true
                },
                user_salary_amount: { //user uchun beriladigan maosh
                    type: Number,
                    required: true
                },
                spendings: {  //umumiy harajatlar
                    type: [
                        {
                            amount: {  //harajat summasi
                                type: Number,
                                required: true
                            },
                            description: { //harajat tavsifi
                                type: String,
                                required: true
                            }
                        }
                    ],
                    default: [],
                    required: true
                },
                service_id: {  //xizmat id si
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'service',
                    required: true
                },
                start_time: {  //xizmat deadline boshlash vaqti
                    type: Date,
                    required: true
                },
                end_time: { //xizmat deadline tugash vaqti
                    type: Date,
                    required: true
                },
                status: { //status - pending:qabul qilish  kutilayapti, inprogress:xizmat bajarilyapti, finished:xizmat tugatildi, approved:tasdiqlandi
                    type: String,
                    enum: ['pending', 'inprogress', 'finished', 'approved'],
                    default: 'pending'
                },
                index: { //nechanchi tartibda qilish
                    type: Number,
                    default: 1
                }
            }
        ],
        default: [],
        required: true
    },
    status: { //status - inprogress:qilinayapti, finished:tugatildi
        type: String,
        enum: ['inprogress', 'finished'],
        default: 'inprogress'
    },
    total_amount_to_paid: {  //client to'laydigan umumiy summa
        type: Number,
        required: true,
        default: 0

    },
    total_amount_paid: { //client to'lagan umumiy summa
        type: Number,
        required: true,
        default: 0
    },
    total_spending_amount: { //sarflangan umumiy summa
        type: Number,
        required: true,
        default: 0

    },
    remained_amount_to_paid: { //client to'laydigan umumiy summa - client to'lagan umumiy summa
        type: Number,
        required: true,
        default: 0
    },
    payment_log: [{  //to'langan pullar
        amount: { //summa
            type: Number,
            required: true
        },
        paid_date: { //sana
            type: Date,
            required: true
        }
    }],
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('project', projectSchema);