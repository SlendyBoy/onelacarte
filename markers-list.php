<?php

function parseToXML($htmlStr)
{
	$xmlStr=str_replace('<','&lt;',$htmlStr);
	$xmlStr=str_replace('>','&gt;',$xmlStr);
	$xmlStr=str_replace('"','&quot;',$xmlStr);
	$xmlStr=str_replace("'",'&#39;',$xmlStr);
	$xmlStr=str_replace("&",'&amp;',$xmlStr);
	return $xmlStr;
}


function connectDb(){
	$host="localhost";
	$username="root";
	$password="8F42SL382ARbNUmo";
	$database="maps";
	$bdd = new PDO('mysql:host='.$host.';dbname='.$database.';charset=utf8',$username,$password);
	return $bdd;
}



function getMarkers(){
	$bdd = connectDb();
	$markers = $bdd->prepare("SELECT * FROM markers");
	$markers->execute();
	return $markers;
}
//Set content-type header for XML 
header("Content-type: text/xml");
// Start XML file, echo parent node
echo '<?xml version="1.0" ?>';
echo '<markers>';

// Iterate through the rows, printing XML nodes for each
foreach(getMarkers() as $row){
	// Add to XML document node
	echo '<marker ';
	echo 'id="' . $row['id'] . '" ';
	echo 'name="' . parseToXML($row['name']) . '" ';
	echo 'description="' . parseToXML($row['description']) . '" ';
	echo 'address="' . parseToXML($row['address']) . '" ';
	echo 'lat="' . $row['lat'] . '" ';
	echo 'lng="' . $row['lng'] . '" ';
	echo 'type="' . $row['type'] . '" ';
	echo 'image="' . $row['image'] . '" ';
	echo '/>';
}

// End XML file
echo '</markers>';
?>

