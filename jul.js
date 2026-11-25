/* =========================================================
   FENRAC – JULDESIGN
   Slås på automatiskt 20 november – 25 december, varje år
   (besökarens lokala tid). Stängs av automatiskt den 26 december.
   Förhandsgranska när som helst:  index.html?jul=1
   Tvinga av:                      index.html?jul=0
   ========================================================= */
(function () {
    var params = new URLSearchParams(window.location.search);
    var force = params.get('jul');
    var now = new Date();
    var month = now.getMonth(), day = now.getDate(); // månad: 10 = nov, 11 = dec
    var inSeason = (month === 10 && day >= 20) || (month === 11 && day <= 25);

    var active = force === '1' ? true : force === '0' ? false : inSeason;
    if (!active) return;

    // Sätt klassen direkt (skriptet ligger i <head>) så designen syns utan blink
    document.documentElement.classList.add('jul');

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'jul.css';
    document.head.appendChild(link);

    document.addEventListener('DOMContentLoaded', function () {
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* ---------- Banner med nedräkning till julafton ---------- */
        var bannerClosed = false;
        try { bannerClosed = sessionStorage.getItem('julBannerClosed') === '1'; } catch (e) {}

        var header = document.querySelector('header');
        if (header && !bannerClosed) {
            var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var julafton = new Date(now.getFullYear(), 11, 24);
            var days = Math.round((julafton - today) / 86400000);

            var text;
            if (days > 1) {
                text = '🎄 <strong>' + days + ' dagar</strong> kvar till julafton<span class="jul-banner-extra"> – God jul önskar Fenrac AB</span>';
            } else if (days === 1) {
                text = '🎄 <strong>1 dag</strong> kvar till julafton<span class="jul-banner-extra"> – God jul önskar Fenrac AB</span>';
            } else {
                text = '🎄 <strong>God jul</strong> och gott nytt år<span class="jul-banner-extra"> önskar vi på Fenrac AB</span>!';
            }

            var banner = document.createElement('div');
            banner.className = 'jul-banner';
            banner.setAttribute('role', 'note');
            banner.innerHTML = '<span>' + text + '</span>' +
                '<button class="jul-banner-close" aria-label="Stäng julhälsning">×</button>';
            header.parentNode.insertBefore(banner, header);

            banner.querySelector('.jul-banner-close').addEventListener('click', function () {
                banner.remove();
                try { sessionStorage.setItem('julBannerClosed', '1'); } catch (e) {}
            });
        }

        /* ---------- Julbelysning under headern ---------- */
        if (header) {
            var lights = document.createElement('div');
            lights.className = 'jul-lights';
            lights.setAttribute('aria-hidden', 'true');
            var colors = ['#e8323c', '#f3c614', '#2fae5f', '#3d8bfd', '#ff8a1f'];
            var lightCount = 0;
            function buildLights() {
                // clientWidth = synlig bredd (innerWidth blir för stor av den gömda mobilmenyn)
                var vw = document.documentElement.clientWidth || window.innerWidth;
                var mobile = vw <= 768;
                // färre lampor med mer luft på mobilen
                var count = mobile
                    ? Math.max(4, Math.round(vw / 80))
                    : Math.max(10, Math.round(vw / 60));
                if (count === lightCount) return;
                lightCount = count;
                lights.innerHTML = '';
                lights.style.setProperty('--n', count);
                for (var i = 0; i < count; i++) {
                    var bulb = document.createElement('span');
                    bulb.className = 'jul-bulb';
                    bulb.style.setProperty('--i', i);
                    bulb.style.setProperty('--c', colors[i % colors.length]);
                    bulb.style.setProperty('--d', ((i % 5) * -0.52) + 's');
                    lights.appendChild(bulb);
                }
                for (var k = 0; k <= count; k++) {
                    var hook = document.createElement('span');
                    hook.className = 'jul-hook';
                    hook.style.setProperty('--i', k);
                    lights.appendChild(hook);
                }
            }
            buildLights();
            window.addEventListener('resize', buildLights);
            header.appendChild(lights);
        }

        /* ---------- Julgranskulor som hänger från projektkorten ---------- */
        var cardOrnaments = {
            'postcard-1': { tilt: 7, items: [
                { x: '24%', len: '30px', size: '22px', c: '#b3202a', d: '0s' },
                { x: '72%', len: '16px', size: '18px', c: '#d89f00', d: '-1.4s' }
            ]},
            'postcard-2': { tilt: -6, items: [
                { x: '60%', len: '34px', size: '20px', c: '#1f5b3a', d: '-0.7s' },
                { x: '87%', len: '14px', size: '16px', c: '#b3202a', d: '-2.2s' }
            ]},
            'postcard-3': { tilt: 4, items: [
                { x: '50%', len: '14px', size: '18px', c: '#d89f00', d: '-1s' }
            ]},
            'postcard-4': { tilt: -5, items: [
                { x: '35%', len: '14px', size: '18px', c: '#b3202a', d: '-0.4s' }
            ]}
        };
        Object.keys(cardOrnaments).forEach(function (cls) {
            var card = document.querySelector('.hero-postcard.' + cls);
            if (!card) return;
            var conf = cardOrnaments[cls];
            conf.items.forEach(function (o) {
                var el = document.createElement('span');
                el.className = 'jul-ornament';
                el.setAttribute('aria-hidden', 'true');
                el.style.setProperty('--x', o.x);
                el.style.setProperty('--len', o.len);
                el.style.setProperty('--size', o.size);
                el.style.setProperty('--c', o.c);
                el.style.setProperty('--d', o.d);
                el.style.setProperty('--counter', conf.tilt + 'deg');
                card.appendChild(el);
            });
        });

        /* ---------- Snödriva + hälsning i footern ---------- */
        var footer = document.querySelector('footer');
        if (footer) {
            var drift = document.createElement('div');
            drift.className = 'jul-snowdrift';
            drift.setAttribute('aria-hidden', 'true');
            footer.insertBefore(drift, footer.firstChild);

            var bottom = footer.querySelector('.footer-bottom > div');
            if (bottom) {
                var greet = document.createElement('span');
                greet.className = 'jul-footer-greeting';
                greet.textContent = ' · God jul! 🎄';
                bottom.appendChild(greet);
            }
        }

        /* ---------- Snöfall ----------
           Om besökaren har "minska rörelse" påslaget (t.ex. Windows-inställningen
           "Animationseffekter" avstängd) faller snön ändå, men lugnare och glesare. */
        var calm = reduceMotion ? 0.45 : 1;

        /* ---------- Snöfall i footern (bara där) + snö som samlas på marken ---------- */
        if (!footer) return;

        var fCanvas = document.createElement('canvas');
        fCanvas.className = 'jul-footer-snow jul-footer-flakes';
        fCanvas.setAttribute('aria-hidden', 'true');
        footer.insertBefore(fCanvas, footer.firstChild);
        var fctx = fCanvas.getContext('2d');

        // Snöhögen ritas på ett eget lager som bara uppdateras när den ändrats
        var pCanvas = document.createElement('canvas');
        pCanvas.className = 'jul-footer-snow jul-footer-pile';
        pCanvas.setAttribute('aria-hidden', 'true');
        footer.insertBefore(pCanvas, fCanvas.nextSibling);
        var pctx = pCanvas.getContext('2d');
        var pileDirty = true, pileFull = false, frame = 0, loopId = 0, scrapedNow = false;
        var bits = []; // snö som yr iväg när man skrapar

        // Mjuk snöflinga som förritad bild
        var sprite = document.createElement('canvas');
        sprite.width = sprite.height = 32;
        var sctx = sprite.getContext('2d');
        var grad = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.45, 'rgba(255,255,255,0.85)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, 32, 32);

        var layers = [
            { share: 0.5,  rMin: 0.8, rMax: 1.6, vMin: 0.25, vMax: 0.5,  oMin: 0.25, oMax: 0.45 },
            { share: 0.35, rMin: 1.6, rMax: 2.8, vMin: 0.5,  vMax: 0.9,  oMin: 0.5,  oMax: 0.75 },
            { share: 0.15, rMin: 3,   rMax: 4.6, vMin: 0.9,  vMax: 1.4,  oMin: 0.75, oMax: 0.95 }
        ];
        var fFlakes = [], fw = 0, fh = 0, fdpr = 1, wind = 0, windT = 0, running = false;

        /* --- Snöhögen: höjd per kolumn (var 4:e pixel) --- */
        var COL = 4;
        var START_H = 8;            // tunt snölager från början
        var GROWTH = 26;            // hur fort högen växer per landad flinga
        var pile = [];
        var maxPile = 400;          // sätts till hela footerns höjd i resizeFooter()
        var STORE = 'julSnowPile';
        var lastSave = 0;

        function rnd(a, b) { return a + Math.random() * (b - a); }

        function pickLayer() {
            var r = Math.random(), acc = 0;
            for (var i = 0; i < layers.length; i++) {
                acc += layers[i].share;
                if (r <= acc) return layers[i];
            }
            return layers[0];
        }

        function makeFooterFlake(randomY) {
            var L = pickLayer();
            return {
                x: Math.random() * fw,
                y: randomY ? Math.random() * (fh * 0.85) : rnd(-20, -4),
                r: rnd(L.rMin, L.rMax),
                v: rnd(L.vMin, L.vMax),
                o: rnd(L.oMin, L.oMax),
                phase: Math.random() * Math.PI * 2,
                sway: rnd(0.15, 0.6),
                landed: 0
            };
        }

        function resamplePile(cols) {
            if (!pile.length) {
                var saved = null;
                try { saved = JSON.parse(sessionStorage.getItem(STORE) || 'null'); } catch (e) {}
                pile = (saved && saved.length) ? saved : [];
            }
            if (!pile.length) {
                pile = [];
                for (var i = 0; i < cols; i++) pile.push(START_H + Math.sin(i * 0.15) * 1.5);
                return;
            }
            if (pile.length === cols) return;
            var out = [];
            for (var k = 0; k < cols; k++) {
                out.push(pile[Math.min(pile.length - 1, Math.floor(k / cols * pile.length))]);
            }
            pile = out;
        }

        function pileAt(x) {
            var i = Math.max(0, Math.min(pile.length - 1, Math.round(x / COL)));
            return pile[i];
        }

        function deposit(x, r) {
            if (pileFull) return;
            pileDirty = true;
            // lägg snö i en liten kulle runt landningspunkten
            var c = Math.round(x / COL), spread = 3;
            var amount = r * r * GROWTH;
            for (var d = -spread; d <= spread; d++) {
                var i = c + d;
                if (i < 0 || i >= pile.length) continue;
                var wgt = Math.exp(-(d * d) / 4) / 3.5;
                pile[i] = Math.min(maxPile, pile[i] + amount * wgt / COL);
            }
        }

        function settle() {
            // snön rasar ut om det blir för brant ...
            var maxSlope = 2.2; // tillåt branta kanter så att skrapade spår ligger kvar
            for (var pass = 0; pass < 3; pass++) {
                for (var i = 1; i < pile.length; i++) {
                    var diff = pile[i] - pile[i - 1];
                    if (diff > maxSlope) { var m = (diff - maxSlope) / 2; pile[i] -= m; pile[i - 1] += m; }
                    else if (diff < -maxSlope) { var n = (-diff - maxSlope) / 2; pile[i - 1] -= n; pile[i] += n; }
                }
            }
            // ... och jämnas ut till mjuka, rundade drivor
            var prev = pile[0];
            for (var k = 1; k < pile.length - 1; k++) {
                var cur = pile[k];
                pile[k] = cur * 0.9 + (prev + pile[k + 1]) * 0.05;
                prev = cur;
            }
        }

        function resizeFooter() {
            fdpr = Math.min(window.devicePixelRatio || 1, 2);
            fw = footer.clientWidth;
            fh = footer.clientHeight;
            // flingorna är mjuka och suddiga -> ritas i 1x upplösning (4x färre pixlar)
            fCanvas.width = fw;
            fCanvas.height = fh;
            pCanvas.width = fw * fdpr;
            pCanvas.height = fh * fdpr;
            fctx.setTransform(1, 0, 0, 1, 0, 0);
            pctx.setTransform(fdpr, 0, 0, fdpr, 0, 0);
            pileDirty = true;
            maxPile = Math.max(40, fh - 6); // snön kan täcka hela footern
            resamplePile(Math.ceil(fw / COL) + 1);
            for (var c = 0; c < pile.length; c++) if (pile[c] > maxPile) pile[c] = maxPile;
            var target = Math.round(Math.min(260, (fw * fh) / 2600) * (reduceMotion ? 0.5 : 1));
            while (fFlakes.length < target) fFlakes.push(makeFooterFlake(true));
            fFlakes.length = target;
        }

        function tracePile(offset) {
            pctx.beginPath();
            pctx.moveTo(0, fh);
            pctx.lineTo(0, fh - pile[0] - offset);
            for (var k = 1; k < pile.length - 1; k++) {
                var x = k * COL, y = fh - pile[k] - offset;
                var nx = (k + 1) * COL, ny = fh - pile[k + 1] - offset;
                pctx.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
            }
            pctx.lineTo(fw, fh - pile[pile.length - 1] - offset);
            pctx.lineTo(fw, fh);
            pctx.closePath();
        }

        function drawPile() {
            var top = fh;
            for (var i = 0; i < pile.length; i++) if (fh - pile[i] < top) top = fh - pile[i];
            pctx.clearRect(0, 0, fw, fh);
            var g = pctx.createLinearGradient(0, top, 0, fh);
            g.addColorStop(0, '#ffffff');
            g.addColorStop(0.35, '#f2f5f9');
            g.addColorStop(1, '#d9e1ea');
            pctx.fillStyle = g;
            tracePile(0); pctx.fill();
            pileDirty = false;
        }

        function tickFooter(ts, id) {
            if (!running || id !== loopId) return;
            frame++;
            windT += 0.004;
            wind = Math.sin(windT) * 0.35 + Math.sin(windT * 2.7) * 0.15;
            fctx.clearRect(0, 0, fw, fh);
            for (var i = 0; i < fFlakes.length; i++) {
                var f = fFlakes[i];
                if (f.landed) {
                    f.landed -= 0.02;
                    if (f.landed <= 0) { fFlakes[i] = makeFooterFlake(false); continue; }
                } else {
                    f.phase += 0.012;
                    f.y += f.v * calm;
                    f.x += (Math.sin(f.phase) * f.sway + wind * (f.r / 2.5)) * calm;
                    if (f.x > fw + 10) f.x = -10;
                    if (f.x < -10) f.x = fw + 10;
                    var ground = fh - pileAt(f.x);
                    if (f.y >= ground - f.r * 0.4) {
                        f.y = ground - f.r * 0.4;
                        f.landed = 1;
                        deposit(f.x, f.r);
                    }
                }
                var size = f.r * 2.6;
                fctx.globalAlpha = f.o * (f.landed ? f.landed : 1);
                fctx.drawImage(sprite, f.x - size / 2, f.y - size / 2, size, size);
            }
            // Snö som yr iväg när man skrapar
            for (var b = bits.length - 1; b >= 0; b--) {
                var s = bits[b];
                s.vy += 0.25; s.x += s.vx; s.y += s.vy; s.life -= 0.03;
                if (s.life <= 0 || s.y > fh + 10) { bits.splice(b, 1); continue; }
                var bs = s.r * 2.6;
                fctx.globalAlpha = Math.max(0, s.life);
                fctx.drawImage(sprite, s.x - bs / 2, s.y - bs / 2, bs, bs);
            }
            fctx.globalAlpha = 1;

            // Snöhögen ritas om direkt när man skrapar, annars högst ~6 gånger per sekund
            if (scrapedNow && pileDirty) {
                drawPile();
                scrapedNow = false;
            } else if (frame % 10 === 0 && pileDirty) {
                settle();
                drawPile();
                var full = true;
                for (var q = 0; q < pile.length; q++) if (pile[q] < maxPile - 1) { full = false; break; }
                pileFull = full;
            }

            if (ts - lastSave > 4000) {
                lastSave = ts;
                try { sessionStorage.setItem(STORE, JSON.stringify(pile.map(function (v) { return Math.round(v * 10) / 10; }))); } catch (e) {}
            }
            requestAnimationFrame(function (t) { tickFooter(t, id); });
        }

        function startLoop() {
            running = true;
            var id = ++loopId; // bara en animationsloop åt gången
            requestAnimationFrame(function (t) { tickFooter(t, id); });
        }

        /* --- Skrapa bort snön med muspekaren (eller fingret) --- */
        var SCRAPE_R = 38;
        function scrapeAt(clientX, clientY) {
            var rect = footer.getBoundingClientRect();
            var x = clientX - rect.left, y = clientY - rect.top;
            if (x < -SCRAPE_R || x > fw + SCRAPE_R || y < 0 || y > fh) return;
            var level = fh - y; // höjden där pekaren är
            if (pileAt(x) < level - SCRAPE_R * 0.5) return; // pekaren är ovanför snön
            var c0 = Math.round(x / COL), cr = Math.ceil(SCRAPE_R / COL), removed = 0;
            for (var d = -cr; d <= cr; d++) {
                var i = c0 + d;
                if (i < 0 || i >= pile.length) continue;
                var dx = d * COL;
                if (Math.abs(dx) > SCRAPE_R) continue;
                var target = Math.max(0, level - Math.sqrt(SCRAPE_R * SCRAPE_R - dx * dx));
                if (pile[i] > target) { removed += pile[i] - target; pile[i] = target; }
            }
            if (removed > 0) {
                pileDirty = true; pileFull = false; scrapedNow = true;
                var n = Math.min(7, Math.ceil(removed / 60));
                for (var k = 0; k < n && bits.length < 160; k++) {
                    bits.push({ x: x + rnd(-SCRAPE_R * 0.6, SCRAPE_R * 0.6), y: y - rnd(0, 10),
                                vx: rnd(-3, 3), vy: rnd(-5, -1.5), r: rnd(1.2, 3), life: 1 });
                }
            }
        }
        footer.addEventListener('pointermove', function (e) { scrapeAt(e.clientX, e.clientY); }, { passive: true });
        footer.addEventListener('touchmove', function (e) {
            if (e.touches && e.touches[0]) scrapeAt(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        // Tangentbord: skrapa fram länken man tabbar till så att den alltid syns
        footer.addEventListener('focusin', function (e) {
            var r = e.target.getBoundingClientRect(), fr = footer.getBoundingClientRect();
            var level = fh - (r.bottom - fr.top) - 6;
            for (var i = Math.floor((r.left - fr.left - 20) / COL); i <= Math.ceil((r.right - fr.left + 20) / COL); i++) {
                if (i >= 0 && i < pile.length && pile[i] > level) pile[i] = Math.max(0, level);
            }
            pileDirty = true; pileFull = false; scrapedNow = true;
            if (!running) drawPile();
        });

        resizeFooter();
        settle();
        drawPile();
        window.addEventListener('resize', resizeFooter);

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                var visible = entries[0].isIntersecting;
                if (visible && !running) { resizeFooter(); startLoop(); }
                else if (!visible) { running = false; }
            }).observe(footer);
        } else {
            startLoop();
        }
    });
})();
