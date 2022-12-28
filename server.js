//create express api
import express from "express";
import sqlite3 from "sqlite3";
import BodyParser from "body-parser";

const DBSOURCE = "./users.sqlite";
let db = new sqlite3.Database(DBSOURCE);
var app = express();

// Server port
var PORT = 5000;
// Start server

app.listen(PORT, () =>
  console.log(`Server is running on port: http://localhost:${PORT}`)
);
// ROOT endpoint

app.get("/", (req, res, next) => {
  res.json({ message: "OK" });
});
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

// get all user
app.get("/api/users/", (req, res, next) => {
  var sql = "select * from users";

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// add new user
app.post("/api/users/", (req, res, next) => {
  var data = {
    Name: req.body.Name,
    Roll_No: req.body.Roll_No,
  };
  console.log(req.body);
  let insert = "INSERT INTO users (Name, Roll_No) VALUES (?,?)";
  var params = [data.Name, data.Roll_No];
  db.run(insert, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: " success",
      data: data,
      ID: this.lastID,
    });
  });
});

// get one user
app.get("/api/users/:id", (req, res) => {
  var sql = "select * from users where ID = ?";

  db.all(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

//update data of the user
app.put("/api/user/:id", (req, res) => {
  let sql =
    "UPDATE users set Name = COALESCE(?, Name),Roll_No = COALESCE(?, Roll_No) WHERE ID = ? ";
  db.run(sql, [req.body.Name, req.body.Roll_No, req.params.id]);
  sql = "select * from users where ID = ?";
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

//delete user
app.delete("/api/user/:id", (req, res, next) => {
  db.run(
    "DELETE FROM users WHERE id = ?",
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

//Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
