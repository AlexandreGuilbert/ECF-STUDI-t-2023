Connexion à la base de données :

<?php
$servername = "localhost";
$username = "nom_utilisateur";
$password = "mot_de_passe";
$dbname = "nom_base_de_donnees";

// Établir une connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connexion échouée : " . $conn->connect_error);
}
?>

Requêtes SQL :

<?php
// Exemple de fonction pour récupérer tous les plats du restaurant
function getAllPlats() {
    global $conn;
    $query = "SELECT * FROM plats";
    $result = $conn->query($query);
    $plats = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $plats[] = $row;
        }
    }
    return $plats;
}
?>



Transactions : 
<?php
// Exemple de fonction pour insérer un nouveau plat dans la base de données avec une transaction
function insertPlat($nom, $description, $prix) {
    global $conn;
    $conn->begin_transaction();
    try {
        $query = "INSERT INTO plats (nom, description, prix) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssi", $nom, $description, $prix);
        $stmt->execute();
        $conn->commit();
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
}
?>




