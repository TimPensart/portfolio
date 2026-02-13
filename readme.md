# Installation

Get an Apache or Nginx server running.

Create a MySQL database. Take not of the credentials you create. You will need them later on.

Download or clone the repo.

Run the following command inside of the project's root directory:\
 `composer install`\
This will install the necessary plugins along with wordpress core files

### wp-config.php

Update your **./wp-config.php** credentials with the credentials of the database you created.

Add the following lines to wp-config.php:

```
define('PROJECT_VERSION', '1.0.0');
define('WP_ENV', 'local');
```

Visit the url you created on your server followed by /wp-admin to visit the backend. => follow the wordpress setup and login, you should now be logged in to the backend

After this, make sure to activate all the installed plugins. Some plugins can be ignored when developing locally.
