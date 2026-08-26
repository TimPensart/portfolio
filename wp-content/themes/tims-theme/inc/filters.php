<?php

namespace Tim\Theme\Filters;

/**
 * Hide draft pages from any nav menu that happens to include them.
 *
 * @param array $menu_items
 * @return array
 */
function filter_draft_pages_from_menu($menu_items): array
{
    foreach ($menu_items as $i => $menu_item) {
        if (get_post_status($menu_item->object_id) === 'draft') {
            unset($menu_items[$i]);
        }
    }
    return $menu_items;
}
add_filter('wp_nav_menu_objects', __NAMESPACE__ . '\filter_draft_pages_from_menu');

/**
 * Hide the default Posts menu item from the WordPress admin.
 *
 * The theme only publishes pages and the `project` post type, so the built-in
 * Posts screen is noise for the editor.
 *
 * @return void
 */
function remove_default_post_menu(): void
{
    remove_menu_page('edit.php');
}
add_action('admin_menu', __NAMESPACE__ . '\remove_default_post_menu');
