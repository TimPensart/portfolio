<?php

namespace Tim\Theme\Disable;

function dequeue_jquery_migrate($scripts): void
{
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];
        if ($script->deps) {
            $script->deps = array_diff($script->deps, array('jquery-migrate'));
        }
    }
}
add_action('wp_default_scripts', __NAMESPACE__ . '\\dequeue_jquery_migrate');

function dequeue_wp_embed(): void
{
    wp_dequeue_script('wp-embed');
}
add_action('wp_footer', __NAMESPACE__ . '\\dequeue_wp_embed');
