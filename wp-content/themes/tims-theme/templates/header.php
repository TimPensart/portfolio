<header class="site-header">
    <div class="container">
        <div>
            <h2>Logo</h2>
        </div>
        <nav class="desktop-nav">
            <?php wp_nav_menu(array(
                'theme_location' => 'main_navigation',
                'menu_class'     => 'main-menu',
                'menu_id'        => 'menu-main'
            )); ?>
        </nav>
    </div>

    <nav class="mobile-nav">
        <div class="container">

        </div>
    </nav>
</header>