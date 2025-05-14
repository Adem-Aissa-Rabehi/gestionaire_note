let currentDate = new Date(); // Date actuelle
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

        // Mise à jour du titre et de l'année sélectionnée
        monthYear.textContent = `${monthNames[month]} ${year}`;
        document.getElementById("yearSelect").value = year;

        calendar.innerHTML = ""; // Réinitialise la grille

        // En-tête des jours de la semaine
        const daysOfWeek = ["Dim", "Lun","Mar", "Mer", "Jeu", "Ven", "Sam" ];
        daysOfWeek.forEach(day => {
            const div = document.createElement("div");
            div.classList.add("day-header");
            div.textContent = day;
            calendar.appendChild(div);
        });

        // Calcul du décalage pour aligner le Dimanche
        const startDay = firstDay.getDay();
        const offset = (startDay + 6) % 7; // Dimanche premier jour

        for (let i = 0; i < offset; i++) {
            const emptyDiv = document.createElement("div");
            calendar.appendChild(emptyDiv);
        }

        // Remplissage des jours du mois
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

            // Clic sur un jour
            dayDiv.addEventListener("click", () => {
                openModal(fullDate);
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

    // Remplir les années dans le select
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

    // Changement d'année
    document.getElementById("yearSelect").addEventListener("change", function () {
        const year = parseInt(this.value);
        currentDate.setFullYear(year);
        renderCalendar(currentDate);
    });

   
    populateYears();
    renderCalendar(currentDate);

    // === Gestion du modal ===
    let selectedDate = "";

    function openModal(date) {
        selectedDate = date;
        document.getElementById("date").value = date;
        document.getElementById("taskModal").classList.add("show");
    }

    function closeModal() {
        document.getElementById("taskModal").classList.remove("show");
    }

    document.querySelector("#taskModal .close-btn").addEventListener("click", closeModal);

    document.getElementById("taskForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const data = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            type: document.getElementById("type").value,
            date: selectedDate
        };

        console.log("Nouvelle tâche :", data);
        alert("Tâche ajoutée (simulée)");
        closeModal();
    });