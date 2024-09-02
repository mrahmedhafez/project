const express = require('express');
const userController = require('../controllers/userControllers');
const { userValidatorRules, validate } = require('../middlewares/validator');
const isLoggedIn = require('../middlewares/auth');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({message: "Hello World!"});
})

router.post("/account/signup",userValidatorRules(), validate, userController.register);
router.post("/account/login", userController.login);
router.get("/account/me", isLoggedIn, userController.me);
router.get("/account/profile", isLoggedIn, userController.getProfile);
router.put("/account/update-profile", isLoggedIn, userController.updateProfile);
router.delete("/account/delete-profile", isLoggedIn, userController.deleteProfile);

router.get("/doctors", doctorController.index);


module.exports = router;