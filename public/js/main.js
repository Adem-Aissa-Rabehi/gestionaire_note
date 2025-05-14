let currentDate = new Date();
const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");

    // Mise à jour du titre et année
    monthYear.textContent = `${monthNames[month]} ${year}`;
    document.getElementById("yearSelect").value = year;

    calendar.innerHTML = "";

    const daysOfWeek = ["Dim","Lun", "Mar", "Mer", "Jeu", "Ven", "Sam" ];
    daysOfWeek.forEach(day => {
        const div = document.createElement("div");
        div.classList.add("day-header");
        div.textContent = day;
        calendar.appendChild(div);
    });

    const startDay = firstDay.getDay();
    const offset = (startDay + 6) % 7;

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

        dayDiv.addEventListener("click", () => {
            showSidebar(fullDate);
        });
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
}

function goToToday() {
    currentDate = new Date();
    renderCalendar(currentDate);
}

function populateYears() {
    const yearSelect = document.getElementById("yearSelect");
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 50; y <= currentYear + 50; y++) {
        const option = document.createElement("option");
        option.value = y;
        option.text = y;
        yearSelect.appendChild(option);
    }
}

document.getElementById("yearSelect").addEventListener("change", function () {
    const year = parseInt(this.value);
    currentDate.setFullYear(year);
    renderCalendar(currentDate);
});

// === Sidebar logic ===

let selectedDate = '';

function showSidebar(date) {
    selectedDate = date;
    const sidebar = document.getElementById("taskSidebar");
    const title = document.getElementById("selectedDateTitle");
    const taskList = document.getElementById("taskList");

    title.textContent = formatDateFr(date);
    taskList.innerHTML = ""; // Liste des tâches vide

    sidebar.classList.add("open"); // Ouvre la sidebar
}

function closeSidebar() {
    document.getElementById("taskSidebar").classList.remove("open"); // Ferme la sidebar
}

function openModal() {
    if (!selectedDate) return;

    document.getElementById("date").value = selectedDate;
    document.getElementById("taskModal").classList.add("show");
}

function closeModal() {
    document.getElementById("taskModal").classList.remove("show");
}

function formatDateFr(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

// Initialisation
populateYears();
renderCalendar(currentDate);
closeSidebar(); // Sidebar fermée au départ