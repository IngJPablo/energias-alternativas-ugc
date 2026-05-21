/**
 * ============================================================
 * ⚡ ENERGÍAS ALTERNATIVAS — UGC
 *    Lógica interactiva, simuladores físicos y motor de partículas
 *    Google I/O Style — 9 slides, 6 energías renovables
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. GESTIÓN DE NAVEGACIÓN SPA (9 diapositivas)
    // ============================================================
    let currentSlide = 0;
    const totalSlides = 9;

    const presentationContainer = document.getElementById('presentationContainer');
    const navDots = document.querySelectorAll('.nav-dot');
    const startBtn = document.getElementById('startBtn');
    const slideElements = document.querySelectorAll('.section-slide');

    // 🎨 Colores ambient Google I/O por slide (verde eco-tech dominante)
    const ambientColors = {
        0: 'rgba(0, 145, 61, 0.10)',   // Portada - Verde UGC
        1: 'rgba(245, 158, 11, 0.12)', // Solar - Ámbar
        2: 'rgba(20, 184, 166, 0.11)', // Eólica - Cian
        3: 'rgba(14, 165, 233, 0.12)', // Hidráulica - Azul Agua
        4: 'rgba(134, 239, 172, 0.10)',// Biomasa - Verde Lima
        5: 'rgba(251, 146, 60, 0.12)', // Geotérmica - Naranja Magma
        6: 'rgba(0, 210, 220, 0.12)',  // Hidrógeno - Cian Eléctrico
        7: 'rgba(0, 145, 61, 0.09)',   // Dashboard - Verde UGC
        8: 'rgba(0, 145, 61, 0.08)',   // Cronograma - Verde UGC
    };

    // 📊 Count-up animation — tipo Google I/O
    function countUp(element, targetStr, duration) {
        duration = duration || 1200;
        if (!element) return;
        var match = targetStr.match(/^([\d.]+)\s*(.*)$/);
        if (!match) return;
        var targetNum = parseFloat(match[1]);
        var rawSuffix = match[2] || '';
        var suffix = rawSuffix ? (rawSuffix.match(/^[%]/) ? rawSuffix : ' ' + rawSuffix) : '';
        var startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function tick(now) {
            var elapsed = now - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = easeOutExpo(progress);
            var current = targetNum * eased;
            var formatted = targetNum >= 100 ? Math.round(current) : current.toFixed(1);
            element.textContent = formatted + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlide = index;

        presentationContainer.style.transform = 'translateX(-' + (currentSlide * 100) + 'vw)';

        slideElements.forEach(function(slide, i) {
            slide.classList.toggle('active-slide', i === currentSlide);
        });

        navDots.forEach(function(d) { d.classList.remove('active'); });
        var activeDot = document.querySelector('.nav-dot[data-slide="' + currentSlide + '"]');
        if (activeDot) activeDot.classList.add('active');

        // 🎨 Ambient color por energía
        var ambient = ambientColors[index] || ambientColors[0];
        document.documentElement.style.setProperty('--active-ambient', ambient);

        handleSlideActivation(currentSlide);
    }

    navDots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            goToSlide(parseInt(dot.getAttribute('data-slide')));
        });
    });

    if (startBtn) startBtn.addEventListener('click', function() { goToSlide(1); });

    document.addEventListener('keydown', function(e) {
        switch (e.key) {
            case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
                e.preventDefault();
                if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
                break;
            case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
                e.preventDefault();
                if (currentSlide > 0) goToSlide(currentSlide - 1);
                break;
            case 'Home': e.preventDefault(); goToSlide(0); break;
            case 'End':  e.preventDefault(); goToSlide(totalSlides - 1); break;
        }
    });

    // Swipe táctil
    var touchStartX = 0;
    document.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; });
    document.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 60) {
            if (diff > 0 && currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
            if (diff < 0 && currentSlide > 0) goToSlide(currentSlide - 1);
        }
    });

    // ============================================================
    // 2. MOTOR DE PARTÍCULAS (Canvas Background)
    // ============================================================
    var canvas = document.getElementById('ecoParticlesCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var maxParticles = 55;
        var windSpeedFactor = 1.0;
        var windAngleDrift  = 0;
        var mouse = { x: null, y: null, radius: 140 };

        function resizeCanvas() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseleave', function() { mouse.x = null; mouse.y = null; });

        function TechNodeParticle() { this.reset(true); }

        TechNodeParticle.prototype.reset = function(init) {
            this.x = Math.random() * canvas.width;
            this.y = init ? Math.random() * canvas.height : -20;
            this.size   = Math.random() * 2.2 + 1.2;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.4 + 0.2;

            var r = Math.random();
            if      (r < 0.40) { this.hue = 146; this.sat = 100; this.lig = 28; } // Verde UGC
            else if (r < 0.62) { this.hue = 0;   this.sat = 0;   this.lig = 95; } // Blanco
            else if (r < 0.74) { this.hue = 42;  this.sat = 100; this.lig = 60; } // Oro solar
            else if (r < 0.84) { this.hue = 180; this.sat = 70;  this.lig = 45; } // Cian eólico
            else if (r < 0.91) { this.hue = 200; this.sat = 85;  this.lig = 42; } // Azul hidráulica
            else if (r < 0.96) { this.hue = 22;  this.sat = 90;  this.lig = 52; } // Naranja geotérmica
            else               { this.hue = 190; this.sat = 100; this.lig = 45; } // Cian H₂

            this.opacity       = Math.random() * 0.35 + 0.2;
            this.flickerSpeed  = Math.random() * 0.03 + 0.01;
            this.flickerOffset = Math.random() * Math.PI;
        };

        TechNodeParticle.prototype.update = function() {
            var vy = this.speedY * windSpeedFactor * 0.85;
            var dx = windAngleDrift * vy * 3.2;
            this.y += vy;
            this.x += this.speedX * (1 + windSpeedFactor * 0.15) + dx;

            if (mouse.x !== null && mouse.y !== null) {
                var distX = this.x - mouse.x;
                var distY = this.y - mouse.y;
                var dist  = Math.sqrt(distX * distX + distY * distY);
                if (dist < mouse.radius) {
                    var force = (mouse.radius - dist) / mouse.radius;
                    this.x += (distX / dist) * force * 4.5;
                    this.y += (distY / dist) * force * 4.5;
                }
            }
            if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                this.reset(false);
            }
        };

        TechNodeParticle.prototype.draw = function() {
            var p = this.opacity * (0.65 + Math.sin(Date.now() * this.flickerSpeed + this.flickerOffset) * 0.35);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.8);
            grad.addColorStop(0, 'hsla(' + this.hue + ',' + this.sat + '%,' + this.lig + '%,' + p + ')');
            grad.addColorStop(1, 'hsla(' + this.hue + ',' + this.sat + '%,' + this.lig + '%,0)');
            ctx.fillStyle = grad;
            ctx.fill();
        };

        function initParticles() {
            particles = [];
            for (var i = 0; i < maxParticles; i++) particles.push(new TechNodeParticle());
        }
        initParticles();

        function drawGridConnections() {
            ctx.lineWidth = 0.65;
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var p1 = particles[i], p2 = particles[j];
                    var dx = p1.x - p2.x, dy = p1.y - p2.y;
                    var dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 130) {
                        var alpha = (1 - dist / 130) * 0.16;
                        var grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                        grad.addColorStop(0, 'hsla(' + p1.hue + ',' + p1.sat + '%,' + p1.lig + '%,' + alpha + ')');
                        grad.addColorStop(1, 'hsla(' + p2.hue + ',' + p2.sat + '%,' + p2.lig + '%,' + alpha + ')');
                        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = grad; ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGridConnections();
            particles.forEach(function(p) { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        window.updateAmbientWindEffect = function(speed) {
            windSpeedFactor  = 1.0 + (speed / 5.0);
            windAngleDrift   = (speed / 25) * 0.42;
        };
    }

    // ============================================================
    // 3. SIMULADOR SOLAR — P = G × A × η(T)
    // ============================================================
    var solarSlider         = document.getElementById('solarSlider');
    var solarIntensityLabel = document.getElementById('solarIntensityLabel');
    var solarPowerVal       = document.getElementById('solarPowerVal');
    var solarEfficiencyVal  = document.getElementById('solarEfficiencyVal');
    var BASE_EFFICIENCY     = 21.8;

    function updateSolarSimulation() {
        if (!solarSlider) return;
        var intensity = parseInt(solarSlider.value);
        solarIntensityLabel.textContent = intensity + ' W/m²';

        var heatLoss = intensity > 850 ? (intensity - 850) * 0.0015 : 0;
        var noise    = (Math.random() - 0.5) * 0.1;
        var eff      = Math.max(12, BASE_EFFICIENCY - heatLoss + noise);
        solarEfficiencyVal.textContent = eff.toFixed(1) + '%';

        var power = intensity > 0 ? Math.round(intensity * 2.08 * (eff / 100)) : 0;
        solarPowerVal.textContent = power + ' W';
    }

    if (solarSlider) {
        solarSlider.addEventListener('input', updateSolarSimulation);
        setInterval(function() {
            if (currentSlide === 1) {
                var v = parseInt(solarSlider.value);
                solarSlider.value = Math.min(1200, Math.max(0, v + Math.round((Math.random()-0.5)*4)));
                updateSolarSimulation();
            }
        }, 1500);
        updateSolarSimulation();
    }

    // ============================================================
    // 4. SIMULADOR EÓLICO — P = ½ × ρ × A × v³ × Cp
    // ============================================================
    var windSlider         = document.getElementById('windSlider');
    var windIntensityLabel = document.getElementById('windIntensityLabel');
    var windPowerVal       = document.getElementById('windPowerVal');
    var windFrequencyVal   = document.getElementById('windFrequencyVal');
    var turbineBlades      = document.getElementById('turbineBlades');

    function updateWindSimulation() {
        if (!windSlider) return;
        var speed = parseFloat(windSlider.value);
        windIntensityLabel.textContent = speed.toFixed(1) + ' m/s';

        if (window.updateAmbientWindEffect) window.updateAmbientWindEffect(speed);

        if (speed < 1.5) {
            if (turbineBlades) turbineBlades.style.animationPlayState = 'paused';
            windPowerVal.textContent = '0 W';
            windFrequencyVal.textContent = '0.0 Hz';
        } else {
            if (turbineBlades) {
                turbineBlades.style.animationPlayState = 'running';
                turbineBlades.style.animationDuration  = Math.max(0.35, 16 / Math.pow(speed, 0.75)) + 's';
            }
            var freq  = speed * 1.92 + (Math.random()-0.5)*0.15;
            windFrequencyVal.textContent = Math.max(0, freq).toFixed(1) + ' Hz';

            var power = Math.round(Math.pow(speed, 2.3) * 3.8 + (Math.random()-0.5)*5);
            var display = power > 999 ? (power/1000).toFixed(2) + ' kW' : Math.max(0,power) + ' W';
            windPowerVal.textContent = display;
        }
    }

    if (windSlider) {
        windSlider.addEventListener('input', updateWindSimulation);
        setInterval(function() {
            if (currentSlide === 2) {
                var v = parseFloat(windSlider.value);
                windSlider.value = Math.min(25, Math.max(0, v + (Math.random()-0.5)*0.6)).toFixed(1);
                updateWindSimulation();
            }
        }, 1200);
        updateWindSimulation();
    }

    // ============================================================
    // 5. SIMULADOR HIDRÁULICO — P = ρ × g × Q × H × η
    // ============================================================
    var hydroSlider    = document.getElementById('hydroSlider');
    var hydroFlowLabel = document.getElementById('hydroFlowLabel');
    var hydroPowerVal  = document.getElementById('hydroPowerVal');
    var hydroEffVal    = document.getElementById('hydroEfficiencyVal'); // ID corregido

    function updateHydroSimulation() {
        if (!hydroSlider) return;
        var Q = parseFloat(hydroSlider.value);
        hydroFlowLabel.textContent = Q.toFixed(1) + ' m³/s';

        var eff = Math.max(0.78, 0.85 + (Math.random()-0.5)*0.01);
        if (hydroEffVal) hydroEffVal.textContent = (eff * 100).toFixed(1) + '%';

        // H = 18m (caída típica canal urbano/pico-hidro), ρ = 1000 kg/m³, g = 9.81 m/s²
        var H = 18;
        var power = Q > 0 ? eff * 1000 * 9.81 * Q * H : 0;
        var display = power >= 1e6 ? (power/1e6).toFixed(2) + ' MW'
                    : power >= 1e3 ? (power/1e3).toFixed(1) + ' kW'
                    : Math.round(power) + ' W';
        hydroPowerVal.textContent = display;

        // Animar generador SVG
        var hydroGen = document.getElementById('hydroGenerator');
        if (hydroGen && Q > 0) {
            var dur = Math.max(0.3, 3 / Math.sqrt(Q + 0.01));
            hydroGen.style.animationDuration = dur + 's';
            hydroGen.style.animationPlayState = 'running';
        } else if (hydroGen) {
            hydroGen.style.animationPlayState = 'paused';
        }
    }

    if (hydroSlider) {
        hydroSlider.addEventListener('input', updateHydroSimulation);
        setInterval(function() {
            if (currentSlide === 3) {
                var v = parseFloat(hydroSlider.value);
                hydroSlider.value = Math.min(15, Math.max(0, v + (Math.random()-0.5)*0.2)).toFixed(1);
                updateHydroSimulation();
            }
        }, 1800);
        updateHydroSimulation();
    }

    // ============================================================
    // 6. SIMULADOR BIOMASA — E = mdot × PCI × η_digestor × η_gen
    // ============================================================
    var biomassSlider    = document.getElementById('biomassSlider');
    var biomassLoadLabel = document.getElementById('biomassLoadLabel'); // ID corregido
    var biomassPowerVal  = document.getElementById('biomassPowerVal');
    var biomassGasVal    = document.getElementById('biomassGasVal');   // ID corregido

    function updateBiomassSimulation() {
        if (!biomassSlider) return;
        var mdot = parseFloat(biomassSlider.value); // kg/día
        if (biomassLoadLabel) biomassLoadLabel.textContent = mdot.toFixed(0) + ' kg/día';

        // Producción de biogás: ~0.45 m³/kg biomasa húmeda
        var biogasM3 = mdot * 0.45;
        if (biomassGasVal) biomassGasVal.textContent = biogasM3.toFixed(1) + ' m³/día';

        // Energía eléctrica: biogás → generador con η_gen=0.35, PCI_CH4=36 MJ/m³
        var energyKWh = biogasM3 * 0.60 * 36 * 0.35 / 3.6; // 60% CH4 en biogás
        var powerW = (energyKWh * 1000) / 24; // kWh/día → W promedio
        var display = powerW >= 1000 ? (powerW/1000).toFixed(1) + ' kW' : Math.round(powerW) + ' W';
        biomassPowerVal.textContent = display;
    }

    if (biomassSlider) {
        biomassSlider.addEventListener('input', updateBiomassSimulation);
        setInterval(function() {
            if (currentSlide === 4) {
                var v = parseFloat(biomassSlider.value);
                biomassSlider.value = Math.min(500, Math.max(0, v + (Math.random()-0.5)*3)).toFixed(0);
                updateBiomassSimulation();
            }
        }, 2000);
        updateBiomassSimulation();
    }

    // ============================================================
    // 7. SIMULADOR GEOTÉRMICO — COP bomba de calor
    //    COP = Q_calor / W_elect ≈ T_suelo / (T_suelo - T_ext)
    // ============================================================
    var geoSlider    = document.getElementById('geoSlider');
    var geoTempLabel = document.getElementById('geoTempLabel');
    var geoCOPVal    = document.getElementById('geoCOPVal');    // ID corregido
    var geoThermalVal = document.getElementById('geoThermalVal'); // ID corregido

    function updateGeoSimulation() {
        if (!geoSlider) return;
        var T_suelo_C = parseFloat(geoSlider.value); // °C
        if (geoTempLabel) geoTempLabel.textContent = T_suelo_C + '°C';

        // COP teórico de bomba de calor geotérmica
        // T_ext asumida = 5°C exterior (en K)
        var T_suelo_K = T_suelo_C + 273.15;
        var T_ext_K   = 5 + 273.15;
        var COP_carnot = T_suelo_K / (T_suelo_K - T_ext_K);
        // COP real ≈ 60% del Carnot
        var COP_real  = Math.min(6.5, COP_carnot * 0.55 + (Math.random()-0.5)*0.05);
        if (geoCOPVal) geoCOPVal.textContent = COP_real > 0 && isFinite(COP_real) ? COP_real.toFixed(2) : '—';

        // Potencia térmica: W_elec_entrada = 10 kW base, Q_calor = COP × W
        var W_elec = 10; // kW de electricidad consumida por la bomba
        var Q_thermal = COP_real * W_elec;
        if (geoThermalVal) geoThermalVal.textContent = Q_thermal.toFixed(1) + ' kW';
    }

    if (geoSlider) {
        geoSlider.addEventListener('input', updateGeoSimulation);
        setInterval(function() {
            if (currentSlide === 5) {
                // Fluctuación pequeña de temperatura del subsuelo
                var v = parseFloat(geoSlider.value);
                geoSlider.value = Math.min(150, Math.max(8, v + (Math.random()-0.5)*0.3)).toFixed(0);
                updateGeoSimulation();
            }
        }, 2200);
        updateGeoSimulation();
    }

    // ============================================================
    // 8. SIMULADOR HIDRÓGENO VERDE — m_H2 = (P × η) / HHV_H2
    // ============================================================
    var hydrogenSlider          = document.getElementById('hydrogenSlider');
    var hydrogenPowerLabel      = document.getElementById('hydrogenPowerLabel');
    var hydrogenProductionVal   = document.getElementById('hydrogenProductionVal');
    var hydrogenEfficiencyVal   = document.getElementById('hydrogenEfficiencyVal');

    function updateHydrogenSimulation() {
        if (!hydrogenSlider) return;
        var P_kW = parseFloat(hydrogenSlider.value);
        if (hydrogenPowerLabel) hydrogenPowerLabel.textContent = P_kW + ' kW';

        if (P_kW < 5) {
            // Por debajo del umbral de arranque del electrolizador
            if (hydrogenProductionVal) hydrogenProductionVal.textContent = '0.0 kg/h';
            if (hydrogenEfficiencyVal) hydrogenEfficiencyVal.textContent = '0%';
            return;
        }

        // HHV del H₂ = 39.4 kWh/kg
        // η PEM típico = 65-70% a carga parcial, 70-75% a carga plena
        var loadRatio = P_kW / 100;
        var eta = 0.63 + loadRatio * 0.10 + (Math.random()-0.5)*0.005;
        eta = Math.min(0.76, eta);
        if (hydrogenEfficiencyVal) hydrogenEfficiencyVal.textContent = (eta * 100).toFixed(1) + '%';

        var HHV_H2 = 39.4; // kWh/kg
        var m_H2_kgh = (P_kW * eta) / HHV_H2;
        if (hydrogenProductionVal) hydrogenProductionVal.textContent = m_H2_kgh.toFixed(3) + ' kg/h';
    }

    if (hydrogenSlider) {
        hydrogenSlider.addEventListener('input', updateHydrogenSimulation);
        setInterval(function() {
            if (currentSlide === 6) {
                var v = parseFloat(hydrogenSlider.value);
                hydrogenSlider.value = Math.min(100, Math.max(0, v + (Math.random()-0.5)*0.5)).toFixed(0);
                updateHydrogenSimulation();
            }
        }, 1600);
        updateHydrogenSimulation();
    }

    // ============================================================
    // 9. DASHBOARD COMPARATIVO — Animación de barras SVG
    // ============================================================
    function animateDashboardBars() {
        var bars = document.querySelectorAll('.chart-bar-dash');
        bars.forEach(function(bar, i) {
            var finalY = parseInt(bar.getAttribute('data-final-y'));
            var finalH = parseInt(bar.getAttribute('data-final-h'));
            // Inicio: barra colapsada en el eje
            bar.setAttribute('y',      '195');
            bar.setAttribute('height', '0');
            // CSS transition ya está aplicado, reasignamos con delay
            setTimeout(function() {
                bar.setAttribute('y',      finalY.toString());
                bar.setAttribute('height', finalH.toString());
            }, 100 + i * 180);
        });
    }

    function resetDashboardBars() {
        var bars = document.querySelectorAll('.chart-bar-dash');
        bars.forEach(function(bar) {
            bar.setAttribute('y',      '195');
            bar.setAttribute('height', '0');
        });
    }

    // Añadir transición CSS a las barras del dashboard
    (function addBarTransitions() {
        var style = document.createElement('style');
        style.textContent = '.chart-bar-dash { transition: y 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.65s cubic-bezier(0.34, 1.56, 0.64, 1); }';
        document.head.appendChild(style);
    })();

    // ============================================================
    // 10. CONTROLADOR DE ACTIVACIÓN POR DIAPOSITIVA
    // ============================================================
    function handleSlideActivation(slideIndex) {
        if (slideIndex === 7) {
            resetDashboardBars();
            setTimeout(animateDashboardBars, 400);
        } else {
            resetDashboardBars();
        }

        if (slideIndex === 1 && solarSlider)   { solarSlider.value = 750;  updateSolarSimulation(); }
        if (slideIndex === 2 && windSlider)    { windSlider.value  = 6.5;  updateWindSimulation(); }
        if (slideIndex === 3 && hydroSlider)   { hydroSlider.value = 5;    updateHydroSimulation(); }
        if (slideIndex === 4 && biomassSlider) { biomassSlider.value = 200; updateBiomassSimulation(); }
        if (slideIndex === 5 && geoSlider)    { geoSlider.value   = 18;   updateGeoSimulation(); }
        if (slideIndex === 6 && hydrogenSlider){ hydrogenSlider.value = 50; updateHydrogenSimulation(); }
    }

    // ============================================================
    // INICIALIZACIÓN
    // ============================================================
    resetDashboardBars();
    goToSlide(0);
});
