<?php

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    // Prepare the search query
    $stmt = $conn->prepare("SELECT SQL_CALC_FOUND_ROWS * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=? LIMIT ? OFFSET ?");
    $searchQuery = "%" . $inData["search"] . "%";
    
    // Calculate the limit and offset
    $page = isset($inData["page"]) ? $inData["page"] : 1;
    $pageSize = isset($inData["pageSize"]) ? $inData["pageSize"] : 10;
    $offset = ($page - 1) * $pageSize;
    
    $stmt->bind_param("ssssiii", $searchQuery, $searchQuery, $searchQuery, $searchQuery, $inData["userId"], $pageSize, $offset);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    while ($row = $result->fetch_assoc())
    {
        if ($searchCount > 0)
        {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"ID":' . $row["ID"] . ',"FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Phone":"' . $row["Phone"] . '","Email":"' . $row["Email"] . '"}';
    }
    
    // Get the total number of results
    $resultTotal = $conn->query("SELECT FOUND_ROWS() as total");
    $rowTotal = $resultTotal->fetch_assoc();
    $totalResults = $rowTotal['total'];
    
    if ($searchCount == 0)
    {
        returnWithError("No Records Found");
    }
    else
    {
        returnWithInfo($searchResults, $totalResults);
    }
    
    $stmt->close();
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
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults, $totalResults)
{
    $retValue = '{"results":[' . $searchResults . '],"totalResults":' . $totalResults . ',"error":"Search Completed"}';
    sendResultInfoAsJson($retValue);
}

?>
