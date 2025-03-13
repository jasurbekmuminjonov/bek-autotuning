const User = require('../models/userModel');
const Project = require('../models/projectModel');
exports.getUsers = async (req, res) => {
    try {
        const { admin_id } = req.user
        const users = await User.find({ admin_id });
        res.json(users);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.getUser = async (req, res) => {
    try {
        const { user_id } = req.user
        const user = await User.findById(user_id);
        res.json(user);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.getProjectsByUser = async (req, res) => {
    try {
        const { user_id, admin_id } = req.user;
        const projects = await Project.find({
            admin_id,
            services_providing: {
                $elemMatch: { user_id }
            }
        });
        res.status(200).json({ success: true, projects });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Serverda xatolik" });
    }
};
exports.getProjectsForApprove = async (req, res) => {
    try {
        const { user_id, admin_id } = req.user;
        const projects = await Project.find({
            admin_id,
            services_providing: {
                $elemMatch: { user_id }
            }
        });
        const filteredProjects = projects.filter(project => {
            return project.services_providing.some((service, index, arr) => {
                if (service.user_id.toString() === user_id.toString()) {
                    if (service.index === 1) {
                        return false;
                    }
                    const prevService = arr.find(s => s.index === service.index - 1);
                    return prevService && prevService.status === 'finished';
                }
                return false;
            });
        });
        res.status(200).json(filteredProjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
};
// exports.getProjectsForStart = async (req, res) => {
//     try {
//         const { user_id, admin_id } = req.user;

//         const projects = await Project.find({
//             admin_id,
//             services_providing: {
//                 $elemMatch: {
//                     user_id,
//                     status: 'pending'
//                 }
//             }
//         });

//         res.status(200).json({ success: true, projects });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi" });
//     }
// };


// exports.startProject = async (req, res) => {
//     try {
//         const { project_id } = req.params
//         const { user_id, admin_id } = req.user;
//         const project = await Project.findOne({
//             admin_id,
//             _id: project_id,
//             services_providing: {
//                 $elemMatch: {
//                     user_id,
//                     status: 'pending'
//                 }
//             }
//         });
//         if (!project) {
//             return res.status(404).json({ message: "Mashina topilmadi" });
//         }
//         project.services_providing.forEach(service => {
//             if (service.user_id.toString() === user_id.toString()) {
//                 service.status = 'inprogress';
//                 service.started_time = new Date().toISOString();
//             }
//         });
//         await project.save();
//         res.json({ message: "Mashina servisi boshlandi" });

//     } catch (err) {
//         console.log(err.message)
//         return res.status(500).json({ message: "Serverda xatolik" });
//     }
// }


exports.finishProject = async (req, res) => {
    try {
        const { project_id } = req.params
        const { user_id, admin_id } = req.user;
        const project = await Project.findOne({
            admin_id,
            _id: project_id,
            services_providing: {
                $elemMatch: {
                    user_id,
                    status: 'inprogress'
                }
            }
        });
        if (!project) {
            return res.status(404).json({ message: "Mashina topilmadi" });
        }
        project.services_providing.forEach(service => {
            if (service.user_id.toString() === user_id.toString()) {
                service.status = 'finished';
                service.ended_time = new Date().toISOString();
            }
        });
        await project.save();
        res.json({ message: "Mashina servisi tugallandi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.approveProject = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { user_id } = req.user;

        const project = await Project.findOne({
            _id: project_id,
            "services_providing.user_id": user_id
        });

        if (!project) {
            return res.status(404).json({ message: "Loyiha topilmadi" });
        }


        const user_service = project.services_providing.find(service => service.user_id.toString() === user_id.toString());
        const prev_service = project.services_providing.find(service => service.index === user_service.index - 1);
        if (!prev_service) {
            return res.status(400).json({ message: "Qabul qilish uchun servis topilmadi" });
        }
        if (prev_service.status !== 'finished' || prev_service.status !== 'rejected') {
            return res.status(400).json({ message: "Qabul qilish uchun servisning holati 'tugatilgan' yoki 'rad etilgan' bo'lishi kerak" });
        }
        prev_service.status = 'approved';
        prev_service.approved_time = new Date().toISOString();
        user_service.status = 'inprogress'
        user_service.started_time = new Date().toISOString();

        await project.save();
        res.json({ message: "Loyiha muvaffaqiyatli qabul qilindi va sizning servisingiz 'jarayonda' holatiga o'tdi" });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
};


exports.rejectProject = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { user_id } = req.user;

        const project = await Project.findOne({
            _id: project_id,
            "services_providing.user_id": user_id
        });

        if (!project) {
            return res.status(404).json({ message: "Loyiha topilmadi" });
        }


        const user_service = project.services_providing.find(service => service.user_id.toString() === user_id.toString());
        const prev_service = project.services_providing.find(service => service.index === user_service.index - 1);
        if (!prev_service) {
            return res.status(400).json({ message: "Rad etish uchun servis topilmadi" });
        }
        if (prev_service.status !== 'finished' || prev_service.status === 'rejected') {
            return res.status(400).json({ message: "Rad etish uchun servisning holati 'tugatilgan' bo'lishi kerak" });
        }
        prev_service.status = 'rejected';
        prev_service.rejected_time = new Date().toISOString();


        await project.save();
        res.json({ message: "Loyiha muvaffaqiyatli rad etildi" });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
};
