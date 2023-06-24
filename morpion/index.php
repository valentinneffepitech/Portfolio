<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Morpion</title>
</head>

<body>
    <div id="board"></div>
    <script type="module">
        import Morpion from './script.js'
        let game = new Morpion({
            color1: 'green',
            color2: 'purple'
        })
    </script>
</body>

</html>