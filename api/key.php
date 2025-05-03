<?php

 const characters =  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
 const length = 20;
 
 function generateKey() {
  $charactersLength = strlen(characters);
  $randomString = '';
  for ($i = 0; $i < length; $i++) {
      $randomString .= characters[rand(0, $charactersLength - 1)];
  }
  return $randomString;
 }
 
 function validKey($key) {
  if (strlen($key) !== length) { return false; }
  $pattern = '/^[' . preg_quote(characters, '/') . ']{' . length . '}$/';
  return preg_match($pattern, $key) === 1;
 }

?>