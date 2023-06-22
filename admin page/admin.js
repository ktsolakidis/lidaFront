
  // Get the navbar buttons
  const buttons = document.querySelectorAll('.navbar ul li a');

  // Get all the sections
  const sections = document.querySelectorAll('.container');

  // Hide all sections except the first one
  for (let i = 1; i < sections.length; i++) {
    sections[i].style.display = 'none';
  }

  // Add click event listener to each button
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Hide all sections
      sections.forEach((section) => {
        section.style.display = 'none';
      });

      // Display the corresponding section based on button index
      sections[index].style.display = 'block';
    });
  });

