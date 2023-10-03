<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include_once("db_connect.php");
$status = 200;
$data = array();
$count = 0;

try {
    $stmt = $con->prepare("SELECT * FROM contact ORDER BY lastName");
    $stmt->execute();
    $result = $stmt->get_result();
    $count = $result->num_rows;
    $stmt->close();

    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }

    $myObj = array(
        'status' => $status,
        'data' => $data,
        'count' => $count
    );

    $myJSON = json_encode($myObj, JSON_FORCE_OBJECT);
    echo $myJSON;
} catch (Exception $e) {
    // Log the error and return an error response
    error_log("Error in PHP script: " . $e->getMessage());
    $errorObj = array('status' => 500, 'error' => 'Internal Server Error');
    echo json_encode($errorObj);
}
?>
