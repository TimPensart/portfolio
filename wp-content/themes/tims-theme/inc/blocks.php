<?php

namespace Tim\Theme\Blocks;

/**
 * Register every block in the theme's `blocks/` directory.
 *
 * A directory is treated as a block as soon as it contains a block.json, so
 * adding a block is a matter of dropping in a folder -- no registration list
 * to keep in sync.
 *
 * @return void
 */
function register_theme_blocks(): void
{
    foreach (new \DirectoryIterator(__DIR__ . '/../blocks') as $item) {
        if ($item->isDir() && !$item->isDot() && file_exists($item->getPathname() . '/block.json')) {
            register_block_type($item->getPathname());
        }
    }
}
add_action('init', __NAMESPACE__ . '\register_theme_blocks');

/**
 * Register the custom block styles the templates rely on.
 *
 * @return void
 */
function register_theme_block_styles(): void
{
    register_block_style(
        'core/group',
        [
            'name'         => 'light-bg',
            'label'        => __('Light Background', 'tims-theme'),
            'inline_style' => '.wp-block-group.is-style-light-bg { background-color: var(--wp--preset--color--white); color: var(--wp--preset--color--black); }'
                . ' section.wp-block-group.is-style-light-bg { padding-block: clamp(3rem, 8vw, 8rem); margin-block: 0; }'
                . ' section.wp-block-group.is-style-light-bg + section.wp-block-group.is-style-light-bg { padding-top: 0; }',
        ]
    );

    register_block_style(
        'core/columns',
        [
            'name'         => 'justify-space-between',
            'label'        => __('Justify Space Between', 'tims-theme'),
            'inline_style' => '.wp-block-columns.is-style-justify-space-between { justify-content: space-between; }',
        ]
    );
}
add_action('init', __NAMESPACE__ . '\register_theme_block_styles');
