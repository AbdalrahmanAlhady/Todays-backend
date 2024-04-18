import Media from "../../DBs/models/media.model.js";

export const storeMediaUrls = async (req, res) => {
  try {
    const imgObj = req.body;
    let img = new Media(imgObj);
    const savedImg = await img.save();
    res.status(201).json({ media: savedImg });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
