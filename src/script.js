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

function setActiveButton(active) {
  Object.entries(buttons).forEach(([key, btn]) => {
    btn.classList.toggle("active", key === active);
  });
}

// Count-up for current hours
function countTo(element, target, duration = 800) {
  const start = parseInt(element.textContent) || 0;
  const range = target - start;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(start + range * progress);
    element.textContent = `${value}hrs`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Count-up for previous hours + label
function countToLabelled(element, label, target, duration = 800) {
  const currentText = element.textContent.match(/\d+/);
  const start = currentText ? parseInt(currentText[0]) : 0;
  const range = target - start;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(start + range * progress);
    element.textContent = `${label} - ${value}hrs`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function updateDOM(data, period) {
  data.forEach((activity) => {
    const name = activity.title;
    const { current, previous } = activity.timeframes[period];
    if (hoursMap[name]) {
      countTo(hoursMap[name].current, current);

      const label =
        period === "daily"
          ? "Yesterday"
          : period === "weekly"
          ? "Last week"
          : "Last month";

      countToLabelled(hoursMap[name].previous, label, previous);
    }
  });
}
