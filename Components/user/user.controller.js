import User from "../../DBs/models/user.model.js";
import { nanoid } from "nanoid";
import { sendEmail } from "../../service/mail.js";
import Media from "../../DBs/models/media.model.js";
import { Op } from "sequelize";

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Media,
          as: "media",
          where: {
            [Op.and]: [
              { current: true },
              { owner_id: req.params.id },
              {
                [Op.or]: [{ for: "profile" }, { for: "cover" }],
              },
            ],
          },
          attributes: ["url", "for"],
          required: false,
        },
      ],
    });
    if (user) {
      res.status(201).json({ user });
    } else {
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    let { email } = req.body;
    let OTP = nanoid();
    if (email) {
      sendEmail(email, `your verification code is : ${OTP} `, "OTP code");
    }
    const updateResult = await User.update(
      email ? { ...req.body, OTP } : req.body,
      {
        where: { id: req.params.id },
      }
    );
    const updatedUser = await User.findByPk(req.params.id, {
      include: [
        {
          model: Media,
          as: "media",
          where: {
            [Op.and]: [
              { current: true },
              { owner_id: req.params.id },
              {
                [Op.or]: [{ for: "profile" }, { for: "cover" }],
              },
            ],
          },
          attributes: ["url", "for"],
          required: false,
        },
      ],
    });
    if (updateResult) {
      res.status(200).json({ user: updatedUser });
    } else {
      res.status(404).json({ message: "user not updated" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};
