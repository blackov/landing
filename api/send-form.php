<?php
header('Content-Type: application/json');


$botToken = '8002578323:AAF62EBG0C0vEJYkRbp0a1WT_zhApjkfAXA';
$chatId = '1912862125';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name']) || !isset($data['phone']) || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Требуются все поля']);
    exit;
}

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$route = trim($data['route'] ?? '');
$guests = trim($data['guests'] ?? '');
$date = trim($data['date'] ?? '');

if (empty($name) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Заполните все обязательные поля']);
    exit;
}

$message = "<b>📋 Новая заявка на перевозку</b>\n\n" .
    "<b>👤 ФИО:</b> " . htmlspecialchars($name) . "\n" .
    "<b>📧 Email:</b> " . htmlspecialchars($email) . "\n" .
    "<b>📱 Телефон:</b> " . htmlspecialchars($phone) . "\n" .
    "<b>🗺️ Месторождение:</b> " . htmlspecialchars($route) . "\n" .
    "<b>👥 Количество человек:</b> " . htmlspecialchars($guests) . "\n" .
    "<b>📅 Дата:</b> " . htmlspecialchars($date) . "\n\n" .
    "<i>Отправлено через форму на сайте МестоТранс</i>";


$url = "https://api.telegram.org/bot{$botToken}/sendMessage";
$ch = curl_init();
curl_setopt_array($ch, array(
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ]),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10
));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $httpCode != 200) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Ошибка при отправке сообщения']);
    exit;
}

$result = json_decode($response, true);
echo json_encode(['ok' => $result['ok'] ?? false]);
?>
