<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include_once("db_connect.php");

$response = array();
$status = 400;

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['id']) && isset($data['firstName']) && isset($data['lastName']) && isset($data['emailAdd']) && isset($data['contactNum']) && isset($data['curEmail'])){
    $id = intval($data['id']);
    $fname = trim($data['firstName']);
    $lname = trim($data['lastName']);
    $emailAdd = trim($data['emailAdd']);
    $contactNum = trim($data['contactNum']);
    $curEmail = trim($data['curEmail']);
    
    // Check if email already exists
    $stmt = $con->prepare("SELECT * FROM contact WHERE email = ? AND id != ?");
    $stmt->bind_param("si", $emailAdd, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    if($result->num_rows > 0){
        $response['status'] = 400;
        $response['message'] = "Edit failed. Email already exists.";
    } else {
        // Update records using prepared statement
        $stmt = $con->prepare("UPDATE contact SET firstName = ?, lastName = ?, email = ?, number = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $fname, $lname, $emailAdd, $contactNum, $id);

        if($stmt->execute()){
            $response['status'] = 200;
            $response['message'] = "Contact edited.";
        } else {
            $response['status'] = 400;
            $response['message'] = "Edit failed.";
        }

        $stmt->close();
    }
} else {
    $response['status'] = 400;
    $response['message'] = "Invalid data received.";
}

echo json_encode($response);
?>
