<?php

class reader{
    private $path;

    function __construct($path){
        $this->path = $path;
        $this->forsee($this->path);
    }

    function getPath(){
        return $this->path;
    }

    function forsee($path){
        $content = file_get_contents($path);
        echo $content;  
    }
}

$a = new reader($_GET['link']);