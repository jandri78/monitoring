<?php

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache'); 
header('Connection: keep-alive');
/**
 * Constructs the SSE data format and flushes that data to the client.
 *
 * @param string $id
 *          Timestamp/id of this connection.
 * @param string $msg
 *          Line of text that should be transmitted.
 */


function setInterval($f, $milliseconds)
{
    $seconds=(int)$milliseconds/1000;

    while(true)
    {
        $f();
        sleep($seconds);
    }
}


function sendMsg($id, $msg)
{
  echo "id: $id", PHP_EOL;
  echo "data: $msg", PHP_EOL;
  echo "retry: 5000", PHP_EOL, PHP_EOL;
  ob_flush();
  flush();
  ob_end_flush();
}





setInterval(function() {


$serverTime = time();
//$trimmed = rtrim($text, " \t.");

/*
 $a = system('top -b | grep %Cpu');
 $b = system('top -b | grep top');
 $c = system('top -b | grep Task');
 $d = system('top -b | grep Mem');

$x = "{top:'".$a."', cpu:'".$b."'}";
*/
//sendMsg($serverTime,  $a = system('top -b | egrep "%Cpu|Mem|Task|top" | tr "\t\r\n" ";" ') );//works

//sendMsg($serverTime,  $a = system('top -b | egrep "%Cpu|Mem|Task|top" | tr "\t\r\n" ";"') );
 
//sendMsg($serverTime,  system('top -b | head | egrep "%Cpu|Mem|Task|Top"') );

//sendMsg($serverTime,  $x );

//sendMsg($serverTime,  $a = system('top -b | head -4 | tr -d "\t\n\r" ') );//works

sendMsg($serverTime,  $a = system('top -b -n 2 | head -4 | tr  "\t\n\r" ";"') );//works


}, 1000);

