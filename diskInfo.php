<?php
$a = system("df -T -h | awk 'FNR>=2 { print}' | tr '\n' ','");//works
//$a = system("df -T -h | awk 'FNR>=2 { print}'");//works

header('Content-Type: application/json; charset=utf-8');

echo $a;

?>