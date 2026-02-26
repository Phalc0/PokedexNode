// V1
// 
//  const jwt = require("jsonwebtoken");
// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
//     const userId = decodedToken.userId;
//     req.auth = {
//       userId: userId,
//       role: decodedToken.role
//     };
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token", error: error.message });
//   }
// };


// V2 avec le cookie 

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get the token from header Authorization or the cookie
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    // Verify the cookie
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    // stock user info into req
    req.auth = {
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};