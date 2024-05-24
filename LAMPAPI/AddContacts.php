<?php
    $inData = getRequestInfo();
    
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        // Check if the contact already exists for the user
        $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE FirstName=? AND LastName=? AND Email=? AND UserID=?");
        $stmt->bind_param("sssi", $firstName, $lastName, $email, $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) 
        {
            returnWithError("Contact already exists");
        } 
        else 
        {
            $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
            if($stmt->execute())
            {
                returnWithError("Contact added successfully"); 
            }
            else
            {
                returnWithError($stmt->error);
            }
            $stmt->close();
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
?>
