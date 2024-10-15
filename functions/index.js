/* eslint-disable no-undef */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // Import and use CORS middleware

admin.initializeApp();

exports.updateUser = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Add CORS handling here
    try {
      const { uid, email, password } = req.body;

      // Update user's email and password in Firebase Authentication
      await admin.auth().updateUser(uid, {
        email: email,
        password: password,
      });

      return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
});
