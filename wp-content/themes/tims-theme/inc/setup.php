<?php

namespace Tim\Theme\Setup;

/**
 * Theme setup
 */
function setup()
{
    /**
     * Register wp_nav_menu() menus
     * http://codex.wordpress.org/Function_Reference/register_nav_menus
     */
    register_nav_menus(array(
        'main_navigation'      => __('Main Navigation', 'xpl'),
        'mobile_navigation'    => __('Mobile Navigation', 'xpl'),
        'footer_navigation'    => __('Footer Navigation', 'xpl'),
        'legal_navigation'     => __('Legal Navigation', 'xpl'),
    ));

    // Enable plugins to manage the document title
    add_theme_support('title-tag');

    // Enable post thumbnails
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', __NAMESPACE__ . '\\setup');

/**
 * Allow svg uploads
 *
 */
function enable_svg_upload($upload_mimes)
{
    $upload_mimes['svgz'] = 'image/svg+xml';
    $upload_mimes['svg'] = 'image/svg+xml';

    return $upload_mimes;
}
add_filter('upload_mimes', __NAMESPACE__ . '\\enable_svg_upload', 10, 1);

/**
 * TinyMCE editor setup
 */
function allowed_tags_in_tinymce($settings)
{
    $settings['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;';
    return $settings;
}
add_filter('tiny_mce_before_init', __NAMESPACE__ . '\\allowed_tags_in_tinymce');

/**
 * Insert header favicon
 */
function insert_favicon()
{
    $favicon_html = '<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="shortcut icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />';

    echo $favicon_html;
}
add_action('wp_head', __NAMESPACE__ . '\\insert_favicon');
