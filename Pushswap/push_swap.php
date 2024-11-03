<?php

array_shift($argv);

function pb(&$la, &$lb, &$instructions)
{
    $copie = array_shift($la);
    array_unshift($lb, $copie);
    $instructions .= 'pb ';
}

function pa(&$la, &$lb, &$instructions)
{
    $copie = array_shift($lb);
    array_unshift($la, $copie);
    $instructions .= 'pa ';
}

function rb(&$lb, &$instructions)
{
    $first = array_shift($lb);
    $lb[] = $first;
    $instructions .= "rb ";
}

function isSorted(array $array)
{
    $size = count($array);
    for ($i = 0; $i < $size - 1; $i++) {
        if ($array[$i] > $array[$i + 1]) {
            return false;
        }
    }
    return true;
}

function sort_numbers(array &$la, array $lb = [])
{
    $instructions = "";
    if (!isSorted($la)) {
        while (!empty($la)) {
            pb($la, $lb, $instructions);
        }
        while (!empty($lb)) {
            $swapped = false;
            $max = max($lb);
            while (!$swapped) {
                if ($lb[0] === $max) {
                    pa($la, $lb, $instructions);
                    $swapped = true;
                } else {
                    rb($lb, $instructions);
                }
            }
        }
    }
    print substr($instructions, 0, strlen($instructions) - 1) . PHP_EOL;
}
sort_numbers($argv);
