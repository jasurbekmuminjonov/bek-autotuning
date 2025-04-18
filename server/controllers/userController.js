const User = require("../models/userModel");
const Project = require("../models/projectModel");
const moment = require('moment');
const bcrypt = require("bcryptjs");
exports.getUsers = async (req, res) => {
  try {
    const { admin_id } = req.user;
    const users = await User.find({ admin_id });
    res.json(users);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};
exports.getUser = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await User.findById(user_id);
    res.json(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};
exports.getBalance = async (req, res) => {
  try {
    const { user_id } = req.query;
    const { admin_id } = req.user;
    const projects = await Project.find({
      admin_id,
      services_providing: {
        $elemMatch: {
          user_id,
          status: "approved",
        },
      },
    });
    const user = await User.findById(user_id);
    const totalPaySum = projects.reduce(
      (acc, item) => acc + item.user_salary_amount.amount,
      0
    );
    const totalPaidSum = user.paychecks.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    return res.status(200).json({ balance: totalPaySum - totalPaidSum });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};

exports.getApprovedProjects = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { admin_id } = req.user;

    const projects = await Project.find({
      admin_id,
      $or: [
        {
          services_providing: {
            $elemMatch: {
              user_id,
              status: "approved",
            },
          },
        },
        {
          status: "finished",
          services_providing: {
            $elemMatch: { user_id },
          },
        },
      ],
    });

    res.status(200).json(projects);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};

exports.getProjectsByUser = async (req, res) => {
  try {
    const { user_id, admin_id } = req.user;
    const projects = await Project.find({
      admin_id,
      services_providing: {
        $elemMatch: { user_id },
      },
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
        $elemMatch: { user_id },
      },
    });
    const filteredProjects = projects.filter((project) => {
      return project.services_providing.some((service, index, arr) => {
        if (service.user_id.toString() === user_id.toString()) {
          if (service.index === 1) {
            return false;
          }
          const prevService = arr.find((s) => s.index === service.index - 1);
          return (
            (prevService && prevService.status === "finished") ||
            prevService.status === "rejected"
          );
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
exports.getProjectsForFinish = async (req, res) => {
  try {
    const { user_id, admin_id } = req.user;

    const projects = await Project.find({
      admin_id,
      services_providing: {
        $elemMatch: {
          user_id,
          status: "inprogress",
        },
      },
    });

    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ success: false, message: "Serverda xatolik yuz berdi" });
  }
};
exports.getProjectsForStart = async (req, res) => {
  try {
    const { user_id, admin_id } = req.user;

    const projects = await Project.find({
      admin_id,
      services_providing: {
        $elemMatch: {
          user_id,
          status: "pending",
          index: 1,
        },
      },
    });

    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ success: false, message: "Serverda xatolik yuz berdi" });
  }
};
exports.startProject = async (req, res) => {
  try {
    const { project_id, service_id } = req.params;
    const { user_id } = req.user;
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(404).json({ message: "Mashina topilmadi" });
    }
    project.services_providing.forEach((service) => {
      if (
        service.user_id.toString() === user_id.toString() &&
        service._id.toString() === service_id
      ) {
        service.status = "inprogress";
        service.started_time = new Date(new Date().getTime() + 18000000).toISOString();
      }
    });
    project.createdAt = new Date(new Date(new Date().getTime() + 18000000).getTime() + 18000000).toISOString();
    await project.save();
    res.json({ message: "Mashina servisi jarayonda" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};
exports.finishService = async (req, res) => {
  try {
    const { project_id, service_id } = req.params;
    const { user_id, admin_id } = req.user;
    const end_time = new Date(new Date().getTime() + 18000000).toISOString()
    const user = await User.findById(user_id);
    let lateDiff;
    const project = await Project.findOne({
      admin_id,
      _id: project_id,
      services_providing: {
        $elemMatch: {
          user_id,
        },
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Mashina topilmadi" });
    }
    project.services_providing.forEach((service) => {
      if (
        service.user_id.toString() === user_id.toString() &&
        service._id.toString() === service_id
      ) {
        service.status = "finished";
        service.ended_time = Date.now();
        lateDiff = moment(end_time).diff(moment(service.end_time), "days")
      }
      if (lateDiff > 0) {

        if (service._id.toString() !== service_id) {
          service.start_time = moment(service.start_time).add(lateDiff, 'days').toISOString()
          service.end_time = moment(service.end_time).add(lateDiff, 'days').toISOString()
        }
      }
    });
    if (lateDiff > 0) {

      project.leave_date = moment(project.leave_date).add(lateDiff, 'days').toISOString()
      user.service_delays.push({
        delay_days: lateDiff,
        service_id,
        project_id,
        delay_date: project.services_providing.find(s => s._id.toString() === service_id).started_time
      })
    }

    await project.save();
    await user.save();
    res.json({ message: "Mashina servisi tugallandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};
exports.approveService = async (req, res) => {
  try {
    const { project_id, approving_service, starting_service } = req.query;
    const { user_id } = req.user;
    const project = await Project.findOne({
      _id: project_id,
      "services_providing.user_id": user_id,
    });

    if (!project) {
      return res.status(404).json({ message: "Loyiha topilmadi" });
    }


    const user_service = project.services_providing.find(
      (service) => service._id.toString() === starting_service
    );
    const prev_service = project.services_providing.find(
      (service) => service._id.toString() === approving_service
    );

    if (!prev_service) {
      return res
        .status(400)
        .json({ message: "Qabul qilish uchun servis topilmadi" });
    }
    if (
      prev_service.status !== "finished" &&
      prev_service.status !== "rejected"
    ) {
      return res
        .status(400)
        .json({
          message:
            "Qabul qilish uchun servisning holati 'tugatilgan' yoki 'rad etilgan' bo'lishi kerak",
        });
    }

    prev_service.status = "approved";
    prev_service.approved_time = new Date(new Date().getTime() + 18000000).toISOString();
    const user = await User.findById(prev_service.user_id);
    user.balance += prev_service.user_salary_amount.amount;
    user_service.status = "inprogress";
    user_service.started_time = new Date(new Date().getTime() + 18000000).toISOString();
    await project.save();
    await user.save();
    res.json({
      message:
        "Servis muvaffaqiyatli qabul qilindi va sizning servisingiz 'jarayonda' holatiga o'tdi",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};
exports.rejectService = async (req, res) => {
  try {
    const { project_id, rejecting_service } = req.query;
    const { user_id } = req.user;

    const project = await Project.findOne({
      _id: project_id,
      "services_providing.user_id": user_id,
    });

    if (!project) {
      return res.status(404).json({ message: "Loyiha topilmadi" });
    }

    // const user_service = project.services_providing.find(service => service._id.toString() === starting_service);
    const prev_service = project.services_providing.find(
      (service) => service._id.toString() === rejecting_service
    );
    if (!prev_service) {
      return res
        .status(400)
        .json({ message: "Rad etish uchun servis topilmadi" });
    }
    if (
      prev_service.status !== "finished" ||
      prev_service.status === "rejected"
    ) {
      return res
        .status(400)
        .json({
          message:
            "Rad etish uchun servisning holati 'tugatilgan' bo'lishi kerak",
        });
    }
    prev_service.status = "rejected";
    prev_service.rejected_time = new Date(new Date().getTime() + 18000000).toISOString();

    await project.save();
    res.json({ message: "Loyiha muvaffaqiyatli rad etildi" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};
exports.editUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { password } = req.body;

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    } else {
      delete req.body.password;
    }
    await User.findByIdAndUpdate(user_id, req.body, { new: true });
    res.json({ message: "Foydalanuvchi muvaffaqiyatli tahrirlandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};
exports.payUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    await User.findByIdAndUpdate(user_id, {
      $push: {
        paychecks: {
          amount: req.body.amount,
          paycheck_date: req.body.paycheck_date,
        },
      },
    });
    res.json({ message: "Maosh berildi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};
exports.updateSalary = async (req, res) => {
  try {
    const { user_id, salary_id } = req.query;
    await User.findOneAndUpdate(
      { _id: user_id, "paychecks._id": salary_id },
      { $set: { "paychecks.$": req.body } }
    );
    return res.status(200).json({ message: "Maosh tahrirlandi" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
};
exports.deleteSalary = async (req, res) => {
  try {
    const { user_id, salary_id } = req.query;

    await User.findOneAndUpdate(
      { _id: user_id },
      { $pull: { paychecks: { _id: salary_id } } }
    );

    res.status(200).json({ message: "Maosh o'chirildi" });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({ message: "Ichki server xatosi" });
  }
};
exports.setWeekend = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { date } = req.body;
    await User.findByIdAndUpdate(user_id, { $push: { weekends: date } })

    return res.json({ message: "Dam olish kuni belgilandi" })

  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}
exports.removeWeekend = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { date } = req.body;
    await User.findByIdAndUpdate(user_id, { $pull: { weekends: date } })
    return res.json({ message: "Dam olish kuni o'chirildi" })

  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}

exports.pauseUser = async (req, res) => {
  try {
    const { pause_start, scheduled_time } = req.body
    const { user_id } = req.params
    const user = await User.findById(user_id)
    user.pause_log.push({
      pause_start,
      scheduled_time,
      end_time: null,
      delay_minutes: 0
    })
    await user.save()
    return res.json({ message: "Pauza" })
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}

exports.resumeUser = async (req, res) => {
  try {
    const { user_id, pause_id } = req.params;
    const { pause_end } = req.body;

    const user = await User.findById(user_id);
    const formattedDate = moment().format("DD.MM.YYYY");
    const pause = user.pause_log.id(pause_id);

    const currentDate = moment().format("YYYY-MM-DD");
    const pauseEndTime = moment(`${currentDate} ${pause_end}`, "YYYY-MM-DD HH:mm");
    const pauseScheduledTime = moment(`${currentDate} ${pause.scheduled_time}`, "YYYY-MM-DD HH:mm");

    const diff = pauseEndTime.diff(pauseScheduledTime, 'minutes');
    pause.pause_end = pause_end;
    pause.delay_minutes = diff;

    if (diff > 10) {
      const currentDelay = user.delays.find(d => moment(d).format("DD.MM.YYYY") === formattedDate)
      if (currentDelay) {
        currentDelay.delay_minutes += diff;
      } else {
        user.delays.push({
          delay_minutes: diff,
          delay_date: new Date(new Date().getTime() + 18000000).toISOString(),
        });
      }
    }

    await user.save();

    return res.json({ message: "Pauza to'xtatildi" });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Serverda xatolik" });
  }
}
