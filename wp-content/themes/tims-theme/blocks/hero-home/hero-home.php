<?php

/**
 * Home hero block.
 *
 * The p5 plasma sketch paints itself into #sketch-canvas; everything on top of
 * it is authored in the editor through InnerBlocks.
 *
 * @var array $block ACF block settings, passed in by the ACF block renderer.
 */

$inner_blocks_template = [
    ['core/image'],
    ['core/heading', ['placeholder' => 'Add a heading...', 'level' => 1]],
];
?>
<section <?php echo get_block_wrapper_attributes(); ?>>
    <div id="sketch-canvas"></div>

    <InnerBlocks template="<?php echo esc_attr(wp_json_encode($inner_blocks_template)); ?>" />
</section>
