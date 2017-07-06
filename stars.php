<?php

require_once dirname(__FILE__) . '/classes/idna_convert.class.php';
$IDN = new idna_convert();

$stars = unserialize(file_get_contents(dirname(__FILE__) . '/data/stars.dat'));
arsort($stars);

$new = array();
foreach ($stars as $key => $count) {

	// Get the components so we can consolidate the different locale comparisons.
	$components = explode('|', $key);

	if (isset($components[1])) // This is a modern locale compared string
	{
		$decoded = $IDN->decode($components[0]);

		$new[$decoded]['count'] = ( isset($new[$decoded]) ) ? $new[$decoded]['count'] + $count : $count;
		$new[$decoded]['comparisons'] = ( isset($new[$decoded]['comparisons']) ) ? array_merge($new[$decoded]['comparisons'], array($components[1] . '|' . $components[2])) : array($components[1] . '|' . $components[2]);
	}
	else // Old style (no locales or punycode)
	{
		$new[$key]['count'] = ( isset($new[$key]) ) ? $new[$key]['count'] + $count : $count;
	}
}

foreach ($new as $phrase => $data)
{
	echo '<p>' . $data['count'] . ': '  . $phrase . ((isset($data['comparisons'])) ? ' [' . implode(', ', $data['comparisons']) . ']' : '') . '</p>';
}

?>
