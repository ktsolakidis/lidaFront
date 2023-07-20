const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const ejs = require("ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const agent = new https.Agent({ rejectUnauthorized: false });

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.set("view engine", "ejs");

let currentStudent;
let allStudents;
let validation;

//RENDER THE LOGIN PAGE
app.get("/", (req, res) => {
  const htmlFilePath = path.join(__dirname, "views", "intro");
  res.render(htmlFilePath, { validation });
});

app.get("/logout", (req, res) => {
  const htmlFilePath = path.join(__dirname, "views", "intro");
  res.render(htmlFilePath, { validation });
});

//AUTHENTICATE USER AND LOGIN
app.post("/authenticate", async (req, res) => {
  //console.log(req);
  let htmlFilePath;

  try {
    const allStudents = await axios.get(
      "http://localhost:5000/students/all",
      {
        httpsAgent: agent,
      }
    );

    let found = false;
    for (let k = 0; k < allStudents.data.length; k++) {
      if (
        allStudents.data[k].username == req.body.username &&
        allStudents.data[k].password == req.body.password
      ) {
        htmlFilePath = path.join(__dirname, "views", "student");
        currentStudent = {
          id: allStudents.data[k].id,
          name:
            allStudents.data[k].first_name +
            " " +
            allStudents.data[k].last_name,
        };

        res.render(htmlFilePath, { currentStudent });
        found = true;
        break;
      }
    }
    if (!found) {
      htmlFilePath = path.join(__dirname, "views", "intro");
      validation = {
        valid: "false",
      };
      res.render(htmlFilePath, { validation });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/valuation", (req, res) => {
  const htmlFilePath = path.join(__dirname, "views", "valuation");
  let classInfo = {
    id: req.body.classId,
    name: req.body.className,
  };

  res.render(htmlFilePath, { currentStudent, classInfo });
});

// app.post("/submitValuation", async (req, res) => {
//   try {
//     const response = await axios.post(
//       "https://web-production-42d1e.up.railway.app/students/valuations/new",
//       req.body
//     );
//     res.status(response.status).json(response.data);
//   } catch (error) {
//     // Handle error
//     console.error(error);

//   }
// });

app.post("/submitValuation", async (req, res) => {

    // let toSend = JSON.stringify({
    //   student_id: req.body.studentId,
    //   class_id: req.body.classId,
    //   theory: req.body.theory,
    //   solved_excercises: req.body.solvedExercises,
    //   methodology: req.body.methodology,
    //   pronunciation: req.body.pronunciation,
    //   data_translation: req.body.dataTranslation,
    //   general_difficulty: req.body.generalDifficulty,
    //   other_difficulty: req.body.otherDifficulty,
    //   metadotikotita: req.body.metadotikotita,
    //   preparation: req.body.preparation,
    // });

    // console.log(toSend);

    // let config = {
    //   method: "post",
    //   maxBodyLength: Infinity,
    //   url: "http://localhost:5000/valuations/new",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   data: toSend,
    //   httpsAgent: agent,
    // };

    // const response = await axios(config);
    // // console.log(JSON.stringify(response.data));

    // // console.log(currentStudent);

    htmlFilePath = path.join(__dirname, "views", "student");
    res.render(htmlFilePath, { currentStudent });

    //res.status(response.status).json(data);
  
});

app.listen(3000, () => {
  console.log(`Server started at http://localhost:${3000}`);
});
