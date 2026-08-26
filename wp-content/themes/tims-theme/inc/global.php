<?php

namespace Tim\Theme\Global;

/**
 * Get the slug of the block template WordPress resolved for the current request.
 *
 * Returns the fully qualified id (e.g. `tims-theme//page-home`), or an empty
 * string when the request is not rendered through a block template.
 *
 * @return string
 */
function get_current_fse_template_slug(): string
{
    global $_wp_current_template_id;

    return $_wp_current_template_id ?? '';
}
