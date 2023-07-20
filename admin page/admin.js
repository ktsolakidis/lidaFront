// Get the navbar buttons
const buttons = document.querySelectorAll(".navbar ul li a");

// Get all the sections
const sections = document.querySelectorAll(".container");

// Hide all sections except the first one
for (let i = 1; i < sections.length; i++) {
  sections[i].style.display = "none";
}

// Add click event listener to each button
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    // Hide all sections
    sections.forEach((section) => {
      section.style.display = "none";
    });

    // Display the corresponding section based on button index
    sections[index].style.display = "block";
  });
});

const latestValuationsContainer = document.getElementById(
  "recent---valuations"
);
const studentsList = document.getElementById("students--list");
const classesList = document.getElementById("classes--list");
const studentForm = document.querySelector("#new--student");
const classForm = document.querySelector("#new--class");
const listingsForm = document.querySelector("#new--listing");
const dropdownStudents = document.getElementById("dropdown--students");
const dropdownClasses = document.getElementById("dropdown--classes");
const valuationsContainer = document.getElementById("valuations--container");
const classesStatisticsDropDown = document.getElementById(
  "classes--statistics"
);
const statisticsContainer = document.getElementById("statistics--container");
const filterClasses = document.getElementById("dropdown--classes--valuations");
const filterStudents = document.getElementById(
  "dropdown--students--valuations"
);

const searchValuationsButton = document.getElementById("search--valuations");

let classesData, listingsData, studentsData, valuationsData;
const fetchData = async () => {
  try {
    const classesPromise = fetch("http://localhost:5000/classes/all");
    const listingsPromise = fetch("http://localhost:5000/listings/all");

    let valuationsPromise = await fetch("http://localhost:5000/valuations/all");

    let studentsPromise = await fetch("http://localhost:5000/students/all");

    // Wait for all promises to resolve
    const [
      classesResponse,
      listingsResponse,
      valuationsResponse,
      studentsResponse,
    ] = await Promise.all([
      classesPromise,
      listingsPromise,
      valuationsPromise,
      studentsPromise,
    ]);

    // Convert response to JSON
    classesData = await classesResponse.json();
    listingsData = await listingsResponse.json();
    valuationsData = await valuationsResponse.json();
    studentsData = await studentsResponse.json();

    console.log(studentsData);
    console.log(valuationsData);
    console.log(classesData);

    studentsData.forEach((student) => {
      dropdownStudents.insertAdjacentHTML(
        "beforeend",
        `
      <option id="${student.id}" value="${student.first_name} ${student.last_name}">${student.first_name} ${student.last_name}</option>
      `
      );
    });

    studentsData.forEach((student) => {
      filterStudents.insertAdjacentHTML(
        "beforeend",
        `
      <option id="${student.id}" value="${student.first_name} ${student.last_name}">${student.first_name} ${student.last_name}</option>
      `
      );
    });

    classesData.forEach((cl) => {
      dropdownClasses.insertAdjacentHTML(
        "beforeend",
        `
      <option id="${cl.id}" value="${cl.name}">${cl.name}</option>
      `
      );
    });

    classesData.forEach((cl) => {
      filterClasses.insertAdjacentHTML(
        "beforeend",
        `
      <option id="${cl.id}" value="${cl.name}">${cl.name}</option>
      `
      );
    });

    let className;
    let studentName;
    let timestamp, convertedDate;
    valuationsData.forEach((valuation) => {
      className = classesData.find((cls) => cls.id === valuation.class_id).name;
      studentName = `${
        studentsData.find((student) => student.id === valuation.student_id)
          .first_name
      } ${
        studentsData.find((student) => student.id === valuation.student_id)
          .last_name
      } `;

      timestamp = new Date(valuation.date);
      convertedDate = timestamp.toLocaleDateString("en-GB");

      let otherDiff = valuation.other_difficulty.replace(/\*/g, ",");

      console.log(valuation.theory);

      latestValuationsContainer.insertAdjacentHTML(
        "beforeend",
        `
      <div class="valuation">
      <p class="valuation--p tit">Μαθητής</p>
      <p class="valuation--p ">${studentName}</p>
      <p class="valuation--p tit">Μάθημα</p>
      <p class="valuation--p">${className}</p>
      <p class="valuation--p tit">Ημερομηνία</p>
      <p class="valuation--p">${convertedDate}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης θεωρίας</p>
      <p class="valuation--p">${(valuation.theory /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία λυμένων ασκήσεων</p>
      <p class="valuation--p">${(valuation.solved_excercises /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης μεθοδολογίας</p>
       <p class="valuation--p">${(valuation.methodology /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία εκφώνησης άσκησης</p>
       <p class="valuation--p">${(valuation.pronunciation /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία μετάφρασης δεδομένων</p>
       <p class="valuation--p">${(valuation.data_translation /= 10)}</p>
      <p class="valuation--p tit">Γενική δυσκολία</p>
       <p class="valuation--p">${(valuation.general_difficulty /= 10)}</p>
      <p class="valuation--p tit">Μεταδοτικότητα</p>
       <p class="valuation--p">${(valuation.metadotikotita /= 10)}</p>
      <p class="valuation--p tit">Προτετοιμασία Μαθήματος</p>
       <p class="valuation--p">${(valuation.preparation /= 10)}</p>
       <p class="valuation--p tit">Άλλες δυσκολίες</p>
       <p class="valuation--p">${otherDiff.replace(",", "")}</p>
       
    
    </div>
    `
      );
    });
  } catch (error) {
    console.log(error);
  }

  studentsData.forEach((student) => {
    studentsList.insertAdjacentHTML(
      "afterbegin",
      `<div class=" row">
    <p>${student.id}</p>
    <p>${student.username}</p>
    <p>${student.first_name}</p>
    <p>${student.last_name}</p>
    </div>`
    );
  });

  classesData.forEach((cl) => {
    classesList.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="row">
    <p>${cl.id}</p>
    <p>${cl.name}</p>
    <p>${cl.grade}</p>
    <p>${cl.category}</p>
  </div>
    `
    );
  });

  studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = event.target.elements[0].value;
    const lastName = event.target.elements[1].value;
    const userName = event.target.elements[2].value;
    const password = event.target.elements[3].value;

    let studentExists = false;

    studentsData.forEach((student) => {
      if (student.first_name == firstName && student.last_name == lastName) {
        studentExists = true;
      }
    });

    if (!studentExists) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let toSend = JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        username: userName,
        password: password,
      });

      let config = {
        method: "POST",
        headers: myHeaders,
        body: toSend,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:5000/students/new",
        config
      );

      if (response.status == 200) {
        alert(`${firstName} ${lastName} καταχωρήθηκε στους μαθητές !`);

        event.target.elements[0].value = "";
        event.target.elements[1].value = "";
        event.target.elements[2].value = "";
        event.target.elements[3].value = "";

        location.reload();
      } else {
        alert(`Yπήρξε πρόβλημα !`);
      }
    } else {
      alert("Ο Μαθητής υπάρχει ήδη ");
    }
  });

  classForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log(event.target.elements);

    const title = event.target.elements[0].value;
    const grade = event.target.elements[1].value;
    const category = event.target.elements[2].value;

    let classExists = false;

    classesData.forEach((cl) => {
      if (cl.name == title) {
        classExists = true;
      }
    });

    if (!classExists) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let toSend = JSON.stringify({
        name: title,
        grade: grade,
        category: category,
      });

      let config = {
        method: "POST",
        headers: myHeaders,
        body: toSend,
        redirect: "follow",
      };

      const response = await fetch("http://localhost:5000/classes/new", config);

      if (response.status == 200) {
        alert(`Το μάθημα "${title}" δημιουργήθηκε επιτυχώς!`);

        event.target.elements[0].innerHTML = "";
        event.target.elements[1].selectedIndex = 0;
        event.target.elements[2].selectedIndex = 0;

        console.log("Im here");

        location.reload();
      } else {
        alert("Προέκυψε ένα πρόβλημα κατά την δημιουργία του μαθήματος!");
      }
    } else {
      alert("Το μάθημα υπάρχει ήδη !");
    }
  });

  listingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedStudent = document.querySelector(
      `#dropdown--students option[value="${event.target.elements[0].value}"]`
    );
    const selectedClass = document.querySelector(
      `#dropdown--classes option[value="${event.target.elements[1].value}"]`
    );

    let cont = true;

    listingsData.forEach((listing) => {
      if (
        listing.student_id == selectedStudent.id &&
        listing.class_id == selectedClass.id
      ) {
        alert("Ο μαθητής ειναι ήδη εγγεργαμένος στο μάθημα !");
        cont = false;
      }
    });

    if (cont) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      let toSend = JSON.stringify({
        student_id: selectedStudent.id,
        class_id: selectedClass.id,
      });

      let config = {
        method: "POST",
        headers: myHeaders,
        body: toSend,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:5000/listings/new",
        config
      );

      if (response.status == 200) {
        alert(
          `O μαθητής "${selectedStudent.value}" εγγράφη στο μάθημα "${selectedClass.value}"!`
        );
        location.reload();
      } else {
        alert("Προέκυψε ένα πρόβλημα κατά την εγγραφή!");
      }
    }
  });
};

fetchData();

let first = 1;

const fillStatistics = async () => {
  const classesPromise = await fetch("http://localhost:5000/classes/all");
  const valuationsPromise = await fetch("http://localhost:5000/valuations/all");

  const [classesResponse, valuationsResponse] = await Promise.all([
    classesPromise,
    valuationsPromise,
  ]);

  // Convert response to JSON
  classesData = await classesResponse.json();
  valuationsData = await valuationsResponse.json();

  const existingClassesInValuations = [];
  valuationsData.forEach((valuation) => {
    existingClassesInValuations.push(valuation.class_id);
  });

  const neededClassesData = classesData.filter((cls) =>
    existingClassesInValuations.includes(cls.id)
  );



  if (first == 1) {
    neededClassesData.forEach((cls) => {
      classesStatisticsDropDown.insertAdjacentHTML(
        "beforeend",
        `
     <option id="${cls.id}" value="${cls.name}">${cls.name}</option>
  `
      );
    });
  }

  first++;

  const selectedClassID =
    classesStatisticsDropDown.options[classesStatisticsDropDown.selectedIndex]
      .id;

  const valuationsForSelectedClass = valuationsData.filter(
    (valuation) => valuation.class_id == +selectedClassID
  );

  console.log(valuationsForSelectedClass);

  const len = valuationsForSelectedClass.length;

  const percentages = [];

  const theoryAverage = Math.floor(
    valuationsForSelectedClass.reduce(
      (accumulator, valuation) => accumulator + valuation.theory,
      0
    ) / len
  );
  percentages.push(theoryAverage);

  const solved_excercisesAverage = Math.floor(
    valuationsForSelectedClass.reduce(
      (accumulator, valuation) => accumulator + valuation.solved_excercises,
      0
    ) / len
  );
  percentages.push(solved_excercisesAverage);

  const methodologyAverage = Math.floor(
    valuationsForSelectedClass.reduce(
      (accumulator, valuation) => accumulator + valuation.methodology,
      0
    ) / len
  );
  percentages.push(methodologyAverage);

  const pronunciationAverage = Math.floor(
    valuationsForSelectedClass.reduce(
      (accumulator, valuation) => accumulator + valuation.pronunciation,
      0
    ) / len
  );
  percentages.push(pronunciationAverage);

  const data_translationAverage = Math.floor(
    valuationsForSelectedClass.reduce(
      (accumulator, valuation) => accumulator + valuation.data_translation,
      0
    ) / len
  );
  percentages.push(data_translationAverage);

  const general_difficultyAverage = Math.floor(
    valuationsForSelectedClass.reduce(
      (accumulator, valuation) => accumulator + valuation.general_difficulty,
      0
    ) / len
  );
  percentages.push(general_difficultyAverage);

  const metadotikotitaAverage = Math.floor(
    valuationsForSelectedClass.reduce(
      (accumulator, valuation) => accumulator + valuation.metadotikotita,
      0
    ) / len
  );
  percentages.push(metadotikotitaAverage);

  const preparationAverage = Math.floor(
    valuationsForSelectedClass.reduce(
      (accumulator, valuation) => accumulator + valuation.preparation,
      0
    ) / 8
  );
  percentages.push(preparationAverage);

  console.log(percentages);

  const overall =
    (theoryAverage +
      solved_excercisesAverage +
      metadotikotitaAverage +
      pronunciationAverage +
      methodologyAverage +
      general_difficultyAverage +
      data_translationAverage +
      preparationAverage) /
    percentages.length;

  percentages.push(Math.floor(overall));

  statisticsContainer.innerHTML = "";

  statisticsContainer.insertAdjacentHTML(
    "beforeend",
    `
 <p id="title">Στατιστικά για το μάθημα ${classesStatisticsDropDown.value}</p>
 <div id="stats">
   <p>Μέση Δυσκολία κατανόησης θεωρίας</p>
   <div class="wrapper">
   <div style="width: ${theoryAverage}%" class="bar"></div>
   </div>
    <p>${theoryAverage / 10} / 10</p>
   <p>Μέση Δυσκολία κατανόησης λυμένων ασκήσεων</p>
   <div class="wrapper">
   <div style="width: ${solved_excercisesAverage}%" class="bar"></div>
   </div>
   <p>${solved_excercisesAverage / 10} / 10</p>
   <p>Μέση Δυσκολία κατανόησης μεθοδολογίας</p>
   <div class="wrapper">
   <div style="width: ${methodologyAverage}%" class="bar"></div>
   </div>
   <p>${methodologyAverage / 10} / 10</p>
   <p>Μέση Δυσκολία εκφώνησης άσκησης</p>
   <div class="wrapper">
   <div style="width: ${pronunciationAverage}%" class="bar"></div>
   </div>
   <p>${pronunciationAverage / 10} / 10</p>
   <p>Μέση Δυσκολία μετάφρασης δεδομένων</p>
   <div class="wrapper">
   <div style="width: ${data_translationAverage}%" class="bar"></div>
   </div>
   <p>${data_translationAverage / 10} / 10</p>
   <p>Μέση Γενική δυσκολία</p>
   <div class="wrapper">
   <div style="width: ${general_difficultyAverage}%" class="bar"></div>
   </div>
   <p>${general_difficultyAverage / 10} / 10</p>
   <p>Μεταδοτικότητα</p>
   <div class="wrapper">
   <div style="width: ${metadotikotitaAverage}%" class="bar"></div>
   </div>
   <p>${metadotikotitaAverage / 10} / 10</p>
   <p>Προτοιμασία Μαθήματος</p>
   <div class="wrapper">
   <div style="width: ${preparationAverage}%" class="bar"></div>
   </div>
   <p>${preparationAverage / 10} / 10</p>
   <p>Μέση Αξιολόγηση Μαθήματος</p>
   <div class="wrapper">
   <div style="width: ${Math.floor(overall)}%" class="bar"></div>
   </div>
   <p>${Math.floor(overall) / 10} / 10</p>
 </div>
 `
  );
};

fillStatistics();

classesStatisticsDropDown.addEventListener("change", fillStatistics);

const filterValuations = async () => {
  const classesPromise = fetch("http://localhost:5000/classes/all");
  const valuationsPromise = await fetch("http://localhost:5000/valuations/all");
  const studentsPromise = await fetch("http://localhost:5000/students/all");

  const [classesResponse, valuationsResponse, studentsResponse] =
    await Promise.all([classesPromise, valuationsPromise, studentsPromise]);

  classesData = await classesResponse.json();
  valuationsData = await valuationsResponse.json();
  studentsData = await studentsResponse.json();

  const className = filterClasses.value;
  const studentName = filterStudents.value;

  let classID, studentID;

  if (className != "all--classes") {
    classID = classesData.find((cls) => cls.name == className).id;
  }

  if (studentName != "all--students") {
    const [firstName, lastName] = studentName.split(" ");

    console.log(firstName);
    console.log(lastName);
    studentID = studentsData.find(
      (st) => st.first_name == firstName && st.last_name == lastName
    ).id;
  }

  const previousValuations =
    latestValuationsContainer.querySelectorAll(".valuation");

  previousValuations.forEach((element) => {
    element.remove();
  });

  if (!classID && !studentID) {
    if (valuationsData.length > 0) {
      valuationsData.forEach((valuation) => {
        const className = classesData.find(
          (cls) => cls.id === valuation.class_id
        ).name;
        const studentName = `${
          studentsData.find((student) => student.id === valuation.student_id)
            .first_name
        } ${
          studentsData.find((student) => student.id === valuation.student_id)
            .last_name
        } `;

        const timestamp = new Date(valuation.date);
        const convertedDate = timestamp.toLocaleDateString("en-GB");

        let otherDiff = valuation.other_difficulty.replace(/\*/g, ",");

        latestValuationsContainer.insertAdjacentHTML(
          "beforeend",
          `
      <div class="valuation">
      <p class="valuation--p tit">Μαθητής</p>
      <p class="valuation--p ">${studentName}</p>
      <p class="valuation--p tit">Μάθημα</p>
      <p class="valuation--p">${className}</p>
      <p class="valuation--p tit">Ημερομηνία</p>
      <p class="valuation--p">${convertedDate}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης θεωρίας</p>
      <p class="valuation--p">${(valuation.theory /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία λυμένων ασκήσεων</p>
      <p class="valuation--p">${(valuation.solved_excercises /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης μεθοδολογίας</p>
       <p class="valuation--p">${(valuation.methodology /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία εκφώνησης άσκησης</p>
       <p class="valuation--p">${(valuation.pronunciation /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία μετάφρασης δεδομένων</p>
       <p class="valuation--p">${(valuation.data_translation /= 10)}</p>
      <p class="valuation--p tit">Γενική δυσκολία</p>
       <p class="valuation--p">${(valuation.general_difficulty /= 10)}</p>
      <p class="valuation--p tit">Μεταδοτικότητα</p>
       <p class="valuation--p">${(valuation.metadotikotita /= 10)}</p>
      <p class="valuation--p tit">Προτετοιμασία Μαθήματος</p>
       <p class="valuation--p">${(valuation.preparation /= 10)}</p>
       <p class="valuation--p tit">Άλλες δυσκολίες</p>
       <p class="valuation--p">${otherDiff.replace(",", "")}</p>
       
    
    </div>
    `
        );
      });
    } else {
      h3s = document.querySelectorAll("h3");

      h3s.forEach((h3) => h3.remove());

      latestValuationsContainer.insertAdjacentHTML(
        "beforeend",
        `<h3>Δεν βρέθηκαν αξιολογήσεις για τα κριτήρια αναζήτησης</h3>`
      );
    }
  } else if (classID && !studentID) {
    valuationsData = valuationsData.filter(
      (valuation) => valuation.class_id == classID
    );

    console.log(valuationsData);

    if (valuationsData.length > 0) {
      valuationsData.forEach((valuation) => {
        console.log(valuation);
        const className = classesData.find(
          (cls) => cls.id === valuation.class_id
        ).name;
        const studentName = `${
          studentsData.find((student) => student.id === valuation.student_id)
            .first_name
        } ${
          studentsData.find((student) => student.id === valuation.student_id)
            .last_name
        } `;

        const timestamp = new Date(valuation.date);
        const convertedDate = timestamp.toLocaleDateString("en-GB");

        let otherDiff = valuation.other_difficulty.replace(/\*/g, ",");

        latestValuationsContainer.insertAdjacentHTML(
          "beforeend",
          `
      <div class="valuation">
      <p class="valuation--p tit">Μαθητής</p>
      <p class="valuation--p ">${studentName}</p>
      <p class="valuation--p tit">Μάθημα</p>
      <p class="valuation--p">${className}</p>
      <p class="valuation--p tit">Ημερομηνία</p>
      <p class="valuation--p">${convertedDate}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης θεωρίας</p>
      <p class="valuation--p">${(valuation.theory /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία λυμένων ασκήσεων</p>
      <p class="valuation--p">${(valuation.solved_excercises /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης μεθοδολογίας</p>
       <p class="valuation--p">${(valuation.methodology /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία εκφώνησης άσκησης</p>
       <p class="valuation--p">${(valuation.pronunciation /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία μετάφρασης δεδομένων</p>
       <p class="valuation--p">${(valuation.data_translation /= 10)}</p>
      <p class="valuation--p tit">Γενική δυσκολία</p>
       <p class="valuation--p">${(valuation.general_difficulty /= 10)}</p>
      <p class="valuation--p tit">Μεταδοτικότητα</p>
       <p class="valuation--p">${(valuation.metadotikotita /= 10)}</p>
      <p class="valuation--p tit">Προτετοιμασία Μαθήματος</p>
       <p class="valuation--p">${(valuation.preparation /= 10)}</p>
       <p class="valuation--p tit">Άλλες δυσκολίες</p>
       <p class="valuation--p">${otherDiff.replace(",", "")}</p>
       
    
    </div>
    `
        );
      });
    } else {
      h3s = document.querySelectorAll("h3");

      h3s.forEach((h3) => h3.remove());

      latestValuationsContainer.insertAdjacentHTML(
        "beforeend",
        `<h3>Δεν βρέθηκαν αξιολογήσεις για τα κριτήρια αναζήτησης</h3>`
      );
    }
  } else if (!classID && studentID) {
    valuationsData = valuationsData.filter(
      (valuation) => valuation.student_id == studentID
    );

    console.log(valuationsData);

    if (valuationsData.length > 0) {
      valuationsData.forEach((valuation) => {
        console.log(valuation);
        const className = classesData.find(
          (cls) => cls.id === valuation.class_id
        ).name;
        const studentName = `${
          studentsData.find((student) => student.id === valuation.student_id)
            .first_name
        } ${
          studentsData.find((student) => student.id === valuation.student_id)
            .last_name
        } `;

        const timestamp = new Date(valuation.date);
        const convertedDate = timestamp.toLocaleDateString("en-GB");

        let otherDiff = valuation.other_difficulty.replace(/\*/g, ",");

        latestValuationsContainer.insertAdjacentHTML(
          "beforeend",
          `
      <div class="valuation">
      <p class="valuation--p tit">Μαθητής</p>
      <p class="valuation--p ">${studentName}</p>
      <p class="valuation--p tit">Μάθημα</p>
      <p class="valuation--p">${className}</p>
      <p class="valuation--p tit">Ημερομηνία</p>
      <p class="valuation--p">${convertedDate}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης θεωρίας</p>
      <p class="valuation--p">${(valuation.theory /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία λυμένων ασκήσεων</p>
      <p class="valuation--p">${(valuation.solved_excercises /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης μεθοδολογίας</p>
       <p class="valuation--p">${(valuation.methodology /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία εκφώνησης άσκησης</p>
       <p class="valuation--p">${(valuation.pronunciation /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία μετάφρασης δεδομένων</p>
       <p class="valuation--p">${(valuation.data_translation /= 10)}</p>
      <p class="valuation--p tit">Γενική δυσκολία</p>
       <p class="valuation--p">${(valuation.general_difficulty /= 10)}</p>
      <p class="valuation--p tit">Μεταδοτικότητα</p>
       <p class="valuation--p">${(valuation.metadotikotita /= 10)}</p>
      <p class="valuation--p tit">Προτετοιμασία Μαθήματος</p>
       <p class="valuation--p">${(valuation.preparation /= 10)}</p>
       <p class="valuation--p tit">Άλλες δυσκολίες</p>
       <p class="valuation--p">${otherDiff.replace(",", "")}</p>
       
    
    </div>
    `
        );
      });
    } else {
      h3s = document.querySelectorAll("h3");

      h3s.forEach((h3) => h3.remove());

      latestValuationsContainer.insertAdjacentHTML(
        "beforeend",
        `<h3>Δεν βρέθηκαν αξιολογήσεις για τα κριτήρια αναζήτησης</h3>`
      );
    }
  } else {
    valuationsData = valuationsData.filter(
      (valuation) => valuation.student_id == studentID
    );
    valuationsData = valuationsData.filter(
      (valuation) => valuation.class_id == classID
    );

    console.log(valuationsData);

    if (valuationsData.length > 0) {
      valuationsData.forEach((valuation) => {
        console.log(valuation);
        const className = classesData.find(
          (cls) => cls.id === valuation.class_id
        ).name;
        const studentName = `${
          studentsData.find((student) => student.id === valuation.student_id)
            .first_name
        } ${
          studentsData.find((student) => student.id === valuation.student_id)
            .last_name
        } `;

        const timestamp = new Date(valuation.date);
        const convertedDate = timestamp.toLocaleDateString("en-GB");

        let otherDiff = valuation.other_difficulty.replace(/\*/g, ",");

        latestValuationsContainer.insertAdjacentHTML(
          "beforeend",
          `
      <div class="valuation">
      <p class="valuation--p tit">Μαθητής</p>
      <p class="valuation--p ">${studentName}</p>
      <p class="valuation--p tit">Μάθημα</p>
      <p class="valuation--p">${className}</p>
      <p class="valuation--p tit">Ημερομηνία</p>
      <p class="valuation--p">${convertedDate}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης θεωρίας</p>
      <p class="valuation--p">${(valuation.theory /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία λυμένων ασκήσεων</p>
      <p class="valuation--p">${(valuation.solved_excercises /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία κατανόησης μεθοδολογίας</p>
       <p class="valuation--p">${(valuation.methodology /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία εκφώνησης άσκησης</p>
       <p class="valuation--p">${(valuation.pronunciation /= 10)}</p>
      <p class="valuation--p tit">Δυσκολία μετάφρασης δεδομένων</p>
       <p class="valuation--p">${(valuation.data_translation /= 10)}</p>
      <p class="valuation--p tit">Γενική δυσκολία</p>
       <p class="valuation--p">${(valuation.general_difficulty /= 10)}</p>
      <p class="valuation--p tit">Μεταδοτικότητα</p>
       <p class="valuation--p">${(valuation.metadotikotita /= 10)}</p>
      <p class="valuation--p tit">Προτετοιμασία Μαθήματος</p>
       <p class="valuation--p">${(valuation.preparation /= 10)}</p>
       <p class="valuation--p tit">Άλλες δυσκολίες</p>
       <p class="valuation--p">${otherDiff.replace(",", "")}</p>
       
    
    </div>
    `
        );
      });
    } else {
      h3s = document.querySelectorAll("h3");

      h3s.forEach((h3) => h3.remove());

      latestValuationsContainer.insertAdjacentHTML(
        "beforeend",
        `<h3>Δεν βρέθηκαν αξιολογήσεις για τα κριτήρια αναζήτησης</h3>`
      );
    }
  }
};

searchValuationsButton.addEventListener("click", filterValuations);
