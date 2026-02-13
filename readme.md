# Installation

Get an Apache or Nginx server running.

Create a MySQL database and take note of the credentials you create. You will need them later on.

Download or clone this repo.

Run the following command inside of the project's root directory:\
 `composer install`\
This will install the necessary plugins along with wordpress core files

Copy the example.env and rename it to .env\
In this .env file you can change the database credentials to the database credentials you created. Also change the WP_HOME and WP_SITEURL to match your site's url. Here is an example:

```
WP_ENV=local
WP_HOME=http://portfolio.local
WP_SITEURL=http://portfolio.local/core
DB_NAME=local
DB_USER=root
DB_PASSWORD=root
DB_HOST=localhost
```

Visit your server/site url followed by /wp-admin to visit the backend. Follow the wordpress setup. After following these steps you should be logged-in to the wordpress backend.

Make sure to activate all the installed plugins in the wordpress backend.
