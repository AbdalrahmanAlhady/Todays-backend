import Media from "../../DBs/models/media.model.js";

export const storeMedia= async (req, res) => {
  try {
    const mediaObj = req.body;
    let media = await Media.create(mediaObj);
    res.status(201).json({ media});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.destroy({ where: { id: req.params.id } });
    res.status(200).json({ media });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};