const bars = document.querySelectorAll(".bar");
const arrows = document.querySelectorAll(".arrow");
const percentageDisplays = document.querySelectorAll(".percentage");
const formElements = document.querySelectorAll(".form--field");
const form = document.querySelector("form");
const studentId = document.getElementById("student--id");
const studentName = document.getElementById("student--name");
const valuationForm = document.querySelector("form");

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

valuationForm.addEventListener("submit", function (event) {
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

  for (let i = 0; i < percentagesFinal.length; i++) {
    formElements[i].value = percentagesFinal[i];
  }

  document.getElementById('other--difference').value = document.getElementById('other--diff').value;

for(let i=0;i<formElements.length;i++){
  console.log(formElements[i].value);
}

  valuationForm.submit();
});
