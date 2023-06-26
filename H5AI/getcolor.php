<?php

class getcolor{

    function __construct(){
        $this->getColor();
    }

    function setPDO(){
        $db  = new PDO('mysql:host=localhost;dbname=H5AI', 'root', '');
        return $db;
    }

    function getColor(){
        $db = $this->setPDO();
        $connect = $db->prepare('select * from icons');
        $connect->execute([]);
        $fetch = $connect->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($fetch);
    }
}

$a =  new getcolor();