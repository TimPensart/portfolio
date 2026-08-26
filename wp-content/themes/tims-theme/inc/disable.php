<?php

namespace Tim\Theme\Disable;

/**
 * Drop jquery-migrate from the front end.
 *
 * It only exists to patch jQuery 1.x era code, none of which this theme ships.
 *
 * @param \WP_Scripts $scripts
 * @return void
 */
function dequeue_jquery_migrate($scripts): void
{
    if (is_admin() || !isset($scripts->registered['jquery'])) {
        return;
    }

    $script = $scripts->registered['jquery'];

    if ($script->deps) {
        $script->deps = array_diff($script->deps, ['jquery-migrate']);
    }
}
add_action('wp_default_scripts', __NAMESPACE__ . '\dequeue_jquery_migrate');

/**
 * Drop the oEmbed host script. Nothing on the site is embedded elsewhere.
 *
 * @return void
 */
function dequeue_wp_embed(): void
{
    wp_dequeue_script('wp-embed');
}
add_action('wp_footer', __NAMESPACE__ . '\dequeue_wp_embed');

/**
 * Close the REST user endpoints in production.
 *
 * They enumerate author accounts for anonymous visitors, which is free
 * reconnaissance for a login brute force. They stay open locally because the
 * block editor uses them.
 *
 * @param array $endpoints
 * @return array
 */
function remove_rest_user_endpoints($endpoints): array
{
    unset(
        $endpoints['/wp/v2/users'],
        $endpoints['/wp/v2/users/(?P<id>[\d]+)']
    );

    return $endpoints;
}

if (getenv('ENVIRONMENT') === 'production') {
    add_filter('rest_endpoints', __NAMESPACE__ . '\remove_rest_user_endpoints');
}
