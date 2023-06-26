<?php

class favicon{
    private $path;

    function __construct($path){
        $this->path = $path;
        $this->getIcon($this->path);
    }

    function getPath(){
        return $this->path;
    }

    function getIcon($path){
        $doc = new DOMDocument();
        $doc->strictErrorChecking = FALSE;
        $doc->loadHTML(file_get_contents($path));
        $xml = simplexml_import_dom($doc);
        $arr = $xml->xpath('//link[@attributes="shortcut icon"]');
        // var_dump($arr);
    }
}

$a = new favicon('./prout/CV/CV.html');