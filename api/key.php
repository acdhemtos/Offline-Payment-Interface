<?php

 const $characters =  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[]{}|;:,.<>?';
 const $length = 20;
 
 function generateKey() {
  global $characters;
  global $length;
  $charactersLength = strlen($characters);
  $randomString = '';
  for ($i = 0; $i < $length; $i++) {
      $randomString .= $characters[rand(0, $charactersLength - 1)];
  }
  return $randomString;
 }
 
 function validKey($key) {
  global $characters;
  global $length;
  
  if (strlen($input) !== $length) { return false; }
  $pattern = '/^[' . preg_quote($characters, '/') . ']{' . $length . '}$/';
  return preg_match($pattern, $input) === 1;
}
 }

?>