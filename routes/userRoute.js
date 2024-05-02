const express = require("express");
const router = express();

router.set("view engine", "ejs");
router.set("views", "./views/users");

const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../public/userImages"));
  },
  filename: (req, file, callback) => {
    const name = Date.now() + "-" + file.originalname;
    callback(null, name);
  },
});

const upload = multer({ storage: storage });

const userController = require("../controllers/userController.js");

router.get("/register", userController.loadRegister);
router.post("/register", upload.single("image"), userController.insertUser);
router.get("/varifymail", userController.varifymail);
router.get("/", userController.loadlogin);
router.get("/login", userController.loadlogin);
router.post("/login", userController.varifylogin);
router.get("/home", userController.loadhome);

module.exports = router;
