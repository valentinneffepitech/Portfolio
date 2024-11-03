<?php

function load_2d_arr_from_file(string $path)
{
    $tableau = [];
    $ligne = 0;
    $open = fopen($path, "r");
    while ($get = fgets($open)) {
        for ($i = 0; $i < strlen($get) - 1; $i++) {
            $tableau[$ligne][$i] = $get[$i];
        }
        $ligne++;
    }
    fclose($open);
    array_shift($tableau);
    return $tableau;
}

function is_square_of_size(array $map, int $row, int $col, int $square_size)
{
    for ($i = 0; $i < $square_size; $i++) {
        for ($j = 0; $j < $square_size; $j++) {
            if (($map[$row + $i][$col + $j] === 'o')) {
                return false;
            }
        }
    }
    return true;
}

function find_biggest_square(array $map, int $nb_rows, int $nb_cols)
{
    $init = 0;
    $tableau = [
        'x' => 0,
        'y' => 0,
        'longueur' => 0
    ];
    $compare = ($nb_rows < $nb_cols) ? $nb_rows : $nb_cols;
    if (is_square_of_size($map, 0, 0, $compare)) {
        return [
            "x" => 0,
            "y" => 0,
            "longueur" => $compare
        ];
    }
    for ($i = 0; $i < $nb_rows; $i++) {
        for ($j = 0; $j < $nb_cols; $j++) {
            if ($map[$i][$j] === '.') {
                for ($k = 1; $k < $nb_cols - $j; ++$k) {
                    if (($i + $k) < $nb_rows) {
                        if (is_square_of_size($map, $i, $j, $k) && $k > $init) {
                            $init = $k;
                            $tableau = [
                                'x' => $i,
                                'y' => $j,
                                'longueur' => $k
                            ];
                        }
                    }
                }
            }
        }
    }
    return ($tableau);
}

function modify($path)
{
    $array = load_2d_arr_from_file($path);
    $lignes = count($array);
    $colonnes = count($array[0]);
    $data = find_biggest_square($array, $lignes, $colonnes);
    $initX = $data['x'];
    $initY = $data['y'];
    for ($i = 0; $i < $data['longueur']; $i++) {
        for ($j = 0; $j < $data['longueur']; $j++) {
            $array[$initX + $i][$initY + $j] = 'x';
        }
    }
    for ($i = 0; $i < count($array); $i++) {
        $array[$i] = implode('', $array[$i]);
    }
    for ($i = 0; $i < count($array); $i++) {
        echo $array[$i] . PHP_EOL;
    }
}

modify($argv[1]);
