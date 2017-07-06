<?php

if (!isset($_GET['action'])) exit();

$response = new stdClass();
$response->result = 'failure';

switch ($_GET['action']) {

	case 'star':
		$file = dirname(__FILE__) . '/data/stars.dat';
		if (!is_readable($file) || false == $stars = file_get_contents($file)){
			$stars = array();
		} else {
			$stars = unserialize($stars);
		}
		if (isset($_GET['permalink']) && strlen(trim($_GET['permalink'])) > 0) {
			if (isset($stars[$_GET['permalink']])) {
				$stars[$_GET['permalink']]++;
			} else {
				$stars[$_GET['permalink']] = 1;
			}
			if (file_put_contents($file, serialize($stars))) {
				$response->result = 'success';
				echo json_encode($response);
				exit();
			}
		}
		echo json_encode($response);
		break;
}

// Silence is golden?