<?php

namespace Tim\Theme\Blocks;


/**
 * Register ACF blocks
 * @return void
 */
function tt_register_acf_blocks()
{

    foreach ($blocks = new \DirectoryIterator(__DIR__ . '/../blocks') as $item) {
        // Check if block.json file exists in each subfolder.
        if (
            $item->isDir() && !$item->isDot()
            && file_exists($item->getPathname() . '/block.json')
        ) {
            // Register the block given the directory name within the blocks
            // directory.
            register_block_type($item->getPathname());
        }
    }
}
add_action('init', __NAMESPACE__ . '\\tt_register_acf_blocks');



add_action('init', function () {
    register_block_style(
        'core/group',
        [
            'name'  => 'light-bg',
            'label' => __('Light Background', 'tims-theme'),
            'inline_style' => '.wp-block-group.is-style-light-bg { background-color: var(--wp--preset--color--white); color: var(--wp--preset--color--black);  } section.wp-block-group.is-style-light-bg { padding-block: clamp(3rem, 8vw, 8rem); margin-block: 0; } section.wp-block-group.is-style-light-bg + section.wp-block-group.is-style-light-bg {padding-top: 0;}',
        ]
    );

    register_block_style(
        'core/columns',
        [
            'name'  => 'justify-space-between',
            'label' => __('Justify Space Between', 'tims-theme'),
            'inline_style' => '.wp-block-columns.is-style-justify-space-between { justify-content: space-between; }',
        ]
    );
});
