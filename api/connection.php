<?php
  
 $servername = "localhost";
 $username = $password = $dbname = "pp";

 $GLOBALS['conn'] = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
 $GLOBALS['conn']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>
