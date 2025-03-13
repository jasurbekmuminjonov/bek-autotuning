const Project = require('../models/projectModel');

exports.getProject = async (req, res) => {
    try {
        const { admin_id } = req.user
        const projects = await Project.find({ admin_id });
        res.json(projects);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.createProject = async (req, res) => {
    try {
        const { admin_id } = req.user
        req.body.admin_id = admin_id
        const project = new Project(req.body);
        await project.save();
        res.json(project);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: "Mashina tahrirlandi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.json({ message: "Mashina o'chirildi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

