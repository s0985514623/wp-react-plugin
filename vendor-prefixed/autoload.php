<?php
// autoload.php @generated by Strauss

if ( file_exists( __DIR__ . '/autoload-classmap.php' ) ) {
	$class_map = include __DIR__ . '/autoload-classmap.php';
	if ( is_array( $class_map ) ) {
		spl_autoload_register(
			function ( $classname ) use ( $class_map ) {
				if ( isset( $class_map[ $classname ] ) && file_exists( $class_map[ $classname ] ) ) {
					require_once $class_map[ $classname ];
				}
			}
		);
	}
	unset( $class_map, $strauss_src );
}

if ( file_exists( __DIR__ . '/autoload-files.php' ) ) {
	require_once __DIR__ . '/autoload-files.php';
}
