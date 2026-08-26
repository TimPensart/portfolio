<?php

$theme_includes = array(
    'inc/assets.php',
    'inc/setup.php',
    'inc/disable.php',
    'inc/customposttype.php',
    'inc/enqueue.php',
    'inc/filters.php',
    'inc/global.php',
    'inc/blocks.php',
);

foreach ($theme_includes as $file) {
    if (!$filepath = locate_template($file)) {
        trigger_error(
            sprintf(
                /* translators: %s: relative path of the include that could not be located. */
                __('Error locating %s for inclusion', 'tims-theme'),
                $file
            ),
            E_USER_ERROR
        );
    }

    require_once $filepath;
}
unset($file, $filepath);
