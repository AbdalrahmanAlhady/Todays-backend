import parseOData from "odata-sequelize";
import Media from "../../DBs/models/media.model.js";
import User from "../../DBs/models/user.model.js";
import { Op, Sequelize, where } from "sequelize";

export const storeMedia = async (req, res) => {
  try {
    const mediaObj = req.body;
    if (mediaObj.for === "profile") {
      let oldProfileImage = await Media.update(
        { current: false },
        {
          where: { for: "profile", current: true, owner_id: mediaObj.owner_id },
        }
      );
    } else if (mediaObj.for === "cover") {
      let oldProfileCover = await Media.update(
        { current: false },
        { where: { for: "cover", current: true, owner_id: mediaObj.owner_id } }
      );
    }
    let media = await Media.create(mediaObj);
    res.status(201).json({ media });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMedia = async (req, res) => {
  try {
    const { limit, page, filter, fields, orderby, type } = req.query;

    let queryOptions = {
      where: type
        ? { owner_id: req.params.user_id, for: type }
        : { owner_id: req.params.user_id, current: {[Op.or]:[false,null]} },
    };
    if (limit && page) {
      queryOptions.offset = (page - 1) * limit;
      queryOptions.limit = limit * 1;
    }
    if (fields) {
      queryOptions.attributes = [...fields.split(",")];
    }
    if (orderby) {
      queryOptions.order = [orderby.split(",")[0], orderby.split(",")[1]];
    }
    let media = await Media.findAndCountAll(queryOptions);
    res.status(200).json({ media });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.destroy({ where: { id: req.params.id } });
    if (media) {
      res.status(200).json({ message: "deleted" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
