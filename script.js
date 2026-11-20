const KEY = "alarms";
let battery = 100;
let warned = false;
let alarms = JSON.parse(localStorage.getItem(KEY) || "[]");

const batteryEl = document.getElementById("battery");
const warningEl = document.getElementById("warning");
const screenEl = document.getElementById("clockScreen");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const formEl = document.getElementById("alarmForm");
const listEl = document.getElementById("alarmList");
const popupEl = document.getElementById("lowBatteryPopup");
const closePopupBtn = document.getElementById("closePopupBtn");

const pad = (n) => String(n).padStart(2, "0");
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

closePopupBtn.addEventListener("click", () => {
  popupEl.classList.add("hidden");
});

function saveAndRender() {
  localStorage.setItem(KEY, JSON.stringify(alarms));
  renderAlarms();
}

function renderAlarms() {
  listEl.innerHTML = alarms
    .map(
      (a) => `
      <li>
        <span>${pad(a.h)}:${pad(a.m)}:${pad(a.s)}</span>
        <button onclick="removeAlarm(${a.id})">삭제</button>
      </li>`,
    )
    .join("");
}

window.removeAlarm = (id) => {
  alarms = alarms.filter((a) => a.id !== id);
  saveAndRender();
};

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  if (alarms.length >= 3) return alert("최대 3개까지만 가능합니다.");

  alarms.push({
    id: Date.now(),
    h: Number(document.getElementById("hour").value),
    m: Number(document.getElementById("minute").value),
    s: Number(document.getElementById("second").value),
  });
  formEl.reset();
  saveAndRender();
});

function updateClock() {
  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const dayName = weekDays[now.getDay()];

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  dateEl.textContent = `${year}. ${month}. ${day}. (${dayName})`;
  timeEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;

  if (battery > 0) {
    battery -= 1;
    batteryEl.textContent = battery;

    if (battery <= 15) {
      warningEl.classList.remove("hidden");
      if (!warned) {
        popupEl.classList.remove("hidden");
        warned = true;
      }
    }

    if (alarms.some((a) => a.h === h && a.m === m && a.s === s)) {
      alert(`알람 시간입니다! (${pad(h)}:${pad(m)}:${pad(s)})`);
    }
  }

  if (battery === 0) {
    screenEl.classList.add("off");
    warningEl.classList.add("hidden");
    popupEl.classList.add("hidden");
  }
}

renderAlarms();
updateClock();
setInterval(updateClock, 1000);
