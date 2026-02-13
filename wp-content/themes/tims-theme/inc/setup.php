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
 * TinyMCE editor setup
 */
function allowed_tags_in_tinymce($settings)
{
    $settings['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6;';
    return $settings;
}
add_filter('tiny_mce_before_init', __NAMESPACE__ . '\\allowed_tags_in_tinymce');

/**
 * Add pagename to <body> classes
 */
function body_class($classes)
{
    // Add page slug if it doesn't exist
    if (is_single() || is_page() && !is_front_page()) {
        if (!in_array(basename(get_permalink()), $classes)) {
            $classes[] = basename(get_permalink());
        }
    }

    return $classes;
}
add_filter('body_class', __NAMESPACE__ . '\\body_class');
