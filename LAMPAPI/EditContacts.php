<?php
$inData = getRequestInfo();

$ID = $inData["ID"];
$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$phone = $inData["Phone"];
$email = $inData["Email"];
$userId = $inData["UserId"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=? AND UserID=?");
    $stmt->bind_param("ii", $ID, $userId); // Corrected variable name here
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0)
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
        $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $ID, $userId);
        $stmt->execute();

        if ($stmt->affected_rows > 0)
        {
            returnWithSuccess("Contact info updated");
        }
        else
        {
            returnWithError("No changes were made.");
        }

        $stmt->close();
    }
    else
    {
        returnWithError("Contact not found.");
    }

    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}


function returnWithSuccess($msg)
{
    $retValue = '{"success":"' . $msg . '"}';
    sendResultInfoAsJson($retValue);
}
?>
