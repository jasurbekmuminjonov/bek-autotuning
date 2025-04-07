const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    car_name: {  // mashina nomi
        type: String,
        required: true
    },
    car_number: { // mashina raqami
        type: String
    },
    client_phone: { // client tel raqami
        type: String,
        required: true,
        match: /^\d{9}$/
    },
    client_name: { // client ismi
        type: String,
        required: true
    },
    front_image: {
        type: String,
        required: true,
    },
    back_image: {
        type: String,
        required: true,
    },
    left_image: {
        type: String,
        required: true,
    },
    car_id: {
        type: String,
        required: true,
    },
    right_image: {
        type: String,
        required: true,
    },
    isFree: { //to'lov mavjudligi
        type: Boolean,
        default: false
    },
    currency: { //afzal valyuta
        type: String,
        enum: ['USD', 'UZS'],
        default: 'UZS',
        required: true
    },
    services_providing: {  // ko'rsatilayotgan xizmatlar
        type: [
            {
                user_id: {   // user id si
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user',
                    required: true
                },
                // salaryType: {
                //     type: String,
                //     enum: ["percent", "salary", "percent_with_profit"]
                // },
                net_profit: {
                    type: {
                        amount: {
                            type: Number,
                            default: null
                        },
                        currency: {
                            type: String,
                            enum: ['USD', 'UZS'],
                            default: 'UZS'
                        }
                    }
                },
                // extra_profit: {
                //     type: {
                //         amount: {
                //             type: Number,
                //             default: 0
                //         },
                //         currency: {
                //             type: String,
                //             enum: ['USD', 'UZS'],
                //             default: 'UZS'
                //         }
                //     },
                //     required: true
                // },
                amount_to_paid: {  // xizmat narxi
                    type: {
                        amount: {
                            type: Number,
                            default: null
                        },
                        currency: {
                            type: String,
                            enum: ['USD', 'UZS'],
                            default: 'UZS'
                        }
                    },
                    required: true
                },
                user_salary_amount: {  // user uchun beriladigan maosh
                    type: {
                        amount: {
                            type: Number,
                            default: null
                        },
                        currency: {
                            type: String,
                            enum: ['USD', 'UZS'],
                            default: 'UZS'
                        }
                    },
                    required: true
                },
                // spendings: {  // umumiy harajatlar
                //     type: [
                //         {
                //             amount: {  // harajat miqdori
                //                 type: {
                //                     amount: {
                //                         type: Number,
                //                         default: null
                //                     },
                //                     currency: {
                //                         type: String,
                //                         enum: ['USD', 'UZS'],
                //                         default: 'UZS'
                //                     }
                //                 },
                //                 required: true
                //             },
                //             description: { // harajat tavsifi
                //                 type: String,
                //                 required: true
                //             }
                //         }
                //     ],
                //     default: [],
                //     required: true
                // },
                service_id: {  // xizmat id si
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'service',
                    required: true
                },
                start_time: {  // xizmat boshlash vaqti
                    type: Date,
                    required: true
                },
                end_time: { // xizmat tugash vaqti
                    type: Date,
                    required: true
                },
                started_time: {  // xizmat boshlangan vaqti
                    type: Date,
                    default: null
                },
                approved_time: {  // xizmat qabul qilingan vaqti
                    type: Date,
                    default: null
                },
                rejected_time: {  // xizmat rad etilgan vaqti
                    type: Date,
                    default: null
                },
                ended_time: { // xizmat tugatilgan vaqti
                    type: Date,
                    default: null
                },
                status: { // status - pending: qabul qilish kutilayapti, inprogress: xizmat bajarilyapti, finished: xizmat tugatildi, approved: tasdiqlandi, rejected: rad etildi
                    type: String,
                    enum: ['pending', 'inprogress', 'finished', 'approved', 'rejected', 'paused'],
                    default: 'pending'
                },
                pause_log: {
                    type: [{
                        start: Date,
                        end: Date
                    }],
                    default: []
                },
                index: { // nechanchi tartibda qilish
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
    status: { // status - inprogress: qilinayapti, finished: tugatildi
        type: String,
        enum: ['inprogress', 'finished'],
        default: 'inprogress'
    },
    total_profit: {
        type: Number,
        required: true
    },
    net_profit: {
        type: Number,
        required: true
    },
    total_amount_to_paid: { // umumiy to'lanishi kerak bo'lgan summa
        type: Number,
        default: null
    },
    remained_amount_to_paid: { // qolgan to'lanishi kerak bo'lgan summa
        type: Number,
        default: null
    },
    // total_spending_amount: { // umumiy sarflangan summa
    //     type: Number,
    //     default: null
    // },
    total_amount_paid: { // jami to'langan summa
        type: Number,
        default: 0
    },
    payment_log: {  // to'lovlar tarixi
        type: [
            {
                amount: {  // to'langan summa
                    type: Number,
                    default: null,
                    required: true
                },
                currency: {  // valyuta turi
                    type: String,
                    enum: ['USD', 'UZS'],
                    default: 'UZS',
                    required: true
                },
                paid_date: { // to'lov qilingan sana
                    type: Date,
                    required: true
                }
            }
        ],
        default: []
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(new Date().getTime() + 18000000).toISOString()
    }
});

module.exports = mongoose.model('project', projectSchema);
