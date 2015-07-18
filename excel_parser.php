<?php
require_once 'Helper/PHPExcel/IOFactory.php';

$relations = array();
$definitions = array();
$additionalData = array();

$file = __DIR__ . '/data/US Data v1.1.xlsx';

if (!file_exists($file)) {
    exit("File ' . $file . ' first not found.\n");
}

$objPHPExcel = PHPExcel_IOFactory::load($file);

$relations = getSheetData($objPHPExcel, 0);
$definitions = getSheetData($objPHPExcel, 1);
$additionalData = getSheetData($objPHPExcel, 2);

$returns = array();

if (count($relations) > 0 && count($definitions) > 0 && count($additionalData)) {
    $groups = getGroups($definitions);
    $nodes = getNodes($definitions, $groups);
    $links = getLinks($relations, $nodes);
    /*echo '<pre>';
    var_dump($links);
    echo '</pre>';
    die;*/
    $additionalNodesData = getAdditionalNodesData($additionalData, $nodes);

    $returns = array(
        'nodes' => $nodes,
        'links' => $links,
        'groups' => $groups,
        'additionalNodesData' => $additionalNodesData
    );

    echo json_encode($returns);
}

// helper functions
function getSheetData($objPHPExcel, $number = 0)
{
    $result = array();

    $objPHPExcel->setActiveSheetIndex($number);
    $data = $objPHPExcel->getActiveSheet()->toArray();

    if (count($data) > 0) {
        for ($i = 1; $i < count($data); $i ++) {
            $result[] = $data[$i];
        }
    }

    return $result;
}

function getGroups($data)
{
    $groups = array();

    foreach ($data as $d) {
        if ($d[1] > '' && !in_array($d[1], $groups)) {
            $groups[] = $d[1];
        }
    }

    return $groups;
}

function getNodes($data, $groups)
{
    $nodes = array();

    foreach ($groups as $k => $g) {
        foreach ($data as $d) {
            if ($g == $d[1]) {
                $nodes[] = array(
                    'name' => $d[0],
                    'group' => $k
                );
            }
        }
    }

    return $nodes;
}

function getLinks($data, $nodes)
{
    $links = array();

    foreach ($data as $k => $d) {
        $link = array();
        for ($i = 0; $i < count($nodes); $i ++) {
            if ($nodes[$i]['name'] == $d[1]) {
                $link['target'] = $i;
            }
            if ($nodes[$i]['name'] == $d[0]) {
                $link['source'] = $i;
            }
        }
        /*if(!isset($link['source']) || !isset($link['target'])) {
            var_dump($d);
            echo '<br/>';
        }*/
        if (count($link) == 2) {
            $links[] = $link;
        }
    }

    return $links;
}

function getAdditionalNodesData($data, $nodes)
{
    $result = array();

    for ($i = 0; $i < count($nodes); $i ++) {
        foreach ($data as $d) {
            if ($d[0] == $nodes[$i]['name']) {
                $result[$i] = array(
                    'Market Cap' => $d[1],
                    'Total Funding' => $d[2],
                    'Date of Valuation' => $d[3]
                );
            }
        }
    }

    return $result;
}

