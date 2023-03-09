/*
    auth-middleware.js
*/

const firebase = require("./firebase");

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

module.exports = authMiddleware;