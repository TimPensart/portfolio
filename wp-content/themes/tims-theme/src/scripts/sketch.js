let pg;
let plasmaShader;
let updateShader;

// Ping-pong float framebuffers holding the persistent fluid displacement field.
let fieldA;
let fieldB;
let usingA = true;

// Resolved palette in OKLab (fed to the shader) + an sRGB mirror (for getSketchPalette).
let palette; // [[L,a,b], ...] x4
let paletteSrgb; // [[r,g,b], ...] x4 in 0..1 sRGB

// -----------------------------------------------------------------------------
// Palettes
//
// A palette is any array of 4 colors. Each color may be written in ANY of these
// formats — mix and match freely:
//
//   "#ff8800", "#f80"                    hex (3/4/6/8 digits, alpha ignored)
//   "rgb(255 136 0)"  "rgba(255,136,0,.5)"
//   "hsl(28 100% 50%)"  "hsla(28,100%,50%,.5)"
//   "oklch(0.72 0.17 55)"                perceptual lightness / chroma / hue
//   "oklab(0.72 0.11 0.12)"
//   [0.6, 0.45, 0.1]                     legacy: raw sRGB triplet in 0..1
//
// Colors are converted to OKLab once and interpolated perceptually in the
// shader, so gradients stay vivid and never wash out through muddy midtones.
// -----------------------------------------------------------------------------

// Example showcasing the new string formats — try `activePalette = sunsetGlow`.
let sunsetGlow = [
    "oklch(0.82 0.15 85)", // warm gold
    "oklch(0.68 0.20 25)", // coral red
    "hsl(320 70% 45%)", // magenta
    "#1b1033", // deep indigo
];

let mixedPalette = ["oklch(0.675892 0.21747 38.8022)", "oklch(0.7652 0.1752 62.57)", "oklch(0.452014 0.313214 264.052)", "oklch(0.942269 0.22156 119.0463)"];

let blackWhitePalette = ["#050505", "#050505", "#3d2d00", "#2c3a3d"];

let RetroPalette = [
    [0.29255937727810205, 0.43708183588560967, 0.5848093407869466],
    [0.22384662799633576, 0.3318809023751755, 0.5398510285066969],
    [0.8422083534102198, 0.31754774740194075, 0.25162490510829755],
    [0.1802155362151303, 0.8808677018603622, 0.22822413768144434],
];

let underwaterSunsetPalette = [
    [0.39410225290964823, 0.6888804633341522, 0.5588297556572392],
    [0.3245280212271583, 0.40481556885938785, 0.41963413308688474],
    [0.8408927416227256, 0.7188966928006981, 0.40760702360390544],
    [0.17981604392651623, 0.4713242404223351, 0.39603054282405953],
];

let crazyRedPalette = [
    [0.6572554443740329, 0.4476547954104405, 0.7761135870422585],
    [0.5405717602354713, 0.42199671358505486, 0.30864789182984936],
    [0.9378873137824795, 0.3613809344788844, 0.2563355307991481],
    [0.49127296725085057, 0.9191511010896141, 0.7797569484611355],
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

let JelloPallette = [
    [0.560539049346602, 0.9864698435111292, 0.38645530493669356],
    [0.8577431517451919, 0.4984650834782164, 0.4540553783519765],
    [0.6575545361771221, 0.5422192410994796, 0.7770584408187052],
    [0.8953176745887077, 0.2602592985768819, 0.901397804388853],
];

let subtleGreenPalette = [
    [0.5430468466082186, 0.8054894383891057, 0.905854080822762],
    [0.03723558547599071, 0.857733825137916, 0.5273045927579048],
    [0.07213040333266107, 0.9372620715767922, 0.12886619883214],
    [0.9114378781698476, 0.48133011487593813, 0.7561542765802856],
];

let redBluePalette = [
    [0.39600533784266967, 0.805711389655639, 0.2574576383024767],
    [0.49719370733463164, 0.5695225781262432, 0.7078388027561454],
    [0.6945821422927309, 0.20522295164288817, 0.04449050967178536],
    [0.4782097912440668, 0.5974592252710419, 0.5998044534305499],
];

let soberPalette = [
    [0.6364022765160221, 0.28305120714075427, 0.9544488946587469],
    [0.5591799861460144, 0.1500699524000575, 0.7344666860264949],
    [0.47462573017689913, 0.7796962258904715, 0.7086272207901448],
    [0.6760415396415512, 0.4255560295413837, 0.09228198665102649],
];

let contrastGreenPalette = [
    [0.5624587424664147, 0.38902895918785374, 0.7654389711061432],
    [0.006206728996348221, 0.38179458200030936, 0.07924846551674813],
    [0.6276043699506899, 0.9402749230183469, 0.95999596556732],
    [0.3811634565722667, 0.8788430923225373, 0.44721092425406983],
];

let darkblueGreenPalette = [
    [0.2061734185127846, 0.14413212388004837, 0.4338820311879936],
    [0.12075400085638022, 0.16757843629344615, 0.40374569333147936],
    [0.274021356795885, 0.7001311152416252, 0.2829251787573168],
    [0.8144467670210225, 0.8134542999776722, 0.5688374702015168],
];

let customPalette = [
    [1, 1, 0],
    [0, 0, 1],
    [1, 0.5, 0],
    [0, 0, 0],
];

// Swap this to change the active palette.
let activePalette = blackWhitePalette;

// -----------------------------------------------------------------------------
// Color pipeline: any CSS-ish string / legacy triplet -> OKLab.
//
// We keep OKLab as the canonical form because the shader interpolates in it.
// sRGB inputs travel sRGB -> linear -> OKLab; oklab()/oklch() inputs go straight
// in. getSketchPalette() converts back to displayable sRGB.
// -----------------------------------------------------------------------------

const clamp01 = (x) => Math.min(1, Math.max(0, x));

function srgbToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c) {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function linearSrgbToOklab([r, g, b]) {
    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    return [0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_, 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_, 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_];
}

function oklabToLinearSrgb([L, a, b]) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;

    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;

    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}

function srgbToOklab([r, g, b]) {
    return linearSrgbToOklab([srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)]);
}

function oklabToSrgb(lab) {
    return oklabToLinearSrgb(lab).map((c) => clamp01(linearToSrgb(clamp01(c))));
}

function hslToSrgb(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    if (s === 0) return [l, l, l];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hue = (tc) => {
        tc = ((tc % 1) + 1) % 1;
        if (tc < 1 / 6) return p + (q - p) * 6 * tc;
        if (tc < 1 / 2) return q;
        if (tc < 2 / 3) return p + (q - p) * (2 / 3 - tc) * 6;
        return p;
    };
    return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
}

function oklchToOklab(L, C, hDeg) {
    const h = (hDeg * Math.PI) / 180;
    return [L, C * Math.cos(h), C * Math.sin(h)];
}

// Split "fn(a b c / d)" or "fn(a, b, c, d)" into component tokens.
function colorComponents(str) {
    const inner = str.slice(str.indexOf("(") + 1, str.lastIndexOf(")"));
    return inner.split(/[\s,/]+/).filter(Boolean);
}

// Percent-aware number: "50%" -> 0.5, "128" -> 128.
function numToken(tok) {
    if (tok.endsWith("%")) return { v: parseFloat(tok) / 100, pct: true };
    return { v: parseFloat(tok), pct: false };
}

// Parse anything we accept into OKLab.
function parseColor(input) {
    if (Array.isArray(input)) return srgbToOklab(input.map(clamp01));
    if (typeof input !== "string") throw new Error("Unsupported color: " + input);

    const s = input.trim().toLowerCase();

    if (s[0] === "#") {
        let hex = s.slice(1);
        if (hex.length === 3 || hex.length === 4) {
            hex = hex
                .split("")
                .map((ch) => ch + ch)
                .join("");
        }
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        return srgbToOklab([r, g, b]);
    }

    const fn = s.slice(0, s.indexOf("("));
    const parts = colorComponents(s);

    switch (fn) {
        case "rgb":
        case "rgba": {
            const rgb = parts.slice(0, 3).map((tok) => {
                const { v, pct } = numToken(tok);
                return clamp01(pct ? v : v / 255);
            });
            return srgbToOklab(rgb);
        }
        case "hsl":
        case "hsla": {
            const h = parseFloat(parts[0]);
            const sat = numToken(parts[1]).v;
            const light = numToken(parts[2]).v;
            return srgbToOklab(hslToSrgb(h, sat, light));
        }
        case "oklab": {
            const L = numToken(parts[0]).v;
            return [L, parseFloat(parts[1]), parseFloat(parts[2])];
        }
        case "oklch": {
            const L = numToken(parts[0]).v;
            return oklchToOklab(L, parseFloat(parts[1]), parseFloat(parts[2]));
        }
        default:
            throw new Error("Unsupported color format: " + input);
    }
}

function resolvePalette(pal) {
    if (!Array.isArray(pal) || pal.length < 4) {
        throw new Error("A palette must contain 4 colors");
    }
    return pal.slice(0, 4).map(parseColor);
}

document.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("sketch-canvas");
    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;

    // On mobile the WebGL shader pipeline renders with precision artifacts
    // (streaks/boxes/layering). Instead of a shader, mobile gets a plain 2D p5
    // sketch that paints a single static noise image in the same palette — no
    // WEBGL, no framebuffers, no draw loop.
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|IEMobile|BlackBerry/i.test(navigator.userAgent) || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

    // Smoothed pointer state (UV space, 0..1) + motion + interaction level.
    let mouseUV = [0.5, 0.5]; // eased influence center
    let prevTarget = [0.5, 0.5]; // last raw cursor position (for velocity)
    let mouseVel = [0.0, 0.0]; // smoothed pointer velocity (UV/frame)
    let mouseIntensity = 0.0;
    let pointerActive = false;

    // Global noise pan: the whole field drifts in the direction the mouse moves,
    // with momentum that eases out smoothly instead of stopping abruptly.
    let flowVel = [0.0, 0.0]; // smoothed pan velocity (UV/frame)
    let flowOffset = [0.0, 0.0]; // accumulated global offset applied to the noise

    // Mobile static-noise state: a fixed seed so the image is deterministic
    // (never jumps), and the last width we rendered at so scroll-triggered
    // resizes — which only change viewport height — are ignored.
    let mobileNoiseSeed = 0;
    let mobileWidth = containerWidth;

    window.setup = function () {
        createCanvas(containerWidth, containerHeight).parent("sketch-canvas");
        pixelDensity(1);
        imageMode(CENTER);
        noStroke();

        palette = resolvePalette(activePalette);
        paletteSrgb = palette.map(oklabToSrgb);

        // Returns the active palette as displayable sRGB triplets (0..1).
        window.getSketchPalette = function () {
            return paletteSrgb;
        };

        // -------- Mobile: one static noise image, then stop --------
        if (isMobile) {
            mobileNoiseSeed = random(1000); // fixed once; render stays deterministic
            mobileWidth = width;
            drawStaticNoise();
            noLoop(); // no animation, no draw loop
            window.dispatchEvent(new Event("p5-ready"));
            return;
        }

        pg = createGraphics(width, height, WEBGL);
        pg.pixelDensity(1);
        pg.noStroke();

        plasmaShader = pg.createShader(vertShader, fragShader);
        updateShader = pg.createShader(vertShader, updateFragShader);

        // Half-float framebuffers so displacement can accumulate without
        // banding. HALF_FLOAT is linear-filterable in WebGL2 everywhere (unlike
        // 32-bit FLOAT), and 16-bit precision is ample for a bounded field.
        // No width/height -> they auto-track the graphics size on resize.
        const fboOpts = { format: HALF_FLOAT, depth: false, antialias: false };
        fieldA = pg.createFramebuffer(fboOpts);
        fieldB = pg.createFramebuffer(fboOpts);
        clearField(fieldA);
        clearField(fieldB);
        usingA = true;

        plasmaShader.setUniform("u_noise_start", random(1000.0));
        window.dispatchEvent(new Event("p5-ready"));
    };

    // Perceptual 4-stop palette lookup (mirrors the shader's pal()): interpolate
    // in OKLab, then convert to displayable sRGB (0..1). Used by the mobile path.
    function palAt(t) {
        t = Math.max(0, Math.min(1, t));
        const x = t * 3.0;
        const i = Math.floor(x);
        let f = x - i;
        f = f * f * (3.0 - 2.0 * f); // smoothstep
        let c0, c1;
        if (i < 1) {
            c0 = palette[0];
            c1 = palette[1];
        } else if (i < 2) {
            c0 = palette[1];
            c1 = palette[2];
        } else {
            c0 = palette[2];
            c1 = palette[3];
        }
        const lab = [c0[0] + (c1[0] - c0[0]) * f, c0[1] + (c1[1] - c0[1]) * f, c0[2] + (c1[2] - c0[2]) * f];
        return oklabToSrgb(lab);
    }

    // Paint one static, soft noise image onto the 2D canvas. Rendered into a
    // small low-res buffer and scaled up, which is both fast and gives the soft,
    // cloud-like look without any shader.
    function drawStaticNoise() {
        background(0);

        // Quarter-ish resolution buffer; the upscale smooths it into soft noise.
        const bw = Math.max(2, Math.floor(width * 0.15));
        const bh = Math.max(2, Math.floor(height * 0.15));
        const buf = createGraphics(bw, bh);
        buf.pixelDensity(1);
        buf.loadPixels();

        noiseDetail(4, 0.5); // a few octaves for gentle fractal detail
        const off = mobileNoiseSeed; // fixed seed -> identical image every render
        const aspect = bw / bh;
        const freq = 1.0; // noise cells across the buffer

        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const n = noise(off + (x / bw) * freq * aspect, off + (y / bh) * freq);
                // Mild contrast expansion so the palette spans a fuller range.
                const t = Math.max(0, Math.min(1, (n - 0.5) * 1.8 + 0.5));
                const col = palAt(t);
                const idx = 4 * (y * bw + x);
                buf.pixels[idx] = col[0] * 255;
                buf.pixels[idx + 1] = col[1] * 255;
                buf.pixels[idx + 2] = col[2] * 255;
                buf.pixels[idx + 3] = 255;
            }
        }
        buf.updatePixels();

        image(buf, width / 2, height / 2, width, height); // imageMode(CENTER)
        buf.remove();
    }

    // Track the pointer only once it has actually entered the canvas, so the
    // effect doesn't fire at (0,0) before the user has moved the mouse.
    window.mouseMoved = function () {
        const inside = mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
        if (inside && !pointerActive) {
            // Seed positions on entry so the first frame isn't a velocity spike.
            prevTarget[0] = mouseX / width;
            prevTarget[1] = mouseY / height;
            mouseUV[0] = prevTarget[0];
            mouseUV[1] = prevTarget[1];
            mouseVel[0] = 0.0;
            mouseVel[1] = 0.0;
        }
        pointerActive = inside;
    };
    window.mouseDragged = window.mouseMoved;

    window.addEventListener("resize", function () {
        const el = document.getElementById("sketch-canvas");

        // Mobile: scrolling makes the address bar show/hide, which fires resize
        // with a changed *height* only. Ignore those so the static noise never
        // re-renders (and never jumps) while scrolling. Only a real width change
        // (e.g. orientation) re-renders, reusing the same fixed seed.
        if (isMobile) {
            if (el.clientWidth === mobileWidth) return;
            mobileWidth = el.clientWidth;
            resizeCanvas(el.clientWidth, el.clientHeight);
            drawStaticNoise();
            return;
        }

        resizeCanvas(el.clientWidth, el.clientHeight);
        if (pg) pg.resizeCanvas(el.clientWidth, el.clientHeight);
        // Framebuffers auto-resize with pg; reset the displacement field.
        clearField(fieldA);
        clearField(fieldB);
    });

    // Zero out a displacement framebuffer.
    function clearField(fb) {
        if (!fb) return;
        fb.begin();
        pg.clear();
        fb.end();
    }

    function updatePointer() {
        const inside = pointerActive && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

        if (inside) {
            const tx = mouseX / width;
            const ty = mouseY / height; // canvas UV matches p5's vTexCoord (y down)

            // Smoothed pointer velocity — this drives the fluid advection.
            const vx = tx - prevTarget[0];
            const vy = ty - prevTarget[1];
            mouseVel[0] += (vx - mouseVel[0]) * 0.05;
            mouseVel[1] += (vy - mouseVel[1]) * 0.05;
            prevTarget[0] = tx;
            prevTarget[1] = ty;

            // Ease the influence center toward the cursor for a trailing follow.
            mouseUV[0] += (tx - mouseUV[0]) * 0.1;
            mouseUV[1] += (ty - mouseUV[1]) * 0.1;
        } else {
            pointerActive = false;
            // Let the flow coast to a stop after the pointer leaves.
            mouseVel[0] *= 0.9;
            mouseVel[1] *= 0.9;
        }

        // Ramp interaction up on hover (extra on press), fade out when it leaves.
        const target = inside ? (mouseIsPressed ? 1.0 : 0.85) : 0.0;
        mouseIntensity += (target - mouseIntensity) * 0.07;

        // Global pan: the pan velocity trails the mouse velocity and decays to
        // zero once the pointer stops, so the whole noise field drifts in the
        // direction you move and eases smoothly to a rest. The offset itself
        // accumulates, leaving the field where it panned to.
        const PAN_GAIN = 0.2; // how strongly mouse speed drives the pan
        const PAN_LERP = 0.024; // smaller = smoother, longer ease-out
        flowVel[0] += (mouseVel[0] * PAN_GAIN - flowVel[0]) * PAN_LERP;
        flowVel[1] += (mouseVel[1] * PAN_GAIN - flowVel[1]) * PAN_LERP;
        flowOffset[0] += flowVel[0];
        flowOffset[1] += flowVel[1];
    }

    window.draw = function () {
        if (isMobile) return; // mobile renders once in setup()

        updatePointer();

        const src = usingA ? fieldA : fieldB;
        const dst = usingA ? fieldB : fieldA;

        // -------- Pass 1: advance the persistent displacement field --------
        // Read the previous field (src), inject flow along the cursor's motion,
        // and write the accumulated result into dst.
        dst.begin();
        pg.shader(updateShader);
        updateShader.setUniform("u_prev", src);
        updateShader.setUniform("u_resolution", [pg.width, pg.height]);
        updateShader.setUniform("u_mouse", mouseUV);
        updateShader.setUniform("u_mouse_vel", mouseVel);
        updateShader.setUniform("u_mouse_intensity", mouseIntensity);
        pg.rect(-pg.width / 2, -pg.height / 2, pg.width, pg.height);
        dst.end();

        usingA = !usingA;

        // -------- Pass 2: render the plasma, warping by the field --------
        pg.shader(plasmaShader);
        plasmaShader.setUniform("u_resolution", [pg.width, pg.height]);
        plasmaShader.setUniform("u_time", millis() / 1000.0);

        plasmaShader.setUniform("u_col1", palette[0]);
        plasmaShader.setUniform("u_col2", palette[1]);
        plasmaShader.setUniform("u_col3", palette[2]);
        plasmaShader.setUniform("u_col4", palette[3]);

        plasmaShader.setUniform("u_scale", 0.7);
        plasmaShader.setUniform("u_warp", 12.0);
        plasmaShader.setUniform("u_speed", 0.1);

        plasmaShader.setUniform("u_field", dst);
        plasmaShader.setUniform("u_flow_offset", flowOffset);

        // Draw full buffer (WEBGL origin is center)
        pg.rect(-pg.width / 2, -pg.height / 2, pg.width, pg.height);

        // Draw buffer centered to the 2D canvas
        background(0);
        image(pg, width / 2, height / 2, width, height);
    };

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

    const fragShader = `
  precision highp float;

  uniform vec2  u_resolution;
  uniform float u_time;

  // Palette colors arrive as OKLab (L, a, b) and are mixed perceptually.
  uniform vec3 u_col1;
  uniform vec3 u_col2;
  uniform vec3 u_col3;
  uniform vec3 u_col4;

  uniform float u_scale;
  uniform float u_warp;
  uniform float u_speed;
  uniform float u_noise_start;

  // Global pan of the noise domain, driven by mouse motion (UV units).
  uniform vec2 u_flow_offset;

  // Persistent fluid displacement field (RG = domain offset), updated each
  // frame by the cursor and read here as a permanent input to the noise domain.
  uniform sampler2D u_field;

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

  // OKLab -> linear sRGB (Bjorn Ottosson).
  vec3 oklabToLinear(vec3 c){
    float l_ = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
    float m_ = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
    float s_ = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;

    float l = l_ * l_ * l_;
    float m = m_ * m_ * m_;
    float s = s_ * s_ * s_;

    return vec3(
       4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    );
  }

  // Linear sRGB -> gamma-encoded sRGB.
  vec3 linearToSrgb(vec3 c){
    c = clamp(c, 0.0, 1.0);
    vec3 lo = c * 12.92;
    vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
    return mix(hi, lo, step(c, vec3(0.0031308)));
  }

  // Perceptual 4-stop gradient, interpolated in OKLab.
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
    vec2 uv = vTexCoord;

    // Aspect-corrected centered coords.
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float t = u_time * u_speed;

    // Persistent, mouse-driven fluid displacement of the noise domain. This
    // has been accumulated over previous frames, so past cursor strokes remain
    // baked into the field — the plasma keeps flowing through the channels the
    // pointer carved out.
    vec2 push = texture2D(u_field, uv).xy;

    // Global pan: shift the whole noise domain so the field drifts in the
    // direction the mouse moves (aspect-corrected to match p-space).
    vec2 flow = u_flow_offset * vec2(aspect, 1.0);

    // -------- Domain-warped value noise --------
    vec2 pp = p + push - flow;
    float w1 = noise(u_noise_start + pp * (u_scale * 0.8) + vec2(t * 0.1, -t * 0.3));
    float w2 = noise(u_noise_start + pp * (u_scale * 0.8) + vec2(-t * 0.1, t * 0.45));
    vec2 wp = pp + (vec2(w1, w2) - 0.5) * u_warp;

    float a = noise(u_noise_start + wp * (u_scale * 1.0) + t * 0.15);
    float b = noise(u_noise_start + wp * (u_scale * 1.8) + vec2(10.0, 20.0) + t * 0.25);
    float c = noise(u_noise_start + wp * (u_scale * 2.6) + vec2(-30.0, 5.0) + t * 0.35);
    float e = 0.62 * a + 0.26 * b + 0.12 * c;

    float k = noise(u_noise_start + wp * (u_scale * 0.6) + vec2(100.0, -100.0) + t * 0.08);
    float mixT = clamp(0.6 * e + 0.4 * k, 0.0, 1.0);

    // Perceptual color, then to linear light for physically-plausible shading.
    vec3 lin = oklabToLinear(pal(mixT));

    // Shine, applied in linear space.
    float shine = pow(clamp(e * 1.2, 0.0, 1.0), 2.2);
    lin *= mix(0.9, 1.5, shine);
    lin += vec3(0.06) * shine;

    gl_FragColor = vec4(linearToSrgb(lin), 1.0);
  }
`;

    // Field-update shader: evolves the persistent displacement field. Each frame
    // it reads the previous field, injects flow along the cursor's motion, and
    // writes the accumulated result back. Because the field persists between
    // frames, the distortions the cursor makes stay after it has moved on.
    const updateFragShader = `
  precision highp float;

  uniform sampler2D u_prev;          // previous displacement field (RG = offset)
  uniform vec2  u_resolution;
  uniform vec2  u_mouse;             // cursor in 0..1 UV space
  uniform vec2  u_mouse_vel;         // smoothed cursor velocity (UV/frame)
  uniform float u_mouse_intensity;   // 0 = idle, 1 = fully engaged

  varying vec2 vTexCoord;

  // --- Tunables -------------------------------------------------------------
  const float INJECT_STRENGTH = 2.0;   // how hard the cursor pushes the fluid
  const float INJECT_RADIUS   = 0.08;  // brush size (bigger = wider influence)
  const float PERSIST         = 0.99;   // 1.0 = permanent; < 1 slowly fades out
  const float DIFFUSE         = 0.19;  // smoothing / gentle spread each frame
  const float MAX_LEN         = 3.0;   // clamp on accumulated displacement
  // --------------------------------------------------------------------------

  void main() {
    vec2 uv = vTexCoord;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
    vec2 vel = u_mouse_vel * vec2(aspect, 1.0);

    // Previous accumulated displacement.
    vec2 D = texture2D(u_prev, uv).xy;

    // Gentle diffusion keeps the field smooth and lets it settle naturally.
    vec2 texel = 1.0 / u_resolution;
    vec2 blur = (
        texture2D(u_prev, uv + vec2(texel.x, 0.0)).xy +
        texture2D(u_prev, uv - vec2(texel.x, 0.0)).xy +
        texture2D(u_prev, uv + vec2(0.0, texel.y)).xy +
        texture2D(u_prev, uv - vec2(0.0, texel.y)).xy) * 0.25;
    D = mix(D, blur, DIFFUSE);

    // Inject flow along the pointer's motion near the cursor. This adds into
    // the persistent field, so the stroke remains once the cursor has passed.
    vec2 md = p - m;
    float infl = u_mouse_intensity * exp(-dot(md, md) / INJECT_RADIUS);
    D += -vel * infl * INJECT_STRENGTH;

    // Persistence + magnitude clamp (keeps it bounded and stable).
    D *= PERSIST;
    float len = length(D);
    if (len > MAX_LEN) D *= MAX_LEN / len;

    gl_FragColor = vec4(D, 0.0, 1.0);
  }
`;
});
