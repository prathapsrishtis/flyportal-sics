<?php
include('connect.php');
extract($_REQUEST);
$result =   array();
if($status=='login'){
    $pass   =   md5($password);
   $userQry    =   mysql_query("select * from `tb_user` where `email`='$email' and `password`='$pass'") or die(mysql_error());

    if(mysql_num_rows($userQry)>0){
        $rows=  mysql_fetch_array($userQry);
        $result =   array(
            'status'    =>  'success',
            'user_id'        =>  $rows['userid']
        );
    }else{
        $result =   array(
            'status'    =>  'failed'
        );
    }

}

if($status=='users'){
    $date=  date("Y-m-d");
    $usersQry   =   mysql_query("select userid,email,password from `tb_user`") or die(mysql_error());

    while($rows  =   mysql_fetch_assoc($usersQry)){
        $result['users'][]   =   $rows;
    }


    $feedQuery  =   mysql_query("select f.date as time,f.title as username,f.image as image,f.content as feed from tb_feed f,tb_user u where u.userid=f.userid") or die(mysql_error());
    while($rows=    mysql_fetch_assoc($feedQuery)){
        $rows['feed']    =   substr($rows['feed'],0,500);
        $rows['username']    =   substr($rows['username'],0,150);
        $result['feeds'][] =  $rows;
    }
    $result['today'] = $date;
}

if($status=='register') {
    $date   =   date('Y-m-d');
    $pass   =   md5($password);
   // $userInsert = mysql_query("INSERT INTO `tb_user`(`date`, `username`, `email`, `password`, `name`, `profile_picture`, `company`, `designation`, `startdate`, `enddate`)VALUES ('$date','$username','$email','$password','$name','3.jpg','$company','$designation','$startdate','$enddate')") or die(mysql_error());
    $userInsert = mysql_query("INSERT INTO `tb_user`(`date`, `username`, `email`, `password`, `name`, `profile_picture`)VALUES ('$date','$username','$email','$pass','$name','3.jpg')") or die(mysql_error());
    $id =   mysql_insert_id();
    if($userInsert  ==1){
        $result =   array(
            'status'    =>  'success',
           'user_id'   =>  $id
        );
    }else{
        $result =   array(
            'status'    =>  'error'
        );
    }
}

echo json_encode($result);
?>