let pg;
let plasmaShader;
let palette;

let renderScale = 0.65; // 0.5–0.8 for performance

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("sketch-canvas");
    console.log(container.clientHeight);
    window.setup = function () {
        createCanvas(container.offsetWidth, container.offsetHeight).parent("sketch-canvas");
        pixelDensity(1);
        imageMode(CENTER);
        noStroke();

        const rw = floor(width * renderScale);
        const rh = floor(height * renderScale);

        pg = createGraphics(rw, rh, WEBGL);
        pg.pixelDensity(1);
        pg.noStroke();

        plasmaShader = pg.createShader(vertShader, fragShader);
        palette = makePalette4();

        plasmaShader.setUniform("u_noise_start", random(1000.0));
    };

    window.windowResized = function () {
        const container = document.getElementById("sketch");
        resizeCanvas(container.offsetWidth, container.offsetHeight);
    };

    window.draw = function () {
        // Update uniforms
        pg.shader(plasmaShader);

        plasmaShader.setUniform("u_resolution", [pg.width, pg.height]);
        plasmaShader.setUniform("u_time", millis() / 1000.0);

        plasmaShader.setUniform("u_col1", palette[0]);
        plasmaShader.setUniform("u_col2", palette[1]);
        plasmaShader.setUniform("u_col3", palette[2]);
        plasmaShader.setUniform("u_col4", palette[3]);

        plasmaShader.setUniform("u_scale", 2);
        plasmaShader.setUniform("u_warp", 0.9);
        plasmaShader.setUniform("u_speed", 0.3);

        // Draw full buffer (WEBGL origin is center)
        pg.rect(-pg.width / 2, -pg.height / 2, pg.width, pg.height);

        // Draw buffer centered to the 2D canvas
        background(0);
        image(pg, width / 2, height / 2, width, height);
    };

    function keyPressed() {
        if (key == RIGHT_ARROW) {
            palette = makePalette4();
        }

        return false;
    }

    // ---------- Palette: returns 4 colors as vec3 (0..1) ----------
    function makePalette4() {
        const cols = [];
        for (let i = 0; i < 4; i++) {
            let a = random(0.15, 1.0);
            let b = random(0.15, 0.95);
            let c = random(0.05, 0.95);
            const arr = [a, b, c];
            shuffle(arr, true);
            cols.push(arr);
        }
        shuffle(cols, true);
        return cols;
    }

    // ---------- p5-friendly vertex shader (IMPORTANT) ----------
    const vertShader = `
  precision mediump float;

  attribute vec3 aPosition;
  attribute vec2 aTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec2 vTexCoord;

  void main() {
    vTexCoord = aTexCoord;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  }
`;

    // ---------- Fragment shader ----------
    const fragShader = `
  precision mediump float;

  uniform vec2  u_resolution;
  uniform float u_time;

  uniform vec3 u_col1;
  uniform vec3 u_col2;
  uniform vec3 u_col3;
  uniform vec3 u_col4;

  uniform float u_scale;
  uniform float u_warp;
  uniform float u_speed;
  uniform float u_noise_start;

  varying vec2 vTexCoord;

  float hash(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  vec3 pal(float t){
    t = clamp(t, 0.0, 1.0);
    float x = t * 3.0;
    float i = floor(x);
    float f = smoothstep(0.0, 1.0, fract(x));
    if (i < 1.0) return mix(u_col1, u_col2, f);
    if (i < 2.0) return mix(u_col2, u_col3, f);
    return mix(u_col3, u_col4, f);
  }

  void main() {
    // 0..1 UV
    vec2 uv = vTexCoord;

    // aspect-corrected centered coords
    vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

    float t = u_time * u_speed;

    // Gentle domain warp = thicker blobs
    float w1 = noise(u_noise_start + p * (u_scale * 0.8) + vec2(t * 0.1, -t * 0.3));
    float w2 = noise(u_noise_start + p * (u_scale * 0.8) + vec2(-t * 0.1, t * 0.45));
    vec2 wp = p + (vec2(w1, w2) - 0.5) * u_warp;

    float a = noise(u_noise_start + wp * (u_scale * 1.0) + t * 0.15);
    float b = noise(u_noise_start + wp * (u_scale * 1.8) + vec2(10.0, 20.0) + t * 0.25);
    float c = noise(u_noise_start + wp * (u_scale * 2.6) + vec2(-30.0, 5.0) + t * 0.35);
    float e = 0.62*a + 0.26*b + 0.12*c;

    float k = noise(u_noise_start + wp * (u_scale * 0.6) + vec2(100.0, -100.0) + t * 0.08);
    float mixT = clamp(0.6*e + 0.4*k, 0.0, 1.0);

    vec3 col = pal(mixT);

    // Shine
    float shine = pow(clamp(e * 1.2, 0.0, 1.0), 2.2);
    col *= mix(0.85, 1.35, shine);
    col += vec3(0.10) * shine;

    // Subtle vignette
    float v = 1.0;
    col *= v;

    gl_FragColor = vec4(col, 1.0);
  }
`;
});
