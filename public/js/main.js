// ========== VARIABLES GLOBALES ==========
let currentDate = new Date(); // Date actuelle
let currentView = "mensuel";  // Vue par défaut
let displayedWeekStart = getStartOfWeek(new Date()); // Semaine en cours
let displayedYearAnnual = currentDate.getFullYear(); // Année centrale en vue annuelle

const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const dayNamesShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// ========== INITIALISATION ==========
document.addEventListener("DOMContentLoaded", () => {
    populateYears();
    renderCalendar(currentDate);
    closeSidebar();

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const view = this.getAttribute('data-view');
            changeCalendarView(view);
        });
    });

    document.getElementById("taskForm").addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Tâche simulée");
        closeModal();
    });
});

// ========== CALENDRIER MENSUEL ==========
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");

    calendar.innerHTML = "";
    calendar.style.display = "grid";

    dayNamesShort.forEach(day => {
        const div = document.createElement("div");
        div.classList.add("day-header");
        div.textContent = day;
        calendar.appendChild(div);
    });

    const startDay = firstDay.getDay();
    const offset = startDay;

    for (let i = 0; i < offset; i++) {
        const emptyDiv = document.createElement("div");
        calendar.appendChild(emptyDiv);
    }

    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayDiv.setAttribute("data-date", fullDate);

        const dayNumber = document.createElement("div");
        dayNumber.classList.add("day-number");

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayNumber.classList.add("today");
        }

        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);
        calendar.appendChild(dayDiv);

        dayDiv.addEventListener("click", () => showSidebar(fullDate));
        updateCalendarWithTasks();
    }
}

// ========== VUE HEBDOMADAIRE ==========
function renderWeeklyCalendar(date) {
    const startOfWeek = getStartOfWeek(date);
    const days = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        days.push(currentDate);
    }

    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");

    calendar.innerHTML = "";
    calendar.style.display = "grid";

    const firstDay = days[0];
    const lastDay = days[6];
    monthYear.textContent = `Semaine du ${formatDate(firstDay)} au ${formatDate(lastDay)}`;

    dayNamesShort.forEach(day => {
        const header = document.createElement("div");
        header.classList.add("day-header");
        header.textContent = day;
        calendar.appendChild(header);
    });

    days.forEach((day, index) => {
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        const fullDate = formatDateForInput(day);
        dayDiv.setAttribute("data-date", fullDate);

        const dayNumber = document.createElement("div");
        dayNumber.classList.add("day-number");
        dayNumber.textContent = day.getDate();

        if (isToday(day)) {
            dayNumber.classList.add("today");
        }

        dayDiv.appendChild(dayNumber);
        calendar.appendChild(dayDiv);

        dayDiv.addEventListener("click", () => showSidebar(fullDate));
    });
}

// ========== VUE ANNUELLE ==========
function renderAnnualCalendar(yearCenter = displayedYearAnnual) {
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");

    calendar.innerHTML = "";
    calendar.style.display = "flex";
    calendar.classList.add("annual-calendar");

    const yearRow = document.createElement("div");
    yearRow.classList.add("year-row");

    for (let y = yearCenter - 0; y <= yearCenter + 4; y++) {
        const yearDiv = document.createElement("div");
        yearDiv.classList.add("year-view");
        yearDiv.setAttribute("data-year", y);

        const title = document.createElement("h3");
        title.textContent = y;
        yearDiv.appendChild(title);

        const monthGrid = document.createElement("div");
        monthGrid.classList.add("annual-month-grid");

        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jui", "Jui", "Aou", "Sep", "Oct", "Nov", "Déc"];
        months.forEach((monthName, monthIndex) => {
            const monthDiv = document.createElement("div");
            monthDiv.classList.add("annual-month");
            monthDiv.textContent = monthName;

            monthDiv.addEventListener("click", () => {
                currentDate.setFullYear(y);
                currentDate.setMonth(monthIndex);
                changeCalendarView("mensuel");
                renderCalendar(currentDate);
            });

            monthGrid.appendChild(monthDiv);
        });

        yearDiv.appendChild(monthGrid);
        yearRow.appendChild(yearDiv);
    }

    calendar.appendChild(yearRow);
    monthYear.textContent = `Année ${yearCenter}`;
}

// ========== FONCTIONS DE DATE ==========

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
}

function isToday(date) {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('fr-FR', options);
}

function formatDateFr(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

// ========== NAVIGATION ENTRE VUES ==========

window.prevMonth = function () {
    if (currentView === "mensuel") {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    } else if (currentView === "hebdomadaire") {
        displayedWeekStart.setDate(displayedWeekStart.getDate() - 7);
        renderWeeklyCalendar(displayedWeekStart);
    } else if (currentView === "annuel") {
        displayedYearAnnual -= 3;
        renderAnnualCalendar(displayedYearAnnual);
    }
};

window.nextMonth = function () {
    if (currentView === "mensuel") {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    } else if (currentView === "hebdomadaire") {
        displayedWeekStart.setDate(displayedWeekStart.getDate() + 7);
        renderWeeklyCalendar(displayedWeekStart);
    } else if (currentView === "annuel") {
        displayedYearAnnual += 5;
        renderAnnualCalendar(displayedYearAnnual);
    }
};

window.goToToday = function () {
    const today = new Date();

    if (currentView === "mensuel") {
        currentDate = new Date();
        renderCalendar(currentDate);
    } else if (currentView === "hebdomadaire") {
        displayedWeekStart = getStartOfWeek(today);
        renderWeeklyCalendar(displayedWeekStart);
    } else if (currentView === "annuel") {
        displayedYearAnnual = today.getFullYear();
        renderAnnualCalendar(displayedYearAnnual);
    }
};

// ========== CHANGEMENT DE VUE ==========

window.changeCalendarView = function (view) {
    currentView = view;

    const calendar = document.getElementById("calendar");
    calendar.style.display = "";

    if (view === "mensuel") {
        renderCalendar(currentDate);
    } else if (view === "hebdomadaire") {
        displayedWeekStart = getStartOfWeek(new Date());
        renderWeeklyCalendar(displayedWeekStart);
    } else if (view === "annuel") {
        displayedYearAnnual = parseInt(document.getElementById("yearSelect").value) || new Date().getFullYear();
        renderAnnualCalendar(displayedYearAnnual);
    }
};

// ========== ANNÉE DANS LE HEADER ==========

function populateYears() {
    const yearSelect = document.getElementById("yearSelect");
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 50; y <= currentYear + 50; y++) {
        const option = document.createElement("option");
        option.value = y;
        option.text = y;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
}

document.getElementById("yearSelect").addEventListener("change", function () {
    const year = parseInt(this.value);

    if (currentView === "mensuel" || currentView === "hebdomadaire") {
        currentDate.setFullYear(year);
        if (currentView === "mensuel") {
            renderCalendar(currentDate);
        } else {
            displayedWeekStart = getStartOfWeek(currentDate);
            renderWeeklyCalendar(displayedWeekStart);
        }
    } else if (currentView === "annuel") {
        displayedYearAnnual = year;
        renderAnnualCalendar(displayedYearAnnual);
    }
});

// ========== SIDEBAR LOGIQUE ==========

let selectedDate = '';

// Simule une base de données locale (sera remplacée par AJAX plus tard)
let tasks = [{
        id: 1,
        title: "Réunion",
        description: "Réunion avec l'équipe",
        type: "quotidienne",
        date: "2025-05-15"
    },
    {
        id: 2,
        title: "Appel client",
        description: "Appel à 15h",
        type: "unique",
        date: "2025-04-05"
    }];

function showSidebar(date) {
    selectedDate = date;
    const sidebar = document.getElementById("taskSidebar");
    const title = document.getElementById("selectedDateTitle");
    const taskList = document.getElementById("taskList");

    title.textContent = formatDateFr(date);
    taskList.innerHTML = "";

    // Filtrer les tâches pour cette date
    const todayTasks = tasks.filter(t => t.date === date);

    if (todayTasks.length === 0) {
        const empty = document.createElement("li");
        empty.style.textAlign = "center";
        empty.style.marginTop = "1rem";
        empty.textContent = "Aucune tâche";
        taskList.appendChild(empty);
    } else {
        todayTasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.add("task-item", task.type);
            li.textContent = task.title;

            li.addEventListener("click", () => openDetailsModal(task));
            taskList.appendChild(li);
        });
    }

    sidebar.classList.add("open");
}

let currentTask = null;

function openDetailsModal(task) {
    currentTask = task;

    document.getElementById("editTaskId").value = task.id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description;
    document.getElementById("editType").value = task.type;

    document.getElementById("taskDetailsModal").classList.add("show");
}

function closeDetailsModal() {
    document.getElementById("taskDetailsModal").classList.remove("show");
    currentTask = null;
}

function deleteTask() {
    if (!currentTask) return;

    if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
        tasks = tasks.filter(t => t.id !== currentTask.id);
        closeDetailsModal();
        updateCalendarWithTasks(); // Réaffiche les tâches
        alert("Tâche supprimée (simulé)");
    }
}

document.getElementById("taskDetailsForm").addEventListener("submit", function(e) {
    e.preventDefault();

    if (!currentTask) return;

    // Met à jour les champs
    currentTask.title = document.getElementById("editTitle").value;
    currentTask.description = document.getElementById("editDescription").value;
    currentTask.type = document.getElementById("editType").value;

    // Sauvegarde simulée
    const index = tasks.findIndex(t => t.id === currentTask.id);
    tasks[index] = currentTask;

    closeDetailsModal();
    updateCalendarWithTasks(); // Rafraîchit l'affichage
    alert("Tâche mise à jour (simulée)");
});

function updateCalendarWithTasks() {
    document.querySelectorAll(".day").forEach(day => {
        const date = day.getAttribute("data-date");
        const hasTasks = tasks.some(t => t.date === date);
        day.classList.toggle("has-tasks", hasTasks);
    });
}

function closeSidebar() {
    document.getElementById("taskSidebar").classList.remove("open");
}

function openModal() {
    if (!selectedDate) return;
    document.getElementById("date").value = selectedDate;
    document.getElementById("taskModal").classList.add("show");
}

function closeModal() {
    document.getElementById("taskModal").classList.remove("show");
}

// ========== EXPORT POUR HTML ==========
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.goToToday = goToToday;
window.changeCalendarView = changeCalendarView;
window.closeSidebar = closeSidebar;
window.openModal = openModal;
window.closeModal = closeModal;
window.showSidebar = showSidebar;