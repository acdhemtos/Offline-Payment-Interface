<?php
 function sha256($s) {  
  return hash("sha256", $s);
 }
 function isValidHash($input) {
  return (strlen($input) === 64 && ctype_xdigit($input));
}

 
?>