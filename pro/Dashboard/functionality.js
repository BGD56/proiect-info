// ==========================================
// TEMPO - DASHBOARD FUNCTIONALITY
// ==========================================

// DOM ELEMENTS
const calendarGrid = document.getElementById("calendarGrid");
const currentMonthElement = document.getElementById("currentMonth");
const selectedDateElement = document.getElementById("selectedDate");
const scheduleList = document.getElementById("scheduleList");

const previousMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const todayButton = document.getElementById("todayButton");

const addEventButton = document.getElementById("addEventButton");
const eventDialog = document.getElementById("eventDialog");
const eventForm = document.getElementById("eventForm");
const closeDialogButton = document.getElementById("closeDialog");
const cancelEventButton = document.getElementById("cancelEvent");

// INPUT ELEMENTS
const eventTitleInput = document.getElementById("eventTitle");
const eventDateInput = document.getElementById("eventDate");
const eventTimeInput = document.getElementById("eventTime");
const eventCategoryInput = document.getElementById("eventCategory");
const eventNotesInput = document.getElementById("eventNotes");

// ==========================================
// APPLICATION STATE
// ==========================================

let currentDate = new Date();
let selectedDate = new Date();

let events = JSON.parse(localStorage.getItem("organitime-dashboard-events")) || [];

// ==========================================
// DATE FUNCTIONS
// ==========================================

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDisplayDate(date) {
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function saveEvents() {
    localStorage.setItem("organitime-dashboard-events", JSON.stringify(events));
}

// ==========================================
// CALENDAR
// ==========================================

function renderCalendar() {
    if (!calendarGrid || !currentMonthElement) return;

    calendarGrid.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Convert Sunday-first format to Monday-first
    const startingDay = (firstDay + 6) % 7;

    currentMonthElement.textContent = currentDate.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric"
    });

    // Empty calendar spaces
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.classList.add("calendar-day", "empty");
        calendarGrid.appendChild(emptyDay);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("button");

        const date = new Date(year, month, day);
        const dateString = formatDate(date);

        dayElement.classList.add("calendar-day");
        dayElement.textContent = day;

        if (dateString === formatDate(new Date())) {
            dayElement.classList.add("today");
        }

        if (dateString === formatDate(selectedDate)) {
            dayElement.classList.add("selected");
        }

        // Event indicator
        if (events.some(event => event.date === dateString)) {
            dayElement.classList.add("has-event");
        }

        dayElement.addEventListener("click", () => {
            selectedDate = date;
            renderCalendar();
            renderSchedule();
        });

        calendarGrid.appendChild(dayElement);
    }
}

// ==========================================
// DAILY SCHEDULE
// ==========================================

function renderSchedule() {
    if (!scheduleList) return;

    scheduleList.innerHTML = "";

    if (selectedDateElement) {
        selectedDateElement.textContent = formatDisplayDate(selectedDate);
    }

    const selectedDateString = formatDate(selectedDate);

    const dailyEvents = events
        .filter(event => event.date === selectedDateString)
        .sort((a, b) => a.time.localeCompare(b.time));

    if (dailyEvents.length === 0) {
        scheduleList.innerHTML = `
            <p class="empty-message">
                No activities planned for this day.
            </p>
        `;
        return;
    }

    dailyEvents.forEach(event => {
        const eventElement = document.createElement("div");

        eventElement.classList.add("schedule-event");

        eventElement.innerHTML = `
            <div class="event-time">${event.time}</div>

            <div class="event-information">
                <h3></h3>
                <span class="event-category"></span>
                <p class="event-notes"></p>
            </div>

            <button class="delete-event" aria-label="Delete event">
                &times;
            </button>
        `;

        eventElement.querySelector("h3").textContent = event.title;
        eventElement.querySelector(".event-category").textContent =
            event.category;

        eventElement.querySelector(".event-notes").textContent =
            event.notes || "";

        eventElement.querySelector(".delete-event").addEventListener("click", () => {
            deleteEvent(event.id);
        });

        scheduleList.appendChild(eventElement);
    });
}

// ==========================================
// ADD EVENT
// ==========================================

function openEventDialog() {
    if (!eventDialog) return;

    if (eventDateInput) {
        eventDateInput.value = formatDate(selectedDate);
    }

    eventDialog.showModal();
}

function closeEventDialog() {
    if (eventDialog) {
        eventDialog.close();
    }
}

function addEvent(event) {
    event.preventDefault();

    const newEvent = {
        id: Date.now(),
        title: eventTitleInput.value.trim(),
        date: eventDateInput.value,
        time: eventTimeInput.value,
        category: eventCategoryInput.value,
        notes: eventNotesInput.value.trim()
    };

    if (!newEvent.title || !newEvent.date || !newEvent.time) {
        return;
    }

    events.push(newEvent);

    saveEvents();

    selectedDate = new Date(`${newEvent.date}T00:00:00`);
    currentDate = new Date(selectedDate);

    renderCalendar();
    renderSchedule();

    eventForm.reset();
    closeEventDialog();
}

// ==========================================
// DELETE EVENT
// ==========================================

function deleteEvent(eventId) {
    events = events.filter(event => event.id !== eventId);

    saveEvents();
    renderCalendar();
    renderSchedule();
}

// ==========================================
// CALENDAR NAVIGATION
// ==========================================

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    selectedDate = new Date();

    renderCalendar();
    renderSchedule();
}

// ==========================================
// PLACEHOLDER BUTTONS
// ==========================================

function showPlaceholderMessage(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("visible");

    setTimeout(() => {
        toast.classList.remove("visible");
    }, 2500);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

if (previousMonthButton) {
    previousMonthButton.addEventListener("click", () => {
        changeMonth(-1);
    });
}

if (nextMonthButton) {
    nextMonthButton.addEventListener("click", () => {
        changeMonth(1);
    });
}

if (todayButton) {
    todayButton.addEventListener("click", goToToday);
}

if (addEventButton) {
    addEventButton.addEventListener("click", openEventDialog);
}

if (closeDialogButton) {
    closeDialogButton.addEventListener("click", closeEventDialog);
}

if (cancelEventButton) {
    cancelEventButton.addEventListener("click", closeEventDialog);
}

if (eventForm) {
    eventForm.addEventListener("submit", addEvent);
}

// ==========================================
// INITIALIZATION
// ==========================================

renderCalendar();
renderSchedule();
