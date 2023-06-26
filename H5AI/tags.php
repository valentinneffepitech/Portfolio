<?php

class tag{
    protected $tag;
    protected $url;

    function __construct($tag, $url){
        $this->tag = $tag;
        $this->url = $url;
        $this->pushTag();
    }

    function setPDO(){
        $db  = new PDO('mysql:host=localhost;dbname=H5AI', 'root', '');
        return $db;
    }

    function pushTag(){
        $db = $this->setPDO();
        $test = $db->prepare('select * from tags where name = :name and url = :url');
        $test->execute([
            'name'=>$this->tag,
            'url'=>$this->url
        ]);
        $bool = $test->fetch(PDO::FETCH_ASSOC);
        if (is_bool($bool)){
            $connect = $db->prepare('insert into tags (name, url) values (:tag, :url)');
            $connect->execute([
                'tag'=>$this->tag,
                'url'=>$this->url
            ]);
        } else {
            return;
        }
    }
}

$a =  new tag($_GET['tag'], $_GET['url']);