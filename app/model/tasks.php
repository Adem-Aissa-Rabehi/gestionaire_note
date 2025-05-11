<?php


require_once '..\config\database.php';

class Note {
    private $pdo;
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function recupnote() {
        $stmt = $this->pdo->query("SELECT * FROM notes ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function recup($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM notes WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function creenote($title, $content) {
        $stmt = $this->pdo->prepare("INSERT INTO notes (title, content) VALUES (?, ?)");
        return $stmt->execute([$title, $content]);
    }

    public function updatenote($id, $title, $content) {
        $stmt = $this->pdo->prepare("UPDATE notes SET title = ?, content = ? WHERE id = ?");
        return $stmt->execute([$title, $content, $id]);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM notes WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
