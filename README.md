# Portfolio

The source of my personal portfolio site. A custom WordPress **full site editing** theme.

### → [timpensart.be](https://timpensart.be)

`PHP 8.0+` · `WordPress 6.1+` · `Sass` · `Rollup` · `three.js` · `p5.js` · `GSAP`

---

## What's in here

|  |  |
| --- | --- |
| **Interactive hero** | A full-bleed WebGL plasma written as a GLSL fragment shader, driven by p5.js. Colours are interpolated in **OKLab** rather than sRGB, so gradients stay vivid instead of washing out through muddy midtones. A ping-pong pair of half-float framebuffers holds a persistent fluid displacement field that the cursor pushes around. |
| **3D product scenes** | `.glb` scenes exported from Blender and rendered with three.js. The render loop only runs while the canvas is on screen, shadow frusta are fitted to the model's real bounding box, and each instance returns a teardown that disposes its GPU resources. |
| **Per-page stylesheets** | Every page template compiles to its own stylesheet containing only the rules that page uses. No single monolithic `style.css`. |
| **Custom blocks** | Native block registration driven by `block.json`, rendered server-side in PHP. Drop a folder in, it registers itself. |
| **Motion, done politely** | Every animation (the shader, the scroll reveals, the smooth scroll, the 3D scenes) is skipped under `prefers-reduced-motion`. |

---

## Installation

Requires **PHP 8.0+**, **Node 18+**, Composer 2, and MySQL. The repository root _is_ the web root, so point your virtual host's document root here.

**1. Clone and install PHP dependencies.**

```bash
git clone git@github.com:TimPensart/portfolio.git
cd portfolio
composer install
```

This installs WordPress core into `core/` plus the plugins, then generates `salt.php` and creates `.env` from `example.env`.

> **On Windows**, the salt script needs a POSIX shell. Run `composer install` from Git Bash or WSL, or build `salt.php` by hand from <https://api.wordpress.org/secret-key/1.1/salt/>.

**2. Create an empty database and fill in `.env`.**

```ini
ENVIRONMENT=local
WP_HOME=http://portfolio.local
WP_SITEURL=http://portfolio.local/core
DB_NAME=local
DB_USER=root
DB_PASSWORD=root
DB_HOST=localhost
```

`WP_SITEURL` must end in `/core`, which is where Composer installs WordPress core. `ENVIRONMENT` accepts `local`, `staging` or `production`; anything but `production` cache-busts assets on every request, while `production` also closes the REST user endpoints.

**3. Build the front-end assets.**

```bash
npm install
npm run build
```

**4. Visit `/wp-admin`**, complete the WordPress setup, activate the plugins and select **Tims theme**.

---

## Commands

| Command                | What it does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| `npm run build`        | Full one-off build: vendors, stylesheets, block styles, scripts |
| `npm run dev`          | Watches `src/` and recompiles on save                           |
| `npm run sass`         | Compiles `main.scss` and every `pages/*.scss`                   |
| `npm run sass:blocks`  | Compiles each `styles/blocks/*.scss` into its block folder      |
| `npm run js`           | Bundles `src/scripts/` with Rollup                              |
| `npm run copy:vendors` | Copies p5.js into `dist/scripts/vendors/`                       |

Run `build` at least once before `dev`, because it copies p5.js and the watchers do not. Everything compiles from `src/` into `dist/`; **never edit `dist/` by hand**.

---

## How the theme works

Theme source lives in `wp-content/themes/tims-theme/`. Three conventions are worth knowing.

**Per-page stylesheets.** `main.scss` compiles to a site-wide `main.css`. On top of that, `inc/enqueue.php` resolves the block template WordPress picked for the current request and loads only its matching stylesheet, so a page never downloads CSS belonging to another page. The filenames must match:

```
templates/page-home.html   →   src/styles/pages/page-home.scss
```

Adding a page is those two files and nothing else. There is nothing to register.

**Self-registering blocks.** `inc/blocks.php` walks `blocks/` and registers every folder containing a `block.json`. The folder _is_ the registration. Block styles compile straight into the block's own folder, since `block.json` points at a stylesheet sitting beside it, which lets WordPress load a block's CSS only on pages that use it.

**3D scenes resolve from the anchor.** The `tim/three-js` block derives its model from the block's anchor: an anchor of `scene-4` renders `models/phone/scene-4.glb`. PHP checks the file exists and hands the front end an absolute URL via `data-model`, so the path holds up on URLs deeper than the site root.

---

## License

Theme code is released under the [GNU General Public License v2 or later](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html), matching WordPress.

Site content, copy, imagery and the `.glb` models are © Tim Pensart and are not covered by that license.
