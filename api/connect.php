<?php
$con = mysql_connect("localhost", "root", "Polo#321");
mysql_select_db("flyportal") or die(mysql_error());
if( function_exists('mysql_set_charset') ){
    mysql_set_charset('utf8', $con);
}else{
    mysql_query("SET NAMES 'utf8'", $con);
}
?>