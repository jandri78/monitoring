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
//sendMsg($serverTime,  $a = system("top -b -n2 -d 1 | grep 'Cpu(s)' | awk '{print $2}'") );//works
sendMsg($serverTime,  $a = system("df -T -h /dev/mapper/centos-root | awk 'FNR>=2 { print $3,$4,$5,$6}' | tr '\n' ',' && top -b -n2 -d 1 | grep 'Cpu(s)' | awk '{print $2}' | tr '\n' ','") );//works

}, 1000);

