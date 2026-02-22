<?php

namespace Tim\Theme\Blocks;


add_action('init', __NAMESPACE__ . '\\register_scf_blocks');

function register_scf_blocks()
{
    register_block_type(__DIR__ . '/../blocks/hero-home');
}
