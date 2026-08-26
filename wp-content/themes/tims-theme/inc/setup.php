<?php

namespace Tim\Theme\Setup;

/**
 * Theme setup.
 *
 * @return void
 */
function setup(): void
{
    register_nav_menus([
        'main_navigation'   => __('Main Navigation', 'tims-theme'),
        'mobile_navigation' => __('Mobile Navigation', 'tims-theme'),
        'footer_navigation' => __('Footer Navigation', 'tims-theme'),
        'legal_navigation'  => __('Legal Navigation', 'tims-theme'),
    ]);

    // Let plugins manage the document title.
    add_theme_support('title-tag');

    // Project cards use the featured image.
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', __NAMESPACE__ . '\setup');

/**
 * Allow SVG uploads for administrators only.
 *
 * WordPress does not sanitize SVG, and an SVG can carry script. Gating the mime
 * type behind `unfiltered_html` keeps the capability to the same trust level as
 * pasting raw HTML into a post -- an editor or contributor account cannot use
 * it to smuggle script onto the site.
 *
 * @param array $upload_mimes
 * @return array
 */
function enable_svg_upload($upload_mimes): array
{
    if (!current_user_can('unfiltered_html')) {
        return $upload_mimes;
    }

    $upload_mimes['svg']  = 'image/svg+xml';
    $upload_mimes['svgz'] = 'image/svg+xml';

    return $upload_mimes;
}
add_filter('upload_mimes', __NAMESPACE__ . '\enable_svg_upload');

/**
 * Limit the block formats offered by the classic (TinyMCE) editor.
 *
 * @param array $settings
 * @return array
 */
function allowed_tags_in_tinymce($settings): array
{
    $settings['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;';

    return $settings;
}
add_filter('tiny_mce_before_init', __NAMESPACE__ . '\allowed_tags_in_tinymce');

/**
 * Output the favicon set generated for the site.
 *
 * The files live at the web root rather than in the media library, so this is
 * a static block of markup rather than WordPress' Site Icon.
 *
 * @return void
 */
function insert_favicon(): void
{
    ?>
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <?php
}
add_action('wp_head', __NAMESPACE__ . '\insert_favicon');
