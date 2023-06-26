<?php

class gettag{

    function __construct(){
        $this->getTag();
    }

    function setPDO(){
        $db  = new PDO('mysql:host=localhost;dbname=H5AI', 'root', '');
        return $db;
    }

    function getTag(){
        $db = $this->setPDO();
        $connect = $db->prepare('select * from tags group by name');
        $connect->execute([]);
        $fetch = $connect->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($fetch);
    }
}

$a =  new gettag();