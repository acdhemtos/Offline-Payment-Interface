<?php
  
 $GLOBALS['conn'] = new PDO("mysql:host=localhost;dbname=opi", "root", "");
 $GLOBALS['conn']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>
