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
    currency: {
        type: String,
        enum: ['USD', 'UZS'],
        default: 'UZS',
        required: true
    },
    services_providing: {  //ko'rsatilayotgan xizmatlar
        type: [
            {
                user_id: {   //user id si
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user',
                    required: true
                },
                amount_to_paid: {  //xizmat narxi
                    type: {
                        amount: Number,
                        currency: {
                            type: String,
                            enum: ['USD', 'UZS'],
                            default: 'UZS'

                        }
                    },
                    required: true
                },
                user_salary_amount: {  //user uchun beriladigan maosh
                    type: {
                        amount: Number,
                        currency: {
                            type: String,
                            enum: ['USD', 'UZS'],
                            default: 'UZS'
                        }
                    },
                    required: true
                },
                spendings: {  //umumiy harajatlar
                    type: [
                        {
                            amount: {
                                type: {
                                    amount: Number,
                                    currency: {
                                        type: String,
                                        enum: ['USD', 'UZS'],
                                        default: 'UZS'

                                    }
                                },
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
                started_time: {  //xizmat boshlangan vaqti
                    type: Date,
                    default: null
                },
                approved_time: {  //xizmat qabul qilingan vaqti
                    type: Date,
                    default: null
                },
                rejected_time: {  //xizmat rad etilgan vaqti
                    type: Date,
                    default: null
                },
                ended_time: { //xizmat tugatilgan vaqti
                    type: Date,
                    default: null
                },
                status: { //status - pending:qabul qilish  kutilayapti, inprogress:xizmat bajarilyapti, finished:xizmat tugatildi, approved:tasdiqlandi
                    type: String,
                    enum: ['pending', 'inprogress', 'finished', 'approved', 'rejected'],
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
    leave_date: {
        type: Date,
        required: true
    },
    status: { //status - inprogress: qilinayapti, finished: tugatildi
        type: String,
        enum: ['inprogress', 'finished'],
        default: 'inprogress'
    },
    total_amount_to_paid: {
        type: Number,
        default: 0
    },
    total_spending_amount: {
        type: Number,
        default: 0
    },
    remained_amount_to_paid: {
        type: Number,
        default: 0
    },
    total_amount_paid: {
        type: Number,
        default: 0
    },
    payment_log: {
        type: [{
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                enum: ['USD', 'UZS'],
                default: 'UZS',
                required: true
            },
            paid_date: { //sana
                type: Date,
                required: true
            }
        }],
        default: []
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('project', projectSchema);