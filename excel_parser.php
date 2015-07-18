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
    $groups = getGroups($relations);
    $nodes = getNodes($relations, $definitions, $groups);
    /*echo '<pre>';
    var_dump($nodes);
    echo '</pre>';
    die;*/
    $links = getLinks($relations, $nodes);
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
        if ($d[2] > '' && !in_array($d[2], $groups)) {
            $groups[] = $d[2];
        }
    }

    return $groups;
}

function getNodes($relations, $definitions, $groups)
{
    $nodes = array();

    $relationsArr = array();
    foreach ($relations as $r) {
        if ($r[0] > '' && !in_array($r[0], $relationsArr)) {
            $relationsArr[] = $r[0];
        }
    }
    foreach ($relations as $r) {
        if ($r[1] > '' && !in_array($r[1], $relationsArr)) {
            $relationsArr[] = $r[1];
        }
    }

    foreach ($definitions as $d) {
        if ($d[0] > '' && in_array($d[0], $relationsArr)) {
            $nodes[] = array(
                'name' => $d[0],
                'definition' => $d[1]
            );
        }
    }
    foreach ($nodes as $k => $node) {
        foreach ($relations as $r) {
            if ($node['name'] == $r[0] || $node['name'] == $r[1]) {
                $nodes[$k]['group'] = array_search($r[2], $groups);
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
        foreach ($nodes as $i => $node) {
            /*if($node['name'] == 'DA') {
                echo $d[0] . ' / ' . $d[1] . '<br />';
            }*/
            if ($node['name'] == $d[1]) {
                $link['target'] = $i;
            }
            if ($node['name'] == $d[0]) {
                $link['source'] = $i;
            }
        }
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

