let pg;
let plasmaShader;
let palette;

let crazyRedPalette = [
    [0.6572554443740329, 0.4476547954104405, 0.7761135870422585],
    [0.5405717602354713, 0.42199671358505486, 0.30864789182984936],
    [0.9378873137824795, 0.3613809344788844, 0.2563355307991481],
    [0.49127296725085057, 0.9191511010896141, 0.7797569484611355],
];

let underwaterSunsetPalette = [
    [0.39410225290964823, 0.6888804633341522, 0.5588297556572392],
    [0.3245280212271583, 0.40481556885938785, 0.41963413308688474],
    [0.8408927416227256, 0.7188966928006981, 0.40760702360390544],
    [0.17981604392651623, 0.4713242404223351, 0.39603054282405953],
];

let RetroPalette = [
    [0.29255937727810205, 0.43708183588560967, 0.5848093407869466],
    [0.22384662799633576, 0.3318809023751755, 0.5398510285066969],
    [0.8422083534102198, 0.31754774740194075, 0.25162490510829755],
    [0.1802155362151303, 0.8808677018603622, 0.22822413768144434],
];

let newBluePalette = [
    [0.1543656521283489, 0.9268348862530469, 0.4459857096200909],
    [0.1998504188869398, 0.258678016182568, 0.9507169569011056],
    [0.5197219935301497, 0.5629615737163424, 0.7495112063732516],
    [0.516203430069158, 0.09331040051261011, 0.3315105799720922],
];

let orangeGreenPalette = [
    [0.8721884100111688, 0.27630607453975276, 0.13393378067602893],
    [0.22835603273260463, 0.517532695973627, 0.23890263118490562],
    [0.8938375050599274, 0.3185980435640481, 0.10960315036740538],
    [0.6295688127506062, 0.8351779549102611, 0.4735876981669723],
];

let superSayanPalette = [
    [0.1172430516687778, 0.6792413936840515, 0.8823735507546778],
    [0.2714215794072139, 0.24277832615524086, 0.31962654127438983],
    [0.28090418358194724, 0.6538618016477342, 0.9429279946911534],
    [0.6107880595943473, 0.7320181612706876, 0.4921242720376694],
];

let maybePalette = [
    [0.5466289289954861, 0.5325794029633547, 0.14512509242476623],
    [0.4341613114095718, 0.16294253726397345, 0.8644389790232431],
    [0.9610487569223211, 0.6466267198245046, 0.5459397699371081],
    [0.0331283798916262, 0.44831437101198, 0.21084848636985287],
];

let darkblueRedPalette = [
    [0.23913646164534097, 0.7973605457416165, 0.9389930980907328],
    [0.15789977121280818, 0.008223464911308764, 0.5442348011581875],
    [0.6922075535418664, 0.06742521271228807, 0.1809010880735188],
    [0.7215418651509504, 0.6882202768092673, 0.39593546935763313],
];

let theOnePalette = [
    [0.08234071698134038, 0.9146868418800838, 0.6373228831050989],
    [0.5949461294911798, 0.36993057283218755, 0.6661376208089118],
    [0.259493086892186, 0.12628111118998053, 0.8805147665482268],
    [0.2502126273595796, 0.4944869655745202, 0.12072666102797791],
];

document.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("sketch-canvas");
    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;

    window.setup = function () {
        createCanvas(containerWidth, containerHeight).parent("sketch-canvas");
        pixelDensity(1);
        imageMode(CENTER);
        noStroke();

        pg = createGraphics(width, height, WEBGL);
        pg.pixelDensity(1);
        pg.noStroke();

        plasmaShader = pg.createShader(vertShader, fragShader);

        palette = makePalette4();
        // palette = crazyRedPalette; // Uncomment for a fixed palette
        // palette = underwaterSunsetPalette; // Uncomment for a fixed palette
        // palette = RetroPalette; // Uncomment for a fixed palette
        // palette = newBluePalette; // Uncomment for a fixed palette
        // palette = orangeGreenPalette; // Uncomment for a fixed palette
        // palette = superSayanPalette; // Uncomment for a fixed palette

        console.log("Palette colors:", palette);

        // Expose palette getter globally
        window.getSketchPalette = function () {
            return palette;
        };

        plasmaShader.setUniform("u_noise_start", random(1000.0));
        // Dispatch custom event to signal sketch is ready
        window.dispatchEvent(new Event("p5-ready"));
    };

    window.addEventListener("resize", function () {
        const container = document.getElementById("sketch-canvas");
        resizeCanvas(container.clientWidth, container.clientHeight);
    });

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
        plasmaShader.setUniform("u_speed", 0.4);

        // Draw full buffer (WEBGL origin is center)
        pg.rect(-pg.width / 2, -pg.height / 2, pg.width, pg.height);

        // Draw buffer centered to the 2D canvas
        background(0);
        image(pg, width / 2, height / 2, width, height);
    };

    // ---------- Palette: returns 4 colors as vec3 (0..1) ----------
    function makePalette4() {
        const cols = [];
        for (let i = 0; i < 4; i++) {
            let a = random(0.0, 1.0);
            let b = random(0.0, 1.0);
            let c = random(0.0, 1.0);
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
