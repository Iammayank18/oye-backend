const jwt = require("jsonwebtoken");

const User = require("../userSchema/registerUser");

const authenticated = async (req, res, next) => {
  try {
    // get logtoken from cookies
    const token = req.body.logtoken;

    console.log("token", token);
    const verifytoken = jwt.verify(token, process.env.JWT_KEY);
    const rootUser = await User.findOne({
      _id: verifytoken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (e) {
    res.status(500).json({
      msg: "Error in authentication",
    });
  }
};
module.exports = authenticated;
