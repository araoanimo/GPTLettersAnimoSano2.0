/*
    auth-middleware.js
*/

const firebase = require("./firebase");

const validateToken = (req, res) => {
  const headerToken = req;
  if (!headerToken) {
    res.send({isToken: false});
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    res.send({isToken: false});
  }
  const token = headerToken.split(" ")[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => res.send({isToken: true}))
    .catch((err) => console.log(err))
    }
    // .catch(() => {
    //   console.log("Token not valid");
    //   //response.status(403).send({ message: "Could not authorize" });
    //   //throw new Error("Could not authorize");
    
    // });


function authMiddleware(request, response, next) {
  const headerToken = request.headers.authorization;
  if (!headerToken) {
    return response.send({ message: "No token provided" }).status(401);
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    response.send({ message: "Invalid token" }).status(401);
  }

  const token = headerToken.split(" ")[1];
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => next())
    .catch(() => {
      response.send(new ArrayBuffer(0));
      //response.status(403).send({ message: "Could not authorize" });
      //throw new Error("Could not authorize");
      console.log("Could not authorize");
    
    });
}

module.exports = {authMiddleware, validateToken};