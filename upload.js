import { https } from "firebase-functions";
import { Storage } from "@google-cloud/storage";
import UUID from "uuid-v4";
import express, { json, urlencoded } from "express";
// import { IncomingForm } from "formidable-serverless";

// import { initializeApp, credential as _credential } from "firebase-admin";
import { Firestore } from "firebase/firestore";
require(".env").config();

const app = express();
app.use(json({ limit: "50mb", extended: true }));
app.use(urlencoded({ extended: false, limit: "50mb" }));

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.PROJECT_ID,
//     privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     clientEmail: process.env.CLIENT_EMAIL,
//   }),
//   databaseURL: process.env.DATABASE_URL,
//   storageBucket: "gs://fir-upload-8156e.appspot.com",
// });

// import serviceAccount from "./admin.json";

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const userRef = Firestore().collection("users");

const storage = new Storage({
  keyFilename: "admin.json",
});

app.post("/creatUser", async (req, res) => {
  const form = new IncomingForm({ multiples: true });

  try {
    form.parse(req, async (err, fields, files) => {
      let uuid = UUID();
      var downLoadPath =
        "https://firebasestorage.googleapis.com/v0/b/fir-crud-cdf93.appspot.com";

      const profileImage = files.profileImage;

      // url of the uploaded image
      let imageUrl;

      const docID = userRef.doc().id;

      if (err) {
        return res.status(400).json({
          message: "There was an error parsing the files",
          data: {},
          error: err,
        });
      }
      const bucket = storage.bucket("gs://fir-crud-cdf93.appspot.com");

      if (profileImage.size == 0) {
        // do nothing
      } else {
        const imageResponse = await bucket.upload(profileImage.path, {
          destination: `users/${profileImage.name}`,
          resumable: true,
          metadata: {
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
        });
        // profile image url
        imageUrl =
          downLoadPath +
          encodeURIComponent(imageResponse[0].name) +
          "?alt=media&token=" +
          uuid;
      }
      // object to send to database
      const userModel = {
        id: docID,
        name: fields.name,
        email: fields.email,
        age: fields.age,
        profileImage: profileImage.size == 0 ? "" : imageUrl,
      };

      await userRef
        .doc(docID)
        .set(userModel, { merge: true })
        .then((value) => {
          // return response to users
          res.status(200).send({
            message: "user created successfully",
            data: userModel,
            error: {},
          });
        });
    });
  } catch (err) {
    res.send({
      message: "Something went wrong",
      data: {},
      error: err,
    });
  }
});

export const helloWorld = https.onRequest((request, response) => {
  // functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const api = https.onRequest(app);
