<?php

namespace Tim\Theme\Enqueue;

use Tim\Theme\Assets;
use Tim\Theme\Global as G;

/**
 * Load theme styles & scripts.
 *
 * Each `templates/page-*.html` gets its own stylesheet compiled from the
 * matching `src/styles/pages/page-*.scss`, so a page only ever downloads the
 * CSS it actually uses. Only the stylesheet for the template WordPress resolved
 * for this request is enqueued.
 *
 * @return void
 */
function add_theme_scripts(): void
{
    $template_slug = str_replace('tims-theme//', '', G\get_current_fse_template_slug());

    if ($template_slug !== '' && file_exists(get_template_directory() . '/templates/' . $template_slug . '.html')) {
        wp_enqueue_style(
            $template_slug . '-style',
            Assets\asset_path('styles/pages/' . $template_slug . '.css'),
            [],
            PROJECT_VERSION
        );
    }
    // general base styling
    wp_enqueue_style('main', Assets\asset_path('styles/main.css'), [], PROJECT_VERSION);


    wp_enqueue_script('p5', Assets\asset_path('scripts/vendors/p5.min.js'), [], '2.2.1', true);
    wp_enqueue_script('sketch', Assets\asset_path('scripts/sketch.js'), ['p5'], PROJECT_VERSION, true);
    wp_enqueue_script('main', Assets\asset_path('scripts/main.js'), ['sketch'], PROJECT_VERSION, true);
}
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\add_theme_scripts', 100);

/**
 * Serve the bundled entry point as an ES module.
 *
 * Rollup emits `main.js` in ESM format, so it needs `type="module"`. Rewriting
 * the tag rather than replacing it keeps the attributes WordPress added (id,
 * defer, and anything a filter contributed).
 *
 * @param string $tag    The original script tag.
 * @param string $handle The script handle.
 * @param string $src    The script source URL.
 * @return string The modified script tag.
 */
function add_type_attribute($tag, $handle, $src): string
{
    if ($handle !== 'main') {
        return $tag;
    }

    // Drop the type WordPress may already have emitted before adding our own,
    // so the tag never ends up with two.
    $tag = preg_replace('/\stype=(["\']).*?\1/', '', $tag);

    return str_replace('<script ', '<script type="module" ', $tag);
}
add_filter('script_loader_tag', __NAMESPACE__ . '\add_type_attribute', 10, 3);
