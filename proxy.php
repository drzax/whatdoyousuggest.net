<?php
// File Name: proxy.php
if (!isset($_GET['url'])) die();
$url = urldecode($_GET['url']);
$url = 'http://' . str_replace('http://', '', $url); // Avoid accessing the file system
echo utf8_encode(file_get_contents($url));
die;
$xml = simplexml_load_string( utf8_encode(file_get_contents($url)) );
echo json_encode(new SimpleXMLElement($xml->asXML(), LIBXML_NOCDATA));
