// Get references to DOM elements
const body = document.querySelector("body"),
  hourHand = document.querySelector(".hour"),
  minuteHand = document.querySelector(".minute"),
  secondHand = document.querySelector(".second")
//   modeSwitch = document.querySelector(".mode-switch");
// // check if the mode is already set to "Dark Mode" in localStorage
// if (localStorage.getItem("mode") === "Dark Mode") {
//   // add "dark" class to body and set modeSwitch text to "Light Mode"
//   body.classList.add("dark");
//   modeSwitch.textContent = "Light Mode";
// }
// // add a click event listener to modeSwitch
// modeSwitch.addEventListener("click", () => {
//   // toggle the "dark" class on the body element
//   body.classList.toggle("dark");
//   // check if the "dark" class is currently present on the body element
//   const isDarkMode = body.classList.contains("dark");
//   // set modeSwitch text based on "dark" class presence
//   modeSwitch.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
//   // set localStorage "mode" item based on "dark" class presence
//   localStorage.setItem("mode", isDarkMode ? "Dark Mode" : "Light Mode");
// });
const updateTime = () => {
    
  // Get current time and calculate degrees for clock hands
  let date = new Date(),
    secToDeg = (date.getSeconds() / 60) * 360,
    minToDeg = (date.getMinutes() / 60) * 360,
    hrToDeg = (date.getHours() / 12) * 360;
  // Rotate the clock hands to the appropriate degree based on the current time
  secondHand.style.transform = `rotate(${secToDeg}deg)`;
  minuteHand.style.transform = `rotate(${minToDeg}deg)`;
  hourHand.style.transform = `rotate(${hrToDeg}deg)`;
};

function updateDate() {
    const weekdayElement = document.getElementById("weekday");
    const monthElement = document.getElementById("month");
    const dayElement = document.getElementById("day");
    const yearElement = document.getElementById("year");

    const currentDate = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    const [weekday, month, day, year] = formattedDate.split(' ');

    weekdayElement.textContent = weekday;
    monthElement.textContent = month;
    dayElement.textContent = day;
    yearElement.textContent = year;
}

const timezoneSelector = document.getElementById("timezone-selector");

// Create the default option
const defaultOption = document.createElement("option");
defaultOption.value = "";
defaultOption.textContent = "Select Time Zone";

// Append the default option to the selector
timezoneSelector.appendChild(defaultOption);

// Get a list of all available time zones
const allTimeZones = moment.tz.names();

// Populate the time zone selector with options
allTimeZones.forEach((timeZone) => {
    const option = document.createElement("option");
    option.value = timeZone;
    option.textContent = timeZone;
    timezoneSelector.appendChild(option);
});

// Set a default time zone (e.g., user's local time zone)
const userLocalTimeZone = moment.tz.guess();
timezoneSelector.value = userLocalTimeZone;

// Add an event listener to the time zone selector
timezoneSelector.addEventListener("change", () => {
    const selectedTimeZone = timezoneSelector.value;
    // Call a function to update the clock hands based on the selected time zone
    updateClockHands(selectedTimeZone);
});

function updateClockHands(selectedTimeZone) {
    const dateInSelectedTimeZone = moment.tz(selectedTimeZone);
    const hours = dateInSelectedTimeZone.hours();
    const minutes = dateInSelectedTimeZone.minutes();
    const seconds = dateInSelectedTimeZone.seconds();

    const hourHand = document.querySelector(".hand.hour");
    const minuteHand = document.querySelector(".hand.minute");
    const secondHand = document.querySelector(".hand.second");

    // Calculate rotation angles for the clock hands
    const secondAngle = (seconds / 60) * 360;
    const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
    const hourAngle = ((hours % 12 + minuteAngle / 360) / 12) * 360;

    // Rotate the clock hands
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
}

// Function to update the clock hands based on user input
function updateClockHandsStyle(color, style) {
  // Apply user-defined styles to the clock hands
  hourHand.style.backgroundColor = color;
  hourHand.style.borderRadius = style === "round" ? "50%" : "0";

  minuteHand.style.backgroundColor = color;
  minuteHand.style.borderRadius = style === "round" ? "50%" : "0";

  secondHand.style.backgroundColor = color;
  secondHand.style.borderRadius = style === "round" ? "50%" : "0";
    hourHand.style.transition = "transform 0.5s ease-in-out";
  minuteHand.style.transition = "transform 0.5s ease-in-out";
  secondHand.style.transition = "transform 0.5s ease-in-out";
}
function updateClockHandsRotation(hourAngle, minuteAngle, secondAngle) {
  // Use requestAnimationFrame for precise control over animations
  requestAnimationFrame(() => {
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
  });
}

// Example: You can call these functions to update clock hands
updateClockHandsStyle("black", 8, "square");
updateClockHandsRotation(90, 180, 270); // Example rotation angles

// Example: You can add input fields or options to allow users to customize the clock hands.
const colorInput = document.getElementById("hand-color");

const styleInput = document.getElementById("hand-style");

// Add event listeners to update the clock hands when user input changes
colorInput.addEventListener("change", () => {
  const color = colorInput.value;
  updateClockHandsStyle(color, styleInput.value);
});



styleInput.addEventListener("change", () => {
  const style = styleInput.value;
  updateClockHandsStyle(colorInput.value,  style);
});

// Initialize the clock hands with default values (you can customize these)
updateClockHandsStyle("black", 8, "square");

// Update the date every 1000 milliseconds (1 second)
setInterval(updateDate, 1000);



// Initial update when the page loads
updateDate();
// call updateTime to set clock hands every second
setInterval(updateTime, 1000);
//call updateTime function on page load
updateTime();

// Get references to the clock circle and the clock background color input field
const clockCircle = document.querySelector(".clock");
const clockBgColorInput = document.getElementById("clock-bg-color");

// Function to update the clock circle's background color
function updateClockBackgroundColor(bgColor) {
  clockCircle.style.backgroundColor = bgColor;
}

// Add an event listener to the clock background color input field
clockBgColorInput.addEventListener("input", () => {
  const bgColor = clockBgColorInput.value;
  updateClockBackgroundColor(bgColor);
});

// Initialize the clock circle's background color with the default value
updateClockBackgroundColor("#fff"); // Example default value

// Get references to the transparency and rounded ends input fields
const handTransparencyInput = document.getElementById("hand-transparency");
const roundedEndsInput = document.getElementById("rounded-ends");

// Function to update hand transparency
function updateHandTransparency(transparency) {
  const hands = document.querySelectorAll(".hand");
  hands.forEach((hand) => {
    hand.style.opacity = transparency;
  });
}

// Function to update hand rounded ends
function updateRoundedEnds(rounded) {
  const hands = document.querySelectorAll(".hand");
  hands.forEach((hand) => {
    if (rounded) {
      hand.classList.add("rounded");
    } else {
      hand.classList.remove("rounded");
    }
  });
}

// Add event listeners to transparency and rounded ends input fields
handTransparencyInput.addEventListener("input", () => {
  const transparency = handTransparencyInput.value;
  updateHandTransparency(transparency);
});

roundedEndsInput.addEventListener("change", () => {
  const rounded = roundedEndsInput.checked;
  updateRoundedEnds(rounded);
});

// Initialize hand transparency and rounded ends with default values
updateHandTransparency(1); // No transparency
updateRoundedEnds(false); // No rounded ends



// Get references to the question mark icons and information panels
const timezoneInfoPanel = document.getElementById("timezone-info-panel");
const timekeepingInfoPanel = document.getElementById("timekeeping-info-panel");
const analogClockInfoPanel = document.getElementById("analog-clock-info-panel");

const timezoneQuestionMark = document.getElementById("timezone-question-mark");
const timekeepingQuestionMark = document.getElementById("timekeeping-question-mark");
const analogClockQuestionMark = document.getElementById("analog-clock-question-mark");

// Function to show the information panel and position it near the question mark icon
function showInfoPanel(infoPanel, questionMark) {
  infoPanel.style.display = "block";

  // Position the info panel near the question mark icon
  const rect = questionMark.getBoundingClientRect();
  infoPanel.style.left = rect.left + "px";
  infoPanel.style.top = rect.bottom + 5 + "px"; // Adjust the vertical position
}

// Function to hide the information panel
function hideInfoPanel(infoPanel) {
  infoPanel.style.display = "none";
}

// Add event listeners to question mark icons for showing/hiding information panels
timezoneQuestionMark.addEventListener("mouseenter", () => {
  showInfoPanel(timezoneInfoPanel, timezoneQuestionMark);
});

timezoneQuestionMark.addEventListener("mouseleave", () => {
  hideInfoPanel(timezoneInfoPanel);
});

timekeepingQuestionMark.addEventListener("mouseenter", () => {
  showInfoPanel(timekeepingInfoPanel, timekeepingQuestionMark);
});

timekeepingQuestionMark.addEventListener("mouseleave", () => {
  hideInfoPanel(timekeepingInfoPanel);
});

analogClockQuestionMark.addEventListener("mouseenter", () => {
  showInfoPanel(analogClockInfoPanel, analogClockQuestionMark);
});

analogClockQuestionMark.addEventListener("mouseleave", () => {
  hideInfoPanel(analogClockInfoPanel);
});

// Populate the information panels with educational content
timezoneInfoPanel.innerHTML = "Learn about time zones and their importance.";
timekeepingInfoPanel.innerHTML = "Explore the history of timekeeping methods.";
analogClockInfoPanel.innerHTML = "Discover the history and mechanics of analog clocks.";

// Function to fetch and display world clock times
function displayWorldClock() {
  // Implement logic to fetch and display world clock times
}

// Call the function to display world clock times when the page loads
displayWorldClock();
