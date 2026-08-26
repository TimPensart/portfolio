<?php

/**
 * Projects grid block.
 *
 * Renders every published `project` as a card. Cards link out to the project's
 * live site when it has one, and fall back to the project's own permalink so a
 * card is never a dead element.
 */

$project_query = new WP_Query([
    'post_type'              => 'project',
    'post_status'            => 'publish',
    'posts_per_page'         => 24,
    'ignore_sticky_posts'    => true,
    'no_found_rows'          => true,
    'update_post_term_cache' => false,
]);

if (!$project_query->have_posts()) {
    return;
}
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
    <?php while ($project_query->have_posts()) : ?>
        <?php
        $project_query->the_post();

        $website_url = get_field('website_url', get_the_ID());
        $is_external = (bool) $website_url;
        $card_url    = $is_external ? $website_url : get_permalink();
        ?>
        <a
            class="card-project"
            href="<?php echo esc_url($card_url); ?>"
            <?php echo $is_external ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>>
            <?php if (has_post_thumbnail()) : ?>
                <picture><?php the_post_thumbnail('large'); ?></picture>
            <?php endif; ?>

            <h3 class="project-title"><?php the_title(); ?></h3>
        </a>
    <?php endwhile; ?>
</div>
<?php wp_reset_postdata(); ?>
