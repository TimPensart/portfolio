<?php

namespace Tim\Theme\CustomPostType;

function create_posttype(): void
{
    register_post_type(
        'project',
        [
            'labels'             => [
                'name'          => __('Projects'),
                'singular_name' => __('Project'),
            ],
            'public'                => true,
            'publicly_queryable'    => true,
            'has_archive'           => false,
            'hierarchical'          => true,
            'can_export'            => true,
            'show_in_menu'          => true,
            'show_in_nav_menus'     => true,
            'delete_with_user'      => false,
            'exclude_from_search'   => false,
            'rewrite'               => ['slug' => 'project'],
            'supports'              => ['title', 'excerpt', 'thumbnail', 'revisions', 'editor', 'author'],
            'menu_icon'             => 'dashicons-admin-post',
        ]
    );
}

add_action('init', __NAMESPACE__ . '\\create_posttype');
