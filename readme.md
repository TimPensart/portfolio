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

## Compiling

To get started with javascript and styling just run the following command in the root of this project:\
`npm install`

Run the following command for automatic file watch functionality and compiling:\
`npm run dev`\
Now you can change files in the wp-content/themes/tims-theme/**src/** directory.\
=> your changes will automatically compile and applied to wp-content/themes/tims-theme/**dist/**.\
Do not change the folder structure inside the concerning **src/** folder

This theme compiles seperate stylesheets for each page. Here's how it works:

1. To create a new page (template) just add a page-\*.html block template under wp-content/themes/tims-theme/templates/
2. To add SCSS styling to that page, you can add a page-\*.scss file to wp-content/themes/tims-theme/src/styles/pages/. Make sure that the file name of the .html template matches the .scss file name.

**All done!** In enqueue.php the linking of the stylesheets is handled automatically. Now each page has it's own clean stylesheet with only the styles it uses with @use.
