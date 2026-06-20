<?php

use function Tim\Theme\Setup\setup;

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
    <?php
    $project_query = new WP_Query([
        'post_type' => 'project',
        'posts_per_page' => -1,
        'post_status' => 'publish',
    ]);

    while ($project_query->have_posts()) : $project_query->the_post(); ?>
        <a href="<?php echo get_field('website_url', get_the_ID()) ?: ''; ?>" target="_blank" class="card-project">
            <?php if (has_post_thumbnail()) : ?>
                <picture><?php echo get_the_post_thumbnail(get_the_ID(), 'large'); ?></picture>
            <?php endif; ?>
            <?php if (!empty(get_the_title())) : ?>
                <h3 class="project-title"><?php echo get_the_title(); ?></h3>
            <?php endif; ?>
        </a>
    <?php endwhile; ?>
    <?php wp_reset_postdata(); ?>
</div>