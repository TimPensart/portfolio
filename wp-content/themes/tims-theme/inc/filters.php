<?php

namespace Roots\Sage\Filters;

/**
 * Hide Draft Pages from the navigation menu (if included)
 *
 * @param $menu_items
 * @return mixed
 */
function filter_draft_pages_from_menu($menu_items): mixed
{
    foreach ($menu_items as $i => $menu_item) {
        if ('draft' == get_post_status($menu_item->object_id)) {
            unset($menu_items[$i]);
        }
    }
    return $menu_items;
}
add_filter('wp_nav_menu_objects', __NAMESPACE__ . '\\filter_draft_pages_from_menu', 10, 2);

/**
 * Hide the default Posts menu item from the WordPress admin
 *
 * This function removes the "Posts" menu item from the admin dashboard
 * by targeting its slug 'edit.php'
 *
 * @return void
 */
function remove_default_post_menu(): void
{
    remove_menu_page('edit.php');
}
add_action('admin_menu', __NAMESPACE__ . '\\remove_default_post_menu');
