<?php

namespace Tim\Theme\Blocks;


add_action('init', __NAMESPACE__ . '\\tt_register_scf_blocks');

function tt_register_scf_blocks()
{
    register_block_type(__DIR__ . '/../blocks/hero-home');
}


add_action('init', function () {
    register_block_style(
        'core/group',
        [
            'name'  => 'light-bg',
            'label' => __('Light Background', 'tims-theme'),
            'inline_style' => '.wp-block-group.is-style-light-bg { background-color: var(--wp--preset--color--white); color: var(--wp--preset--color--black);  } section.wp-block-group.is-style-light-bg { padding-block: clamp(3rem, 8vw, 8rem); margin-block: 0; }',
        ]
    );
});
