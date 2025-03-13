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
                    ref: 'user',
                    required: true
                },
                amount_to_paid: {  //xizmat narxi
                    type: Number,
                    required: true
                },
                user_salary_amount: { //user uchun beriladigan maosh
                    type: {
                        amount: Number,
                        currency: {
                            type: String,
                            enum: ['USD', 'UZS']
                        }
                    },
                    required: true
                },
                spendings: {  //umumiy harajatlar
                    type: [
                        {
                            amount: { //user uchun beriladigan maosh
                                type: {
                                    amount: Number,
                                    currency: {
                                        type: String,
                                        enum: ['USD', 'UZS']
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
                    required: true
                },
                approved_time: {  //xizmat qabul qilingan vaqti
                    type: Date,
                    required: true
                },
                rejected_time: {  //xizmat rad etilgan vaqti
                    type: Date,
                    required: true
                },
                ended_time: { //xizmat tugatilgan vaqti
                    type: Date,
                    required: true
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
    status: { //status - inprogress: qilinayapti, finished: tugatildi
        type: String,
        enum: ['inprogress', 'finished'],
        default: 'inprogress'
    },
    total_amount_to_paid: { //user uchun beriladigan maosh
        type: {
            amount: Number,
            currency: {
                type: String,
                enum: ['USD', 'UZS']
            }
        },
        required: true
    },
    total_amount_paid: { //user uchun beriladigan maosh
        type: {
            amount: Number,
            currency: {
                type: String,
                enum: ['USD', 'UZS']
            }
        },
        required: true
    },
    total_spending_amount: { //user uchun beriladigan maosh
        type: {
            amount: Number,
            currency: {
                type: String,
                enum: ['USD', 'UZS']
            }
        },
        required: true
    },
    remained_amount_to_paid: { //user uchun beriladigan maosh
        type: {
            amount: Number,
            currency: {
                type: String,
                enum: ['USD', 'UZS']
            }
        },
        required: true
    },
    payment_log: [{  //to'langan pullar
        amount: { //user uchun beriladigan maosh
            type: {
                amount: Number,
                currency: {
                    type: String,
                    enum: ['USD', 'UZS']
                }
            },
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