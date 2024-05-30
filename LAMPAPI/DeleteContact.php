<?php
    // Retrieve input data
    $inData = getRequestInfo();

    // Extract contact ID from input data
    $userId = $inData["userId"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];

    // Connect to the database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        // Return with error if connection fails
        returnWithError($conn->connect_error);
    } 
    else
    {
        // Prepare SQL statement to delete contact by UserID, FirstName, and LastName to ensure security
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID = ? AND FirstName = ? AND LastName = ?");
        $stmt->bind_param("iss", $userId, $firstName, $lastName);
        
        // Execute the statement
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            // If deletion successful, close the statement and connection
            $stmt->close();
            $conn->close();
            // Return success message
            returnWithInfo("Contact deleted successfully.");
        } else {
            // If no rows affected, it means the contact does not exist or does not belong to the user
            $stmt->close();
            $conn->close();
            returnWithError("No contact found or you don't have permission to delete this contact.");
        }

    }

    // Function to retrieve request information
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    // Function to send result info as JSON
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    // Function to return error message
    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($info)
    {
        $retValue = '{"info":"' . $info . '"}';
        sendResultInfoAsJson($retValue);
    }

?>
