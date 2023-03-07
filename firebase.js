const firebase = require("firebase-admin");
const credsUnStruct = process.env.FIREBASE_CREDS;
const creds = JSON.parse(credsUnStruct);

firebase.initializeApp({
    credential: firebase.credential.cert(creds),
    databaseURL: 'https://fir-gptletters.firebaseio.com',
})

console.log(creds);
module.exports = firebase;