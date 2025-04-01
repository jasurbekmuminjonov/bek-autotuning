const Admin = require('../models/adminModel');
const Manager = require('../models/managerModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        let auth;
        let globalAdmin;
        const { login, password } = req.body
        const admin = await Admin.findOne({ login })
        const manager = await Manager.findOne({ login })
        const user = await User.findOne({ login })
        if (admin) {
            auth = admin
            globalAdmin = admin
        } else if (manager) {
            auth = manager
            globalAdmin = await Admin.findById(auth.admin_id)
        } else if (user) {
            auth = user
            globalAdmin = await Admin.findById(auth.admin_id)

        } else {
            return res.status(400).json({ message: "Login va parol noto'g'ri" });
        }
        const isMatch = await bcrypt.compare(password, auth.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Parol noto'g'ri" });
        }
        const payload = {
            admin_id: admin ? auth._id : auth.admin_id,
            user_id: auth._id,
            role: admin ? 'admin' : manager ? 'manager' : 'user'
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        res.status(200).json({
            token, message: 'Avtorizatsiyadan o\'tdingiz', user_id: auth._id, role: admin ? 'admin' : manager ? 'manager' : 'user', name: auth.name, admin_name: globalAdmin.name
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}