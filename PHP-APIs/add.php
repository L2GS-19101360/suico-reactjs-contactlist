<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include_once("db_connect.php");
$isValid = true;
$response = ["status" => 400, "message" => "Addition failed"];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get and decode JSON data from the request body
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if the required fields are present in the JSON data
    if (empty($data['fname']) || empty($data['lname']) || empty($data['emailAdd']) || empty($data['contactNum'])) {
        $isValid = false;
        $response["message"] = "All fields are required.";
    }

    // Check if email already exists
    if ($isValid) {
        $stmt = $con->prepare("SELECT * FROM contact WHERE email = ?");
        $stmt->bind_param("s", $data['emailAdd']);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows > 0) {
            $isValid = false;
            $response["message"] = "Email already exists.";
        }
    }

    // Insert records
    if ($isValid) {
        $stmt = $con->prepare("INSERT INTO contact (firstName, lastName, email, number) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $data['fname'], $data['lname'], $data['emailAdd'], $data['contactNum']);

        if ($stmt->execute()) {
            $response["status"] = 200;
            $response["message"] = "Contact added.";
            $response["data"] = mysqli_insert_id($con);
        } else {
            $response["message"] = "Error while inserting data.";
        }

        $stmt->close();
    }
}

header("Content-Type: application/json");
echo json_encode($response);
?>
