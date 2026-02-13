<?php

use Tim\Theme\Wrapper;

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<?php get_template_part('templates/head'); ?>

<body <?php body_class(); ?>>

    <?php get_template_part('templates/header'); ?>

    <main class="site-main" role="document">
        <?php include Wrapper\template_path(); ?>
    </main>

    <?php
    get_template_part('templates/footer');
    wp_footer();
    ?>
</body>

</html>