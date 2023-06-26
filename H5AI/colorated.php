<?php

class colored{
    protected $hex;
    protected $url;

    function __construct($hex, $url){
        $this->hex = $hex;
        $this->url = $url;
        $this->pushColor();
    }

    function setPDO(){
        $db  = new PDO('mysql:host=localhost;dbname=H5AI', 'root', '');
        return $db;
    }

    function pushColor(){
        $db = $this->setPDO();
        $connect = $db->prepare('insert into icons (color, url) values (:hex, :url)');
        $connect->execute([
            'hex'=>$this->hex,
            'url'=>$this->url
        ]);
    }
    
}

$a =  new colored($_POST['hex'], $_POST['url']);