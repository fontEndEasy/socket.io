<?php

$bools = array(true,true,true,true,false);

if(isset($_REQUEST['sku'])) {
	$sku = explode(',', $_REQUEST['sku']);
	$result = array();
	foreach ($sku as $value) {
		shuffle($bools);
		$result[] = array('sku'=>$value, 'inStock'=>$bools[0]);
	}
	echo json_encode($result);
	exit;
}else{
	shuffle($bools);
	$result = array(
		'success' => $bools[0],
		'message' => $bools[0]?'Add to cart success':'Add to cart fail, this item have been sold out.'
	);
	echo json_encode($result);
	exit;
}