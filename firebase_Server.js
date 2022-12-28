import express, { response } from "express";
// import BodyParser from "body-parser";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  getDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import path from "path";
import { db } from "./firebaseconfig.js";
import compression from "compression";
import saltedMd5 from "salted-md5";
import multer from "multer";
import * as dotenv from "dotenv";
import { getStorage, ref, uploadBytes } from "firebase/storage";

dotenv.config();
// require("dotenv").config();
// var compression = require("compression");

var app = express();

// var saltedMd5 = require("salted-md5");
// var path = require("path");
// var multer = require("multer");
var upload = multer({ storage: multer.memoryStorage() });

app.use(express.urlencoded());
app.use(express.json());
// app.set("views", path.join(__dirname, "static", "views"));
// app.set("view engine", "ejs");
app.use(compression());
// app.use(upload.single("file"));
// app.use("/public", express.static(path.join(__dirname, "static", "public")));

var PORT = 8000;
// Create a root reference
const storage = getStorage();

app.post("/upload", upload.single("file"), async (req, res) => {
  //   const colRef = await collection(db, "books");
  //   console.log(req.body);
  const file = req.file;
  console.log(file);
  async function uploadImage() {
    const storageRef = ref(storage, "users/");
    uploadBytes(storageRef, file.buffer);
  }
  await uploadImage();

  //   const url = encodeURIComponent(uploadImage());
  //   addDoc(colRef, {
  //     title: req.body.title,
  //     author: req.body.author,
  //     createdAt: serverTimestamp(),
  //     file: req.body.url,
  //   });
  //   console.log(url);
  res.send(url);
});

// ROOT endpoint

app.get("/", (req, res) => {
  return res.status(200).send("Hello World");
});

app.get("/api/read", async (req, res) => {
  try {
    const colRef = await collection(db, "books");
    // console.log("ITs working");
    let books = [];
    const querySnapshot = await getDocs(collection(db, "books"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      books.push({ ...doc.data(), id: doc.id });
    });

    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    return res.status(200).send("Data Failed");
  }
});

app.get("/api/read/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let book = [];
    const docRef = doc(db, "books", req.params.id);
    const docSnap = await getDoc(docRef);

    return res.status(200).send(docSnap.data());
  } catch (error) {
    console.log(error);
    return res.status(200).send("Data Failed to get");
  }
});

app.post("/api/add", async (req, res) => {
  try {
    const colRef = await collection(db, "books");
    console.log(req.body);

    addDoc(colRef, {
      title: req.body.title,
      author: req.body.author,
      createdAt: serverTimestamp(),
    });
    console.log(req.body);
    return res.status(200).send({ Status: "Sucess", msg: "Data Saved" });
  } catch (error) {
    console.log(error);
    return res.status(200).send("Data Failed to insert ");
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const docRef = doc(db, "books", req.params.id);
    deleteDoc(docRef);
    return res.status(200).send({ Status: "Sucess", msg: "data deleted" });
  } catch (error) {
    console.log(error);
    return res.status(200).send("Data Failed to delete ");
  }
});

app.put("/api/update/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const docRef = doc(db, "books", req.params.id);
    updateDoc(docRef, {
      title: req.body.title,
      author: req.body.author,
    });
    return res.status(200).send("Data is updated");
  } catch (error) {
    console.log(error);
    return res.status(200).send("Data is not updated");
  }
});
app.listen(PORT, () =>
  console.log(`Server is running on port: http://localhost:${PORT}`)
);
