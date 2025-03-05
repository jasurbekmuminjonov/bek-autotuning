const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    service_name: {
        type: String,
        required: true
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('service', serviceSchema);