const buttons = {
  daily: document.getElementById("dailyButton"),
  weekly: document.getElementById("weeklyButton"),
  monthly: document.getElementById("monthlyButton"),
};

const hoursMap = {
  Work: {
    current: document.getElementById("work-hours"),
    previous: document.getElementById("previous-work-hours"),
  },
  Play: {
    current: document.getElementById("play-hours"),
    previous: document.getElementById("previous-play-hours"),
  },
  Study: {
    current: document.getElementById("study-hours"),
    previous: document.getElementById("previous-study-hours"),
  },
  Exercise: {
    current: document.getElementById("exercise-hours"),
    previous: document.getElementById("previous-exercise-hours"),
  },
  Social: {
    current: document.getElementById("social-hours"),
    previous: document.getElementById("previous-social-hours"),
  },
  "Self Care": {
    current: document.getElementById("self-care-hours"),
    previous: document.getElementById("previous-self-care-hours"),
  },
};

fetch("/data.json")
  .then((res) => res.json())
  .then((data) => {
    // Attach click handlers once the data is ready
    Object.entries(buttons).forEach(([period, button]) => {
      button.addEventListener("click", () => {
        setActiveButton(period);
        updateDOM(data, period);
      });
    });

    updateDOM(data, "weekly");
    setActiveButton("weekly");
  })
  .catch((err) => console.error("Error fetching data:", err));

// Helper to toggle the active button
function setActiveButton(active) {
  Object.entries(buttons).forEach(([key, btn]) => {
    btn.classList.toggle("active", key === active);
  });
}

// Actual DOM update logic
function updateDOM(data, period) {
  data.forEach((activity) => {
    const name = activity.title;
    const { current, previous } = activity.timeframes[period];
    if (hoursMap[name]) {
      hoursMap[name].current.textContent = `${current}hrs`;
      hoursMap[name].previous.textContent = `${
        period === "daily"
          ? "Yesterday"
          : period === "weekly"
          ? "Last week"
          : " Last month"
      } - ${previous}hrs`;
    }
  });
}
