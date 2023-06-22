const mainSection = document.querySelector("main");

const studentId = document.getElementById("student--id").innerHTML;

let classesData, listingsData;
const fetchData = async () => {
  const classesPromise = fetch(
    "https://valuations-api-a8c38e285527.herokuapp.com/classes/all"
  );
  const listingsPromise = fetch(
    "https://valuations-api-a8c38e285527.herokuapp.com/listings/all"
  );

  // Wait for both promises to resolve
  const [classesResponse, listingsResponse] = await Promise.all([
    classesPromise,
    listingsPromise,
  ]);

  // Convert response to JSON
  classesData = await classesResponse.json();
  listingsData = await listingsResponse.json();

  // Use the data in the rest of your code
};

async function main() {
  await fetchData();
  getStudentClasses();
  renderClasses();
}

let classesIdForStudent = [];
const getStudentClasses = () => {
  listingsData.forEach((list) => {
    if (list.student_id == studentId) {
      classesIdForStudent.push(list.class_id);
    }
  });
};

let classInfo;
const renderClasses = async () => {
  let response1 = await fetch(
    "https://valuations-api-a8c38e285527.herokuapp.com/valuations/all"
  );
  let allValuations = response1.json();

  let valuationExists = false;

  console.log(classesIdForStudent);

  classesIdForStudent.forEach((cl) => {
    classInfo = classesData.find((el) => el.id === cl);

    allValuations.forEach((valData) => {
      valuationExists = false;
      if (valData.student_id == studentId && valData.class_id == classInfo.id) {
        valuationExists = true;
      }
    });

    if (!valuationExists) {
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
     </div> `
      );
    }
  });
};

main();
