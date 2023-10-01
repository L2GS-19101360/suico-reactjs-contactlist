<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include_once("db_connect.php");

$status = 400;
$retVal = "Delete failed.";

// Check if 'id' is provided in the request as a URL parameter
if (isset($_GET["id"])) {
    $id = trim($_GET["id"]);

    try {
        $stmt = $con->prepare("DELETE FROM contact WHERE id = ?");
        $stmt->bind_param("i", $id); // Bind the 'id' as an integer
        $stmt->execute();
        $stmt->close();

        $status = 200;
        $retVal = "Contact deleted.";
    } catch (Exception $e) {
        $retVal = $e->getMessage();
    }
} else {
    $retVal = "No 'id' provided in the request.";
}

$myObj = array(
    "status" => $status,
    "message" => $retVal,
);

$myJSON = json_encode($myObj, JSON_FORCE_OBJECT);
echo $myJSON;
?>
