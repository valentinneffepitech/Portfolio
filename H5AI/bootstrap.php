<?php
class H5AI
{
    private $path;

    function __construct($path)
    {
        $this->path = $path;
        $this->tree = [];
        $this->getFiles($this->path);
    }

    function getPath()
    {
        return $this->path;
    }

    function getTree()
    {
        return $this->tree;
    }

    function getFiles($path)
    {
        $fileFolderList = scandir($path);
        if ($fileFolderList == false) {
            echo 'Le chemin semble erroné';
            return;
        } else {
            echo '<ul>';
            foreach ($fileFolderList as $fileFolder) {
                $newpath = realpath($path.'/'.$fileFolder);
                $newpath = explode('/', $newpath);
                for($c=1; $c<=3; $c++){
                    unset($newpath[$c]);
                }
                $newpath = implode('/', $newpath);
                if ($fileFolder != '.' && $fileFolder != '..' && $fileFolder != ".git") {
                    if (!is_dir($path.'/'.$fileFolder)) {
                        $extension = isset(pathinfo($path.'/'.$fileFolder)['extension'])? pathinfo($path.'/'.$fileFolder)['extension'] : "";
                        switch ($extension){
                            case ($extension == 'gif' || $extension == 'jpg' || $extension == 'jpeg' || $extension == 'png'):
                                $image = '<i class="fas fa-image" style="color: #ffffff;"></i>';
                                break;
                            case ($extension == 'mp3' || $extension == 'ogg'):
                                $image = '<i class="fas fa-volume-up" style="color: #ffffff;"></i>';
                                break;
                            case ($extension == 'mp4'):
                                $image = '<i class="far fa-video" style="color: #ffffff;"></i>';
                            break;
                            default:
                                $image = '<i class="fas fa-file-alt"></i>';
                                break;
                            
                        }
                        echo '<li>'.$image.'<a href="' . $newpath . '" data-long="'. getcwd() .'">' . $fileFolder . '</a>';
                    } else {
                        echo '<li data-directory="ok" class="directory"><i class="fa-solid fa-folder"><a href="' . $newpath . '" data-fold="' . $path . '/' . $fileFolder . '">' . $fileFolder . '</a></i>';
                        $this->getFiles($path . '/' . $fileFolder);
                    }
                    echo '</li>';
                }
            }
            echo '</ul>';
        }
    }
}

?>