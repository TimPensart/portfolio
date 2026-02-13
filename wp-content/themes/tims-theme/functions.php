<?php

$sage_includes = array(
    'inc/assets.php',
    'inc/wrapper.php',
    'inc/setup.php',
    'inc/disable.php',
    'inc/customposttype.php',
    'inc/enqueue.php',
    'inc/filters.php',
    'inc/global.php',
);

foreach ($sage_includes as $file) {
    if (!$filepath = locate_template($file)) {
        trigger_error(sprintf(__('Error locating %s for inclusion', 'sage'), $file), E_USER_ERROR);
    }

    require_once $filepath;
}
unset($file, $filepath);
