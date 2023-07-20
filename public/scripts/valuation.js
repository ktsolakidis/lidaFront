const bars = document.querySelectorAll(".bar");
const arrows = document.querySelectorAll(".arrow");
const percentageDisplays = document.querySelectorAll(".percentage");
const formElements = document.querySelectorAll(".form--field");
const form = document.querySelector("form");
const studentId = document.getElementById("student--id");
const classId = document.getElementById("class--id");
const studentName = document.getElementById("student--name");
const valuationForm = document.querySelector("form");
const temporarySubmitButton = document.getElementById(
  "temporary--submit--button"
);
const finalSubmitButton = document.getElementById("final--submit--button");

let activeArrow = null;

function moveArrow(event) {
  if (activeArrow) {
    const bar = activeArrow.closest(".bar");
    const section = activeArrow.closest(".section");
    const arrow = activeArrow;

    const percentageDisplay = section.querySelector(".percentage");

    const barWidth = bar.offsetWidth;
    const arrowWidth = arrow.offsetWidth;
    const position = event.pageX - bar.offsetLeft - arrowWidth / 2;
    const newPosition = Math.max(0, Math.min(position, barWidth - arrowWidth));
    arrow.style.left = newPosition + "px";
    const percentage = Math.round(
      (newPosition / (barWidth - arrowWidth)) * 100
    );
    percentageDisplay.innerText = percentage;

    updatePercentages();
    updateFormElements();
  }
}

function startDrag(event) {
  activeArrow = event.target;
  document.addEventListener("mousemove", moveArrow);
}

function stopDrag(event) {
  activeArrow = null;
  document.removeEventListener("mousemove", moveArrow);
}

let percentagesList = [];
function updatePercentages() {
  for (let i = 0; i < percentageDisplays.length; i++) {
    percentagesList[i] = percentageDisplays[i].innerHTML;
  }
}

function updateFormElements() {
  for (let i = 0; i < formElements.length; i++) {
    if (percentagesList[i]) {
      formElements[i].value = percentagesList[i];
    } else {
      formElements[i].value = 0;
    }
  }
}

function displayTime() {
  const clock = document.getElementById("clock");
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();

  // Format the time
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // Display the time
  let timeString = hours + ":" + minutes;
  clock.textContent = timeString;
}

// Call displayTime() every second
setInterval(displayTime, 1000);

arrows.forEach((arrow) => {
  arrow.addEventListener("mousedown", startDrag);
});

document.addEventListener("mouseup", stopDrag);

(async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/temporaryValuations/all"
    );
    if (response.status === 200) {
      temporaryValuations = await response.json();

      temporaryValuations.forEach(async (valuation) => {
        if (
          valuation.class_id == +classId.innerHTML &&
          valuation.student_id == +studentId.innerHTML
        ) {
          temporarySubmitButton.classList.add("disable");

          const {
            theory,
            solved_excercises,
            methodology,
            pronunciation,
            data_translation,
            general_difficulty,
            metadotikotita,
            preparation,
            other_difficulty,
          } = valuation;

          const barWidth = arrows[0].closest(".bar").offsetWidth;

          // Calculate arrow positions based on bar width and temporary evaluation values
          arrows[0].style.left = (theory / 100) * barWidth + "px";
          arrows[1].style.left = (solved_excercises / 100) * barWidth + "px";
          arrows[2].style.left = (methodology / 100) * barWidth + "px";
          arrows[3].style.left = (pronunciation / 100) * barWidth + "px";
          arrows[4].style.left = (data_translation / 100) * barWidth + "px";
          arrows[5].style.left = (general_difficulty / 100) * barWidth + "px";
          arrows[6].style.left = (metadotikotita / 100) * barWidth + "px";
          arrows[7].style.left = (preparation / 100) * barWidth + "px";

          // Update HTML values
          percentageDisplays[0].innerText = theory;
          percentageDisplays[1].innerText = solved_excercises;
          percentageDisplays[2].innerText = methodology;
          percentageDisplays[3].innerText = pronunciation;
          percentageDisplays[4].innerText = data_translation;
          percentageDisplays[5].innerText = general_difficulty;
          percentageDisplays[6].innerText = metadotikotita;
          percentageDisplays[7].innerText = preparation;

          const checkbxs = other_difficulty.split("*");

          console.log(checkbxs);

          const checkboxes = document.querySelectorAll("input[type=checkbox]");

          

          for (let i = 0; i < checkboxes.length; i++) {
           

            console.log(  checkboxes[i].name);
          
            if (checkbxs.includes(checkboxes[i].name)) {
              checkboxes[i].checked = true;
            }
          }

          // checkbxs.forEach(checkboxText => {
          //    let current =  checkboxes.find(checkbox => checkbox.name = checkboxText);
          //    current.checked = true;
          // })
        }
      });
    } else {
      throw new Error("Failed to fetch temporary evaluations");
    }
  } catch (error) {
    console.error(error);
  }
})();

const deleteTempValuationFor = async (classID, studentID) => {
  let temporaryValuations = [];
  try {
    const response = await fetch(
      "http://localhost:5000/temporaryValuations/all"
    );
    if (response.status === 200) {
      temporaryValuations = await response.json();

      temporaryValuations.forEach(async (valuation) => {
        if (
          valuation.class_id == classID &&
          valuation.student_id == studentID
        ) {
          await fetch(
            `http://localhost:5000/temporaryValuations/del/${valuation.id}`,
            { method: "DELETE" }
          );
        }
      });
    } else {
      throw new Error("Failed to fetch temporary evaluations");
    }
  } catch (error) {
    console.error(error);
  }
};

finalSubmitButton.addEventListener("click", async function (event) {
  event.preventDefault();
  let formElements = valuationForm.getElementsByClassName("form--field");



  updatePercentages();
  updateFormElements();

  let percentagesFinal = percentagesList.map((per) => {
    if (per == "") {
      per = "0";
      return per;
    } else {
      return per;
    }
  });

  const checkboxes = document.querySelectorAll("input[type=checkbox]");

  let otherDifficultyText = "";

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      otherDifficultyText = otherDifficultyText + "*" + checkboxes[i].name;
    }
  }




  setTimeout(()=>{
    console.log('Yaaaaa');
  },19000);


  let toSend = JSON.stringify({
    student_id: studentId.innerHTML,
    class_id: classId.innerHTML,
    theory: percentagesFinal[0] ? percentagesFinal[0] : 0,
    solved_excercises: percentagesFinal[1] ? percentagesFinal[1] : 0,
    methodology: percentagesFinal[2] ? percentagesFinal[2] : 0,
    pronunciation: percentagesFinal[3] ? percentagesFinal[3] : 0,
    data_translation: percentagesFinal[4] ? percentagesFinal[4] : 0,
    general_difficulty: percentagesFinal[5] ? percentagesFinal[5] : 0,
    metadotikotita: percentagesFinal[6] ? percentagesFinal[6] : 0,
    preparation: percentagesFinal[7] ? percentagesFinal[7] : 0,
    other_difficulty: otherDifficultyText,
  });

  
  await deleteTempValuationFor(classId.innerHTML, studentId.innerHTML);

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let config = {
    method: "POST",
    headers: myHeaders,
    body: toSend,
    redirect: "follow",
  };

  const response = await fetch("http://localhost:5000/valuations/new", config);

  if (response.status == 200) {
    alert(`H αξιολόγηση καταχωρήθηκε !`);
    valuationForm.submit();
  } else {
    alert(`Υπήρξε πρόβλημα !`);
    location.reload();
  }

  for (let i = 0; i < percentagesFinal.length; i++) {
    formElements[i].value = percentagesFinal[i];
  }

  for (let i = 0; i < formElements.length; i++) {
    console.log(formElements[i].value);
  }

  valuationForm.submit();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

temporarySubmitButton.addEventListener("click", async function (event) {
  event.preventDefault();
  let formElements = valuationForm.getElementsByClassName("form--field");

  let percentagesFinal = [];


  percentagesFinal = percentagesList.map((per) => {
    if (per == "") {
      per = "0";
      return per;
    } else {
      return per;
    }
  });

  const checkboxes = document.querySelectorAll("input[type=checkbox]");

  let otherDifficultyText = "";

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      otherDifficultyText = otherDifficultyText + "*" + checkboxes[i].name;
    }
  }

  let toSend = JSON.stringify({
    student_id: studentId.innerHTML,
    class_id: classId.innerHTML,
    theory: percentagesFinal[0] ? percentagesFinal[0] : 0,
    solved_excercises: percentagesFinal[1] ? percentagesFinal[1] : 0,
    methodology: percentagesFinal[2] ? percentagesFinal[2] : 0,
    pronunciation: percentagesFinal[3] ? percentagesFinal[3] : 0,
    data_translation: percentagesFinal[4] ? percentagesFinal[4] : 0,
    general_difficulty: percentagesFinal[5] ? percentagesFinal[5] : 0,
    metadotikotita: percentagesFinal[6] ? percentagesFinal[6] : 0,
    preparation: percentagesFinal[7] ? percentagesFinal[7] : 0,
    other_difficulty: otherDifficultyText,
  });

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let config = {
    method: "POST",
    headers: myHeaders,
    body: toSend,
    redirect: "follow",
  };

  const response = await fetch(
    "http://localhost:5000/temporaryValuations/new",
    config
  );

  if (response.status == 200) {
    alert(`H αξιολόγηση καταχωρήθηκε !`);
    valuationForm.submit();
  } else {
    alert(`Υπήρξε πρόβλημα !`);
    location.reload();
  }

  for (let i = 0; i < percentagesFinal.length; i++) {
    formElements[i].value = percentagesFinal[i];
  }

  for (let i = 0; i < formElements.length; i++) {
    console.log(formElements[i].value);
  }

  valuationForm.submit();
});
