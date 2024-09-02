const bcrypt = require('bcryptjs');
const models = require('../models');
const jsonwebtoken = require('jsonwebtoken');

exports.register = async (req, res) => {
  const {name, email, password, userType, location, specialization, address, workingHours, phone} = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      name,
      email,
      password: hashPassword,
      userType,
      latitude: location.latitude,
      longitude: location.longitude,
    });
    if(userType === 'doctor'){
      const profile = await models.Profile.create({
        userId: user.id,
        specialization,
        address,
        workingHours,
        phone,
      });
    };
    res.status(200).json({message: "Account created successfully!"});
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.login = async (req, res) => {
  const {email, password} = req.body;
  try{
    const user = await models.User.findOne({where: {email}});
    if (!user) {
      return res.status(401).json({
        message: "Email or Password is incorrect",
      });
    };

    const authSuccess = await bcrypt.compare(password,user.password);

    if(!authSuccess){
      return res.status(401).json({
        message: "Email or Password is incorrect",
      });
    };

    const token = jsonwebtoken.sign({id: user.id, name: user.name, email: user.email}, process.env.JWT_SECRET);

    res.status(200).json({accessToken: token});
  } catch (e) {

  };
};

exports.me = (req,res) => {
  const user = req.currentUser;
  res.json(user);
};

exports.getProfile = async (req, res) => {
  try {
    const result = await models.User.findOne({
      where: {id: req.currentUser.id},
      include: [{model: models.Profile, as: "profile"}],
      attributes: {exclude: ["password"]},
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  };
};

exports.updateProfile = async (req, res) => {
  const {name, password, userType, speialization, address, location, workingHours, phone } = req.body;
  try {
    const hashPassword = await bcrybt.hash(password, 10)
    const user = await models.User.update({
      name,
      password: hashPassword,
      userType,
      latitude: location.latitude,
      longitude: location.longitude
  }, {where : {
    id: req.currentUser.id
  }})
  if(userType == "doctor") {
    const profile = await models.Profile.update({
      speialization,
      address,
      workingHours,
      phone
    }, {where: {userId: req.currentUser.id}})  
  }
  res.status(200).json({
    message: "Data updated successfully"
  })
  } catch (e) {
    res.status(500).json(e);
  }
}

exports.deleteProfile = async(req, res) => {
  try {
    const user = await models.User.destroy({
      where: { id: req.currentUser.id},
    });
    res.status(200).json({
      message: "Account deleted successfully"
    });
  } catch (e) {
    res.status(500).json(e);
  }
};
