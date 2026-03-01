<?php

$my_block_template = array(
    array(
        'core/image',
    ),
    array(
        'core/heading',
        array(
            'placeholder' => 'Add a heading...',
            'level' => 1,
        ),
    ),
);



?>
<div <?php echo get_block_wrapper_attributes(); ?>>
    <div id="sketch-canvas"></div>

    <InnerBlocks template="<?php echo esc_attr(wp_json_encode($my_block_template)); ?>" />
</div>