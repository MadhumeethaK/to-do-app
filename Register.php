<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'sql312.ezyro.com';
$db   = 'ezyro_40184595_TaskRelaxMate';
$user = 'ezyro_40184595';
$pass = ''; // Replace with your actual password
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'];
    
    // Check if username already exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user) {
        echo json_encode(['success' => false, 'message' => 'Username already exists']);
    } else {
        // Create new user
        $stmt = $pdo->prepare('INSERT INTO users (username, created_at) VALUES (?, NOW())');
        $stmt->execute([$username]);
        $userId = $pdo->lastInsertId();
        
        echo json_encode(['success' => true, 'userId' => $userId, 'username' => $username]);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
