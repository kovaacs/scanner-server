<?php
$file_name = exec("python3 scanner.py --mode={$_POST['mode']} --resolution={$_POST['resolution']} --compression={$_POST['compression']}");
$Obj->file_name = $file_name;
echo json_encode($Obj, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK);
?>