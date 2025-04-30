<?php
header("Content-Type: text/html; charset=UTF-8");
// config
$host = 'localhost';
$db = 'opi';
$user = 'root';
$pass = ''; // Update with your actual DB password
$charset = 'utf8mb4';

// Set up DSN
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// PDO options
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

// Connect to DB
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// SQL query with joins for usernames
$sql = "
SELECT 
    t.id,
    COALESCE(s.username, '') AS sender_name,
    COALESCE(r.username, '') AS receiver_name,
    t.amount,
    CASE t.type 
        WHEN 1 THEN 'Online'
        WHEN 2 THEN 'Offline'
        ELSE 'Top UP'
    END AS type,
    t.time
FROM transactions t
LEFT JOIN users s ON t.sender = s.id
LEFT JOIN users r ON t.receiver = r.id
ORDER BY t.time DESC
";

$transactions = $pdo->query($sql)->fetchAll();

?>

<!DOCTYPE html>
<html>
<head>
    <title>Transactions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            background: #f9f9f9;
        }
        h2 {
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #f1f7ff;
        }
    </style>
</head>
<body>
    <h2>All Transactions</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($transactions as $t): ?>
                <tr>
                    <td><?= htmlspecialchars($t['id']) ?></td>
                    <td><?= htmlspecialchars($t['sender_name']) ?></td>
                    <td><?= htmlspecialchars($t['receiver_name']) ?></td>
                    <td><?= number_format($t['amount']/100) ?></td>
                    <td><?= htmlspecialchars($t['type']) ?></td>
                    <td><?= htmlspecialchars($t['time']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
