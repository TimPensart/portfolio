<?php

require_once __DIR__ . '/vendor/autoload.php';
(\Dotenv\Dotenv::create(__DIR__ . '/'))->load();

define('PROJECT_VERSION', '1.0.0');


// =====================================================
// Load database info and parameters from .env
// =====================================================
define('WP_ENV', getenv('ENVIRONMENT'));
define('DB_NAME', getenv('DB_NAME'));
define('DB_USER', getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_HOST', getenv('DB_HOST'));

define('WP_HOME', getenv('WP_HOME'));
define('WP_SITEURL', getenv('WP_SITEURL'));

// memory limit
const WP_MEMORY_LIMIT = '256M';

// =====================================================
// You almost certainly do not want to change these
// =====================================================
const DB_CHARSET = 'utf8';
const DB_COLLATE = '';

// =====================================================
// Load salts from salts.php if file exists
// =====================================================
if (file_exists(__DIR__ . '/salt.php')) {
    require_once __DIR__ . '/salt.php';
    if (!defined('AUTH_KEY') || strlen(AUTH_KEY) === 0 || AUTH_KEY === 'a value') {
        echo 'This recipe needs some salt, grab it <a href="https://api.wordpress.org/secret-key/1.1/salt" target="_blank">here</a> and create a file: salt.php ';
        die;
    }
} else {
    echo 'This recipe needs some salt, grab it <a href="https://api.wordpress.org/secret-key/1.1/salt" target="_blank">here</a> and create a file: salt.php ';
    die;
}

// =====================================================
// Allow all file types
// =====================================================
const ALLOW_UNFILTERED_UPLOADS = true;

// =====================================================
// Custom Content Directory
// =====================================================
const WP_CONTENT_URL = 'http://portfolio.local/wp-content';
define('WP_CONTENT_DIR', dirname(ABSPATH) . '/wp-content');

// =====================================================
// Load WordPress Settings
// =====================================================
$table_prefix = 'wp_';

// =====================================================
// Absolute path to the WordPress directory
// =====================================================
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/core');
}

// =====================================================
// Sets up WordPress vars and included files
// =====================================================
require_once ABSPATH . 'wp-settings.php';

// =====================================================
// Defining WP_ENVIRONMENT_TYPE
// =====================================================
define('WP_ENVIRONMENT_TYPE', getenv('ENVIRONMENT'));
