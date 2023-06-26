<?php

class content
{
    private $path;

    function __construct($path)
    {
        $this->path = $path;
    }

    function getpath()
    {
        return $this->path;
    }

    function returninfo()
    {
        $path = $this->path;
        if (!is_dir($path)) {
            $tab[] = [
                'img' => "folder.png",
                'name' => 'Mauvais Chemin',
                'path' => $path,
                'icon' => '<i class="fa-solid fa-folder" style="color: #ffffff;"></i>'
            ];
        } else {
            $fileFolderList = scandir($path);
            $path .= '/';
            $tab = [];
            foreach ($fileFolderList as $fileFolder) {
                $newpath = realpath($path . '/' . $fileFolder);
                $newpath = explode('/', $newpath);
                for ($c = 1; $c <= 3; $c++) {
                    unset($newpath[$c]);
                }
                $newpath = implode('/', $newpath);
                if ($fileFolder != '.') {
                    if ($fileFolder == "..") {
                        $tab[] = [
                            'img' => "folder.png",
                            'name' => $fileFolder,
                            'path' => $newpath,
                            'fullpath' => realpath($path . '/' . $fileFolder),
                            'icon' => '<i class="fa-solid fa-folder" style="color: #ffffff;"></i>',
                            'isdir' => 'true'
                        ];
                    } elseif (is_dir($path . $fileFolder) && ($path . $fileFolder != '.git')) {
                        $currentTime = stat($path . $fileFolder)['mtime'];
                        $tab[] = [
                            'img' => "folder.png",
                            'name' => $fileFolder,
                            'path' => $newpath,
                            'fullpath' => realpath($path . '/' . $fileFolder),
                            'icon' => '<i class="fa-solid fa-folder" style="color: #ffffff;"></i>',
                            'lastmodified' => $currentTime,
                            'isdir' => 'true',
                            'size' => filesize($path . $fileFolder)
                        ];
                    } elseif ($path . $fileFolder != '.git') {
                        $currentTime = stat($path . $fileFolder)['mtime'];
                        $extension = pathinfo($path . $fileFolder)['extension'];
                        switch ($extension) {
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
                                $image = '<i class="fas fa-file-alt" style="color: #ffffff;"></i>';
                                break;
                        }
                        $tab[] = [
                            'img' => "file.png",
                            'extension' => $extension,
                            'name' => $fileFolder,
                            'icon' => $image,
                            'fullpath' => realpath($path . '/' . $fileFolder),
                            'lastmodified' => $currentTime,
                            'path' => $path,
                            'size' => filesize($path . $fileFolder)
                        ];
                    }
                }
            }
            echo json_encode($tab);
        }
    }
}

if (isset($_GET['path'])) {
    if ($_GET['path'] != "") {
        $_GET['path'] = $_GET['path'];
    } else {
        $_GET['path'] = '.';
    }
} else {
    $_GET['path'] = '.';
}

$a = new content($_GET['path'])

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <base href="http://localhost/W-PHP-501-STG-1-1-myh5ai-valentin.neff/">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/W-PHP-501-STG-1-1-myh5ai-valentin.neff/style.css">
    <script src="https://kit.fontawesome.com/bee08cb3dc.js" crossorigin="anonymous"></script>
    <title>Index H5AI</title>
</head>

<body>
    <h1>H5AI</h1>
    <input type="text" id="searchbar" placeholder="Rechercher un fichier/dossier">
    <select name="select_tag" id="select_tag">
    </select>
    <main>
        <div id="menu">
            <ul>
                <li data-directory="." class="directory"><a href="http://localhost/W-PHP-501-STG-1-1-myh5ai-valentin.neff/" data-fold="."><i class="fa-solid fa-folder">H5AI</i></a></li>
            </ul>
            <?php
            include('/opt/lampp/htdocs/W-PHP-501-STG-1-1-myh5ai-valentin.neff/bootstrap.php');
            $b = new H5AI('.');
            ?>
        </div>
        <div id="results">
        </div>
        <div id="preview">

        </div>
    </main>
    <script>
        let display = document.querySelector('#preview');
        let select = document.querySelector('#select_tag');

        function adapt(sorting = 'name') {
            let effect = <?php $a->returninfo();?>;
            let reponse = effect;
            switch (sorting) {
                case 'name':
                    reponse = reponse.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        }
                        return 1;
                    });
                    break;
                case 'lastmodified':
                    reponse = reponse.sort((a, b) => {
                        if (a.lastmodified < b.lastmodified) {
                            return -1;
                        }
                        return 1;
                    });
                    break;
                case 'size': {
                    reponse = reponse.sort((a, b) => {
                        if (a.size < b.size) {
                            return -1;
                        }
                        return 1;
                    });
                    break;
                }
            }
            let result = document.querySelector('#results');
            let header = '<table><thead><tr><th id="title_name" class="title">Nom du fichier</th><th id="title_date" class="title">Dernière modification:</th><th id="title_size" class="title">Taille</th></tr></thead><tbody>'
            result.innerHTML = '';
            effect.forEach(element => {
                if (element.isdir === 'true' && !element.path.includes('../')) {
                    let div = '<tr class="result"><td class="name"><a href="' + element.path + '" title="' + element.fullpath + '">' + element.icon + element.name + '</a></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                    header += div;
                } else if (element.path.includes('../')) {
                    let div = '<tr class="result"><td class="name"><a href="' + element.path + '" title="' + element.fullpath + '">' + element.icon + element.name + '</a></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                    header += div;
                } else {
                    let div = '<tr class="result"><td class="name">' + element.icon + '<span data-extend="' + element.extension + '" data-link="' + element.path + element.name + '" title="' + element.fullpath + '" data-full="' + element.fullpath + '">' + element.name + '</span></td><td class="date">' + element.lastmodified + '</td><td class="size">' + element.size + '</td></tr>';
                    header += div;
                }
            })

            header += '</tbody></table>'
            result.innerHTML = header;
            sort();
            convert();
            datecover();
            searchbar();
            openfile();
            selecttag();
            colorize();
        }

        function sort() {
            let nameTitle = document.querySelector('#title_name'),
                sizeTitle = document.querySelector('#title_size'),
                dateTitle = document.querySelector('#title_date');

            nameTitle.onclick = () => {
                adapt('name');
            }

            sizeTitle.onclick = () => {
                adapt('size');
            }

            dateTitle.onclick = () => {
                adapt('lastmodified');
            }
        }

        function preview(data, extension) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'reader.php?link=' + data);
            xhr.onload = () => {
                if (extension == 'jpg' ||
                    extension == 'jpeg' ||
                    extension == 'png' ||
                    extension == 'gif') {
                    let img = document.createElement('img');
                    display.innerHTML = '';
                    string = data.split('/');
                    data = string.pop();
                    img.setAttribute('src', data);
                    img.setAttribute('width', '100%');
                    display.appendChild(img);
                    display.style.display = 'block';
                } else {
                    display.textContent = '';
                    display.style.display = 'block';
                    display.textContent = xhr.response;
                }
            }
            xhr.send();
        }

        document.onclick = (e) => {
            if (e.target.getAttribute('data-link')) {
                preview(e.target.getAttribute('data-link'), e.target.getAttribute('data-extend'));
            } else if (e.target.classList.contains('name')) {
                let url = e.target.querySelector('span').getAttribute('data-full');
                let tag = prompt('Which tag do you want to add?');
                if (tag == '') {
                    return;
                } else {
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', 'tags.php?tag=' + tag + '&url=' + url);
                    xhr.onload = () => {
                        selecttag();
                    }
                    xhr.send();
                }
            } else if (e.target.tagName == 'I') {
                let parent = e.target.parentElement;
                let element = parent.querySelector('[data-full]');
                let url = element.getAttribute('data-full');
                addcolor(url);
            } else if (e.target.id !== 'preview') {
                display.style.display = 'none';
            }
        }

        function convert() {
            let sizes = document.querySelectorAll('.size'),
                newvalue;
            sizes.forEach(element => {
                if (isNaN(element.textContent)) {
                    element.textContent = '';
                    return false;
                } else {
                    let integer = parseInt(element.textContent);
                    if (integer > 1000000) {
                        newvalue = Math.floor(integer / 1000000) + " Mo";
                    } else if (integer > 1000) {
                        newvalue = Math.floor(integer / 1000) + " Ko";
                    } else {
                        newvalue = Math.floor(integer) + " o";
                    }
                    element.textContent = newvalue;
                }
            })
        }

        function datecover() {
            let names = document.querySelectorAll('.name a');
            names.forEach(elem => {
                if (elem.textContent == '..') {
                    elem.textContent = 'Parent directory';
                }
            })
            let dates = document.querySelectorAll('.date');
            dates.forEach(element => {
                if (element.textContent == 'undefined') {
                    element.textContent = '';
                } else {
                    let time = new Date(parseInt(element.textContent) * 1000);
                    element.textContent = time.toLocaleDateString("fr");
                }
            })
        }
        adapt();

        function searchbar() {
            let input = document.querySelector('#searchbar');
            input.addEventListener('input', () => {
                let text = input.value;
                let elements = document.querySelectorAll('li');
                elements.forEach(element => {
                    element.style.display = "block";
                })
                if (text == '') {
                    elements.forEach(element => {
                        element.style.display = "block";
                    })
                }
                elements.forEach(element => {
                    if (!element.textContent.includes(text)) {
                        element.style.display = 'none';
                    }
                })
            })
        }

        function openfile() {
            document.addEventListener('dblclick', function(e) {
                if (e.target.getAttribute('data-link')) {
                    navigator.clipboard.writeText(e.target.getAttribute('data-full'))
                }
            })
        }

        function selecttag() {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'gettags.php');
            xhr.onload = () => {
                let reponse = JSON.parse(xhr.responseText);
                let option = '<option value="">Rechercher un tag</option>';
                reponse.forEach(element => {
                    option += '<option value="' + element.name + '">' + element.name + '</option>';
                })
                select.innerHTML = option;
            }
            xhr.send();
        }


        function addcolor(url) {
            display.style.display = 'block';
            display.innerHTML = '<input type="color" value="#FFFFFF" id="color_picker">';
            let input = document.querySelector('#color_picker');
            input.onchange = () => {
                let xhr = new XMLHttpRequest();
                let form = new FormData();
                form.append('hex', input.value);
                form.append('url', url);
                xhr.open('POST', 'colorated.php');
                xhr.onload = () => {
                    colorize();
                }
                xhr.send(form)
            }
        }

        function colorize() {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'getcolor.php');
            xhr.onload = () => {
                let reponse = JSON.parse(xhr.responseText);
                reponse.forEach(element => {
                    if (element.color == null) {
                        return;
                    } else {
                        let parent = document.querySelector('tr td [data-full="' + element.url + '"]').parentElement;
                        parent.querySelector('i').style.setProperty('color', element.color);
                    }
                })
            }
            xhr.send();
        }

        select.onchange = () => {
            if (select.value != '') {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', 'selector.php?name=' + select.value);
                xhr.onload = () => {
                    let reponses = JSON.parse(xhr.responseText);
                    let add = [];
                    reponses.forEach(reponse => {
                        let index = reponse.url.lastIndexOf('/');
                        let newtext = reponse.url.substring(index + 1);
                        add.push([newtext, reponse.url, reponse.name]);
                    })
                    display.style.display = 'block';
                    let liste = '<ul>';
                    add.forEach(element => {
                        liste += '<li data-full="' + element[1] + '" title="' + element[1] + '">' + element[0] + '</li>'
                    })
                    display.innerHTML = liste;
                    display.innerHTML += '</ul>';
                }
                xhr.send();
            }
        }
    </script>
</body>

</html>