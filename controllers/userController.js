const model = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const sendmail = async (name, email, userid) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "rdgohil2002@gmail.com",
        pass: "silfkeqrfemakdgz",
      },
    });

    const mailOption = {
      from: "rdgohil2002@gmail.com",
      to: email,
      subject: "For Varification Mail",
      html:
        "<p>Hii," +
        name +
        ', Please Click Here To <a href="http://127.0.0.1:5000/varifymail?id=' +
        userid +
        '">Varify</a> Your Mail</p>',
    };

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email Has Been Sent Successfully...", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const varifymail = async (req, res) => {
  try {
    const updateInfo = await model.updateOne(
      { _id: req.query.id },
      { $set: { varify: 1 } }
    );
    console.log(updateInfo);
    res.render("varifymail");
  } catch (error) {
    console.log(error.message);
  }
};

const securepassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegister = (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
  }
};

const insertUser = async (req, res) => {
  try {
    const spassword = await securepassword(req.body.password);
    const user = new model({
      name: req.body.name,
      email: req.body.email,
      password: spassword, //req.body.password
      mobile: req.body.mobile,
      image: req.file.filename,
      admin: 0,
    });
    const userData = await user.save();
    if (userData) {
      sendmail(req.body.name, req.body.email, userData._id);
      res.render("registration", {
        message: "Registration Has Been Success, Please Varify Your Mail.",
      });
    } else {
      res.render("registration", {
        message: "Registration Has Been Failed...",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//login mate se....
const loadlogin = (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const varifylogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await model.findOne({ email: email });

    if (userData) {
      const matchpassword = await bcrypt.compare(password, userData.password);
      if (matchpassword) {
        if (userData.varify === 0) {
          res.render("login", { message: "Please Varify Your Mail" });
        } else {
          res.redirect("/home");
        }
      } else {
        res.render("login", { message: "Email and Password are Incorrect" });
      }
    } else {
      res.render("login", { message: "Email and Password are Incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadhome = (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  varifymail,
  sendmail,
  loadlogin,
  varifylogin,
  loadhome,
};
