<?php

/**
 * Three.js scene block.
 *
 * The block's anchor doubles as the model name: an anchor of `scene-4` renders
 * `/models/phone/scene-4.glb`. The resolved URL is handed to the front end as a
 * data attribute so the script never has to guess a path -- a relative one
 * would break on any URL deeper than the site root.
 *
 * @var array $block ACF block settings, passed in by the ACF block renderer.
 */

$anchor = sanitize_key($block['anchor'] ?? '');

if ($anchor === '') {
    return;
}

$model_relative_path = '/models/phone/' . $anchor . '.glb';

if (!file_exists(dirname(ABSPATH) . $model_relative_path)) {
    return;
}
?>
<div
    <?php echo get_block_wrapper_attributes(['class' => 'three-container']); ?>
    id="<?php echo esc_attr($anchor); ?>"
    data-model="<?php echo esc_url(home_url($model_relative_path)); ?>"></div>
