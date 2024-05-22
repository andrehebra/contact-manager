<?php
    // Retrieve input data
	$inData = getRequestInfo();
	
	// Extract user information from input data
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$login = $inData["Login"];
	$password = $inData["Password"];

	// Connect to the database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		// If connection fails, return error
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Check if the username already exists
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            // Username already exists
            $stmt->close();
            $conn->close();
            returnWithError("Username already taken.");
		} else{
			// Prepare SQL statement to insert user data into the Users table
			$stmt = $conn->prepare("INSERT INTO Users (DateCreated, DateLastLoggedIn, FirstName, LastName, Login, Password) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
		
			// Execute the statement
			if ($stmt->execute()) {
				// If insertion successful, close the statement and connection
				$stmt->close();
				$conn->close();
				// Return success message
				returnWithInfo("user created");
			} else {
				// If insertion fails, return error
				returnWithError("Failed to register user.");
			}
		}
	}

	// Function to retrieve request information
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// Function to send result info as JSON
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// Function to return error message
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	// Function to return success message
    function returnWithInfo( $info )
    {
        $retValue = '{"info":"' . $info . '"}';
        sendResultInfoAsJson( $retValue );
    }
	
?>
