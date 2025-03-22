const Service = require('../models/serviceModel');

exports.getService = async (req, res) => {
    try {
        const { admin_id } = req.user
        const services = await Service.find({ admin_id });
        res.json(services);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.createService = async (req, res) => {
    try {
        const { admin_id } = req.user
        const { service_name } = req.body
        const newService = new Service({ service_name, admin_id });
        await newService.save();
        res.json(newService);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.updateService = async (req, res) => {
    try {
        const { service_name } = req.body;
        const { id } = req.params;
        const updatedService = await Service.findByIdAndUpdate(id, { service_name }, { new: true });
        res.json(updatedService);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await Service.findByIdAndDelete(id);
        res.json({ message: "Servis o'chirildi" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}