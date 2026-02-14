<?php

namespace Tim\Theme\Enqueue;

use Tim\Theme\Assets;

/**
 * Load theme styles & scripts.
 *
 * Enqueues the main stylesheet and JavaScript file for the theme.
 *
 * @since 1.0.0
 */
function add_theme_scripts(): void
{


    // get all pages from templates/page-*.php and enqueue the according stylesheet to that page
    $template_files = glob(get_template_directory() . '/templates/page-*.php');
    if ($template_files) {
        foreach ($template_files as $template_file) {
            $template_slug = basename($template_file);
            // Check if current page is using this template
            if (is_page_template('templates/' . $template_slug)) {
                $template_name = pathinfo($template_slug, PATHINFO_FILENAME); // e.g., page-about
                wp_enqueue_style(
                    $template_name . '-style',
                    Assets\asset_path('styles/pages/' . $template_name . '.css'),
                    null,
                    PROJECT_VERSION
                );
            }
        }
    }

    wp_enqueue_script('main', Assets\asset_path('scripts/main.js'), ['jquery'], PROJECT_VERSION, true);
}

add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\add_theme_scripts', 100);

/**
 * Add attributes to script tag.
 *
 * @param string $tag    The original script tag.
 * @param string $handle The script handle.
 * @param string $src    The script source URL.
 * @return string The modified script tag.
 */
function add_type_attribute($tag, $handle, $src): mixed
{
    $scripts = [
        'main',
    ];

    if (!in_array($handle, $scripts)) {
        return $tag;
    }

    return '<script type="module" src="' . esc_url($src) . '"></script>';
}

add_filter('script_loader_tag', __NAMESPACE__ . '\\add_type_attribute', 10, 3);
