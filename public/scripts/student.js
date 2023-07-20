const mainSection = document.querySelector("main");

const studentId = document.getElementById("student--id").innerHTML;
const historyButton = document.getElementById("button--history");
const historyContainer = document.getElementById("div--history");

let classesData, listingsData, valuationsData;

const fetchData = async () => {
  const classesPromise = fetch("http://localhost:5000/classes/all");
  const listingsPromise = fetch("http://localhost:5000/listings/all");

  let valuationsPromise = await fetch("http://localhost:5000/valuations/all");

  // Wait for all promises to resolve
  const [classesResponse, listingsResponse, valuationsResponse] =
    await Promise.all([classesPromise, listingsPromise, valuationsPromise]);

  // Convert response to JSON
  classesData = await classesResponse.json();
  listingsData = await listingsResponse.json();
  valuationsData = await valuationsResponse.json();
};

const getStudentClasses = () => {
  let classesIdForStudent = [];
  listingsData.forEach((list) => {
    if (list.student_id == studentId) {
      classesIdForStudent.push(list.class_id);
    }
  });
  return classesIdForStudent;
};

let noValuations = true;
const renderClasses = (classesIdForStudent) => {
  classesIdForStudent.forEach((classId) => {
    const classInfo = classesData.find((el) => el.id === classId);
    const valuationExists = valuationsData.some(
      (valData) =>
        valData.student_id == studentId && valData.class_id == classInfo.id
    );

    if (!valuationExists) {
      noValuations = false;
      mainSection.insertAdjacentHTML(
        "beforeend",
        `<div class="class">
           <p class="class--title">${classInfo.name}</p>
           <p class="class--level">${classInfo.category}</p>
           <form action="/valuation" method="POST">
             <input type="text" name="classId" value="${classInfo.id}" />
             <input type="text" name="className" value="${classInfo.name}" />
             <input type="text" name="student--id" value="${studentId}" />
             <button type="submit">Αξιολόγηση</button>
           </form>
         </div>`
      );
    }
  });
  if (noValuations) {
    mainSection.insertAdjacentHTML(
      "beforeend",
      `<p> Δεν βρέθηκαν μαθήματα προς αξιολόγηση!
       </p>`
    );
  }
};

async function main() {
  await fetchData();
  const classesIdForStudent = getStudentClasses();
  renderClasses(classesIdForStudent);
}

let isHistoryInserted = false;

historyButton.addEventListener("click", async () => {
  let valuationsPromise = await fetch("http://localhost:5000/valuations/all");
  const classesPromise = fetch("http://localhost:5000/classes/all");

  const [classesResponse, valuationsResponse] = await Promise.all([
    classesPromise,
    valuationsPromise,
  ]);

  // Convert response to JSON
  classesData = await classesResponse.json();
  valuationsData = await valuationsResponse.json();

  console.log(valuationsData);

  const valuationsHistory = valuationsData.filter(
    (val) => val.student_id == studentId
  );



  let classesNames = [];

  valuationsHistory.forEach((val) => {
    classesNames.push(classesData.find((cls) => cls.id == val.class_id));
  });



console.log(isHistoryInserted);



 if(!isHistoryInserted){
  historyButton.insertAdjacentHTML(
    "afterend",
    `
  <div id="div--history">
    ${classesNames
      .map((cls) => `<p>${cls.name} | ${cls.grade} | ${cls.category}</p>`)
      .join("")}
  </div>
`
  );
  isHistoryInserted = true
    }else{
      document.getElementById('div--history').remove();
      isHistoryInserted = false
    }

 
  
});



main();
