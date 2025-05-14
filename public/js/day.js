 function openModal() {
            document.getElementById('taskModal').classList.add('show');
        }

        function closeModal() {
            document.getElementById('taskModal').classList.remove('show');
        }

        document.getElementById('taskForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const data = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                type: document.getElementById('type').value,
                date: document.getElementById('date').value
            };

            console.log("Tâche envoyée :", data);
            alert("Tâche ajoutée (simulé)");
            closeModal();
        });     