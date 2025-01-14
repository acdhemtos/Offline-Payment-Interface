<?php
  
 $servername = "localhost";
 $username = "root";
 $password = "";
 $dbname = "opi";

 $GLOBALS['conn'] = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
 $GLOBALS['conn']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>
