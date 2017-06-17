<?php
$blobdata = '';

if (($inputhandle = popen("python3 scanner.py --mode={$_POST['mode']} --resolution={$_POST['resolution']} --compression={$_POST['compression']}", "r")))
    {
    while (!feof($inputhandle))
        {
        $blobdata.= fread($inputhandle, 8192);
        }
    }

fclose($inputhandle);
$out = fopen("php://output", "w");
header("Content-Type: application/pdf");
header('Content-Disposition: attachment');
fwrite($out, $blobdata);
fclose($out);
?>