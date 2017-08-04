<?php
$a = system("df -T -h | awk 'FNR>=2 { print}' | tr '\n' ','");//works
//$a = system("df -T -h | awk 'FNR>=2 { print}'");//works

header('Content-Type: application/json; charset=utf-8');

echo $a;

//df -Ph | awk '/^\// {print $1"\t"$2"\t"$4}' | python -c 'import json, fileinput; print json.dumps({"diskarray":[dict(zip(("mount", "spacetotal", "spaceavail"), l.split())) for l in fileinput.input()]}, indent=2)'

?>
