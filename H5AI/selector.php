<?php

class selectag{
    private $element;

    function __construct($element){
        $this->element = $element;
        $this->look();
    }

    function setPDO(){
        $db  = new PDO('mysql:host=localhost;dbname=H5AI', 'root', '');
        return $db;
    }

    function look(){
        $db = $this->setPDO();
        $connect = $db->prepare('select * from tags where name = :name');
        $connect->execute([
            'name' => $this->element
        ]);
        $fetch = $connect->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($fetch);
    }
}

$a = new selectag($_GET['name']);