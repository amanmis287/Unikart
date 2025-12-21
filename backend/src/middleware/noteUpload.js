import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/notes",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|ppt|pptx/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.test(ext)) cb(null, true);
  else cb(new Error("Invalid file type"), false);
};

export default multer({ storage, fileFilter });
