document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. FLOATING PARTICLE BACKGROUND SYSTEM
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const cursorGlow = document.querySelector('.cursor-glow');

        let width, height;
        let particles = [];

        // FontAwesome Unicode icons
        const icons = [
            '\uf4e4', // Java (Brands)
            '\uf17b', // Android (Brands)
            '\ue694', // Flutter (Brands)
            '\uf293', // Bluetooth (Brands)
            '\uf21c', // Motorcycle (Solid)
            '\uf5e7', // Charging Station (Solid)
            '\uf2db', // Microchip (Solid)
            '\uf1eb', // Wifi (Solid)
            '\uf240', // Battery Full (Solid)
            '\uf1b9', // Car (Solid)
            '\uf0e7', // Bolt (Solid)
            '\uf624'  // Gauge (Solid)
        ];

        const brandIcons = ['\uf4e4', '\uf17b', '\ue694', '\uf293'];

        const bgContainer = document.querySelector('.developer-bg-container');
        width = bgContainer ? bgContainer.clientWidth : window.innerWidth;
        height = bgContainer ? bgContainer.clientHeight : window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width !== width || entry.contentRect.height !== height) {
                    width = entry.contentRect.width;
                    height = entry.contentRect.height;
                    canvas.width = width;
                    canvas.height = height;
                    initParticles();
                }
            }
        });
        if (bgContainer) resizeObserver.observe(bgContainer);

        let mouseX = -1000, mouseY = -1000;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (cursorGlow) {
                cursorGlow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            }
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 20 + 20; // 20px to 40px
                this.speedY = Math.random() * 0.4 + 0.1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.symbol = icons[Math.floor(Math.random() * icons.length)];

                // Set appropriate font family
                if (brandIcons.includes(this.symbol)) {
                    this.font = `400 ${this.size}px "Font Awesome 6 Brands"`;
                } else {
                    this.font = `900 ${this.size}px "Font Awesome 6 Free"`;
                }

                this.opacity = Math.random() * 0.12 + 0.06;
                this.baseColor = 'rgba(148, 163, 184,';
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;

                if (this.y < -50) {
                    this.y = height + 50;
                    this.x = Math.random() * width;
                }
                if (this.x < -50 || this.x > width + 50) {
                    this.speedX *= -1;
                }

                // Interactive Glow on mouse approach
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    this.color = `rgba(0, 242, 254, ${this.opacity + 0.22})`;
                } else {
                    this.color = `${this.baseColor} ${this.opacity})`;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.font = this.font;
                ctx.fillStyle = this.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.symbol, this.x, this.y);
            }
        }

        function initParticles() {
            particles = [];
            if (!width) return;
            const count = 40;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            if (!ctx || !width) return;
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => p.update());
            particles.forEach(p => p.draw());
            requestAnimationFrame(animate);
        }

        Promise.race([
            document.fonts.ready,
            new Promise(resolve => setTimeout(resolve, 800))
        ]).then(() => {
            initParticles();
            animate();
        });
    }

    // ==========================================
    // 2. HERO TYPING EFFECT
    // ==========================================
    const dynamicText = document.querySelector('.dynamic-text');
    if (dynamicText) {
        const words = [
            "a Senior Software Engineer",
            "a Vehicle Diagnostics Specialist (UDS & OBD-II)",
            "an Android & Kotlin Specialist",
            "a Flutter Cross-Platform Developer",
            "an ECU Flashing & FOTA Engineer"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const typeEffect = () => {
            const currentWord = words[wordIndex];
            const currentChar = currentWord.substring(0, charIndex);

            dynamicText.textContent = currentChar;
            dynamicText.classList.add('stop-blinking');

            if (!isDeleting && charIndex < currentWord.length) {
                charIndex++;
                setTimeout(typeEffect, 75);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTimeout(typeEffect, 35);
            } else {
                isDeleting = !isDeleting;
                dynamicText.classList.remove('stop-blinking');
                wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
                setTimeout(typeEffect, 1500); // Hold time
            }
        };

        typeEffect();
    }

    // ==========================================
    // 3. RESPONSIVE MOBILE NAVIGATION MENU
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            const isMenuOpen = navLinks.classList.contains('mobile-active');
            
            if (isMenuOpen) {
                navLinks.classList.remove('mobile-active');
                navLinks.style.display = 'none';
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                navLinks.classList.add('mobile-active');
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(4, 4, 12, 0.95)';
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid var(--card-border)';
                navLinks.style.backdropFilter = 'blur(20px)';
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('mobile-active')) {
                    navLinks.classList.remove('mobile-active');
                    navLinks.style.display = 'none';
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // Scroll Active Navigation Highlight
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 220)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });

    // ==========================================
    // 4. INTERACTIVE DIAGNOSTIC CONSOLE LOGIC
    // ==========================================
    
    // Console State
    let isVciConnected = false;
    let selectedMedium = 'BT Classic';
    let selectedEcu = 'tvs_uds';
    let telemetryInterval = null;
    let canStreamInterval = null;
    let isCanStreamPaused = false;
    let pcanFramesCounter = 0;
    
    // PCAN-Viewer Message database mapping (Single row in receive list for unique IDs)
    let pcanMessages = {};

    // DOM Elements
    const connectVciBtn = document.getElementById('connectVciBtn');
    const vciStatusText = document.getElementById('vciStatusText');
    const ecuSelector = document.getElementById('ecuSelector');
    const mediumButtons = document.querySelectorAll('.connection-selector button');
    
    const actionButtons = {
        readDtc: document.getElementById('readDtcBtn'),
        clearDtc: document.getElementById('clearDtcBtn'),
        liveData: document.getElementById('liveDataBtn'),
        flashEcu: document.getElementById('flashEcuBtn')
    };

    const terminalLog = document.getElementById('terminalLog');
    const clearTerminalBtn = document.getElementById('clearTerminalBtn');
    
    const consoleTabs = document.querySelectorAll('.console-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    const flashProgressContainer = document.getElementById('flashProgressContainer');
    const progressBar = document.getElementById('progressBar');
    const flashStatusLabel = document.getElementById('flashStatusLabel');
    const flashTimeLabel = document.getElementById('flashTimeLabel');
    
    const canStreamBody = document.getElementById('canStreamBody');
    const toggleCanBtn = document.getElementById('toggleCanBtn');
    const canFilterInput = document.getElementById('canFilter');
    const pcanFrameCount = document.getElementById('pcanFrameCount');

    // Telemetry display DOM
    const rpmVal = document.getElementById('rpmVal');
    const voltVal = document.getElementById('voltVal');
    const socVal = document.getElementById('socVal');
    const socUnit = document.getElementById('socUnit');
    const rpmGauge = document.getElementById('rpmGauge');
    const voltGauge = document.getElementById('voltGauge');
    const socGauge = document.getElementById('socGauge');

    // Smartphone Mockup DOM Elements
    const phoneStatusIndicator = document.getElementById('phoneStatusIndicator');
    const phoneStatusText = document.getElementById('phoneStatusText');
    const phoneRpm = document.getElementById('phoneRpm');
    const phoneVolt = document.getElementById('phoneVolt');
    const phoneDtcList = document.getElementById('phoneDtcList');
    const phoneFotaStatus = document.getElementById('phoneFotaStatus');
    const phoneProgressBg = document.getElementById('phoneProgressBg');
    const phoneProgressBar = document.getElementById('phoneProgressBar');
    const phoneIoBtn = document.getElementById('phoneIoBtn');
    const phoneIoStatus = document.getElementById('phoneIoStatus');
    
    // Realtime Canvas Chart
    const telemetryChart = document.getElementById('telemetryChart');
    let chartCtx = null;
    let chartPoints = [];
    const maxChartPoints = 40;
    
    if (telemetryChart) {
        chartCtx = telemetryChart.getContext('2d');
    }

    // Console Logging Helper
    function logToConsole(message, type = 'system') {
        if (!terminalLog) return;
        const now = new Date();
        const timestamp = `[${now.toTimeString().split(' ')[0]}]`;
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        
        let prefix = '';
        if (type === 'vci-out') prefix = 'VCI >> ';
        if (type === 'ecu-in') prefix = 'ECU << ';
        if (type === 'ecu-err') prefix = 'ERR !! ';
        
        line.textContent = `${timestamp} ${prefix}${message}`;
        terminalLog.appendChild(line);
        terminalLog.scrollTop = terminalLog.scrollHeight;
    }

    // Toggle Console Tabs
    consoleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            consoleTabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const pane = document.getElementById(`pane-${targetTab}`);
            if (pane) pane.classList.add('active');
            
            if (targetTab === 'telemetry' && telemetryChart) {
                telemetryChart.width = telemetryChart.parentElement.clientWidth;
                telemetryChart.height = 140;
                drawChart();
            }
        });
    });

    // Connection Medium Select
    mediumButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isVciConnected) {
                logToConsole(`Cannot change connection medium while active. Disconnect first.`, 'ecu-err');
                return;
            }
            mediumButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMedium = btn.getAttribute('data-medium');
            logToConsole(`Medium changed to: ${selectedMedium}`);
        });
    });

    // VCI Connection Logic
    if (connectVciBtn) {
        connectVciBtn.addEventListener('click', () => {
            if (isVciConnected) {
                disconnectVCI();
            } else {
                connectVCI();
            }
        });
    }

    function connectVCI() {
        connectVciBtn.disabled = true;
        selectedEcu = ecuSelector.value;
        logToConsole(`Initializing VCI driver via ${selectedMedium}...`, 'system');
        
        let progress = 0;
        const messages = [
            `Detecting USB-VCI / BLE Hardware dongle...`,
            `Loading CAN device stack (PCAN-USB Pass-thru)...`,
            `Establishing handshake with OBD protocol layer...`,
            `Querying target ECU system status...`
        ];
        
        const initInterval = setInterval(() => {
            if (progress < messages.length) {
                logToConsole(messages[progress]);
                progress++;
            } else {
                clearInterval(initInterval);
                finishConnection();
            }
        }, 250);
    }

    function finishConnection() {
        isVciConnected = true;
        connectVciBtn.disabled = false;
        connectVciBtn.classList.add('connected');
        connectVciBtn.querySelector('span').textContent = 'VCI DISCONNECT';
        
        vciStatusText.classList.remove('disconnected');
        vciStatusText.classList.add('connected');
        
        let ecuFriendlyName = getEcuName(selectedEcu);
        vciStatusText.innerHTML = `<i class="fa-solid fa-circle-check"></i> Connected: ${selectedMedium}`;
        
        logToConsole(`Session opened at 500kbps. Active Channel: CAN Bus.`, 'vci-out');
        logToConsole(`Positive Response received from ECU address $10. Status: Session Active.`, 'ecu-in');
        
        // Update Smartphone Screen Mockup
        if (phoneStatusIndicator) {
            phoneStatusIndicator.className = 'status-indicator online';
        }
        if (phoneStatusText) {
            phoneStatusText.textContent = 'VCI Connected';
        }
        if (phoneIoBtn) {
            phoneIoBtn.disabled = false;
        }

        // Enable diagnostic actions
        Object.values(actionButtons).forEach(btn => {
            if (btn) btn.disabled = false;
        });

        // Auto start PCAN CAN frame stream simulation
        startCanStream();
    }

    function disconnectVCI() {
        logToConsole(`Terminating diagnostic session...`, 'system');
        disconnectActions();
    }

    function disconnectActions() {
        isVciConnected = false;
        connectVciBtn.classList.remove('connected');
        connectVciBtn.querySelector('span').textContent = 'INITIALIZE VCI';
        
        vciStatusText.classList.remove('connected');
        vciStatusText.classList.add('disconnected');
        vciStatusText.innerHTML = `VCI Status: Offline`;
        
        logToConsole(`VCI interface disconnected. Protocol session closed.`, 'system');
        
        // Reset phone mockup UI
        if (phoneStatusIndicator) {
            phoneStatusIndicator.className = 'status-indicator';
        }
        if (phoneStatusText) {
            phoneStatusText.textContent = 'VCI Offline';
        }
        if (phoneIoBtn) {
            phoneIoBtn.disabled = true;
        }
        if (phoneIoStatus) {
            phoneIoStatus.className = 'phone-io-status idle';
            phoneIoStatus.textContent = 'IO State: Inactive';
        }
        if (phoneRpm) phoneRpm.textContent = '0 RPM';
        if (phoneVolt) phoneVolt.textContent = '0.0V';
        if (phoneDtcList) {
            phoneDtcList.innerHTML = `<div class="mini-dtc none">No active diagnostic faults</div>`;
        }
        if (phoneFotaStatus) {
            phoneFotaStatus.textContent = 'FOTA Idle';
        }
        if (phoneProgressBg) {
            phoneProgressBg.classList.add('hidden');
        }
        
        // Reset mini chart bar heights
        for (let i = 1; i <= 10; i++) {
            const bar = document.getElementById(`mbar${i}`);
            if (bar) {
                bar.style.height = '10%';
                bar.classList.remove('active');
            }
        }

        // Disable action buttons
        Object.values(actionButtons).forEach(btn => {
            if (btn) btn.disabled = true;
        });

        // Clean intervals
        stopTelemetry();
        stopCanStream();
        
        // Reset Dial gauges
        updateGauges(0, 0, 0);
        chartPoints = [];
        drawChart();
    }

    function getEcuName(val) {
        switch (val) {
            case 'tvs_uds': return 'TVS RIDEScan ECU';
            case 'bmw_k01': return 'BMW K01 ECU';
            case 'drivex_obd': return 'DriveX OBD-II';
            case 'ev_vcu': return 'Electric VCU';
            default: return 'Generic ECU';
        }
    }

    // Action 1: Read DTCs
    if (actionButtons.readDtc) {
        actionButtons.readDtc.addEventListener('click', () => {
            if (!isVciConnected) return;
            
            logToConsole(`Sending UDS Service $19 (ReadDTCInformation)...`, 'vci-out');
            
            setTimeout(() => {
                logToConsole(`ECU Response: 59 02 0D (DTC By Status Mask Positive)...`, 'ecu-in');
                
                // Show faults depending on selected vehicle & update mobile phone display
                if (phoneDtcList) phoneDtcList.innerHTML = '';
                
                if (selectedEcu === 'tvs_uds') {
                    logToConsole(`[DTC Found] P0302: Cylinder 2 Misfire Detected [Active]`, 'ecu-err');
                    logToConsole(`[DTC Found] U0100: Lost Communication with Cluster [Pending]`, 'ecu-err');
                    if (phoneDtcList) {
                        phoneDtcList.innerHTML = `
                            <div class="mini-dtc">P0302 - Misfire Cyl 2</div>
                            <div class="mini-dtc">U0100 - Lost Comm</div>
                        `;
                    }
                } else if (selectedEcu === 'ev_vcu') {
                    logToConsole(`[DTC Found] B0240: BMS Cell Voltage Balance Mismatch [Active]`, 'ecu-err');
                    logToConsole(`[DTC Found] P0A80: Replace Hybrid Battery Pack [Historic]`, 'ecu-err');
                    if (phoneDtcList) {
                        phoneDtcList.innerHTML = `
                            <div class="mini-dtc">B0240 - Cell Balance</div>
                            <div class="mini-dtc">P0A80 - Replace Pack</div>
                        `;
                    }
                } else if (selectedEcu === 'bmw_k01') {
                    logToConsole(`[DTC Found] C1025: ABS Sensor Rear Line Interruption [Active]`, 'ecu-err');
                    if (phoneDtcList) {
                        phoneDtcList.innerHTML = `<div class="mini-dtc">C1025 - ABS Rear</div>`;
                    }
                } else {
                    logToConsole(`[DTC Found] P0102: Mass Air Flow Sensor Low Input [Historic]`, 'ecu-err');
                    if (phoneDtcList) {
                        phoneDtcList.innerHTML = `<div class="mini-dtc">P0102 - MAF Low</div>`;
                    }
                }
                
                logToConsole(`Diagnostic Scan completed. Stored DTCs reported.`, 'system');
            }, 500);
        });
    }

    // Action 2: Clear DTCs
    if (actionButtons.clearDtc) {
        actionButtons.clearDtc.addEventListener('click', () => {
            if (!isVciConnected) return;
            
            logToConsole(`Sending UDS Service $14 (ClearDiagnosticInformation) payload: FF FF FF...`, 'vci-out');
            
            setTimeout(() => {
                logToConsole(`ECU Response: 54 (DTC Cleared Positive Response)`, 'ecu-in');
                logToConsole(`DTC clear sequence completed successfully. Fault flags cleared from EEPROM.`, 'system');
                logToConsole(`Querying DTC Status... No Diagnostic Trouble Codes stored.`, 'ecu-in');
                
                // Clear phone mockup list
                if (phoneDtcList) {
                    phoneDtcList.innerHTML = `<div class="mini-dtc none">No active diagnostic faults</div>`;
                }
            }, 600);
        });
    }

    // Phone IO Control Button Trigger
    if (phoneIoBtn) {
        phoneIoBtn.addEventListener('click', () => {
            if (!isVciConnected) return;
            
            const isCurrentlyActive = phoneIoStatus.classList.contains('active');
            if (isCurrentlyActive) {
                phoneIoStatus.className = 'phone-io-status idle';
                phoneIoStatus.textContent = 'IO State: Inactive';
                logToConsole(`UDS Service $2F (InputOutputControlByIdentifier) - Terminating override...`, 'vci-out');
                setTimeout(() => {
                    logToConsole(`ECU Response: 6F (Control returned to ECU logic)`, 'ecu-in');
                    logToConsole(`IO Control test completed. Actuators returned to normal.`, 'system');
                }, 200);
            } else {
                phoneIoStatus.className = 'phone-io-status active';
                phoneIoStatus.textContent = 'IO State: ACTIVE';
                logToConsole(`UDS Service $2F (InputOutputControlByIdentifier) - Overriding Fuel Pump Relay...`, 'vci-out');
                setTimeout(() => {
                    logToConsole(`ECU Response: 6F (Control Override Positive Response)`, 'ecu-in');
                    logToConsole(`Actuator override activated. fuel pump state altered.`, 'system');
                }, 200);
            }
        });
    }

    // Action 3: Live Telemetry Toggle
    if (actionButtons.liveData) {
        actionButtons.liveData.addEventListener('click', () => {
            if (!isVciConnected) return;
            
            const activeTab = document.querySelector('.console-tab.active').getAttribute('data-tab');
            if (activeTab !== 'telemetry' && activeTab !== 'canbus') {
                const telTab = document.querySelector('[data-tab="telemetry"]');
                if (telTab) telTab.click();
            }
            
            if (telemetryInterval) {
                stopTelemetry();
                logToConsole(`Real-time PID Telemetry polling stopped.`, 'system');
            } else {
                startTelemetry();
                logToConsole(`Polling live PIDs (Engine Speed, Battery Voltage, Load)...`, 'vci-out');
            }
        });
    }

    function startTelemetry() {
        if (telemetryInterval) clearInterval(telemetryInterval);
        
        actionButtons.liveData.style.borderColor = 'var(--warning)';
        actionButtons.liveData.style.background = 'rgba(251, 191, 36, 0.1)';
        actionButtons.liveData.style.color = 'var(--warning)';
        
        let counter = 0;
        telemetryInterval = setInterval(() => {
            counter += 0.2;
            let rpm = 0, voltage = 0, soc = 0;
            
            if (selectedEcu === 'ev_vcu') {
                socUnit.textContent = '%';
                rpm = Math.floor(3200 + Math.sin(counter) * 1100 + Math.random() * 80); 
                voltage = parseFloat((72.4 + Math.sin(counter * 0.5) * 1.8 + Math.random() * 0.1).toFixed(2));
                soc = Math.max(0, Math.min(100, Math.floor(84 - counter * 0.05)));
            } else {
                socUnit.textContent = '%';
                rpm = Math.floor(1900 + Math.sin(counter) * 500 + Math.random() * 50);
                voltage = parseFloat((13.7 + Math.sin(counter * 0.3) * 0.2 + Math.random() * 0.05).toFixed(2));
                soc = Math.floor(40 + Math.sin(counter * 0.7) * 12);
            }
            
            updateGauges(rpm, voltage, soc);
            
            // Push to Phone Mockup
            if (phoneRpm) phoneRpm.textContent = rpm + ' RPM';
            if (phoneVolt) phoneVolt.textContent = voltage.toFixed(1) + 'V';
            
            const phoneTemp = document.getElementById('phoneTemp');
            const phoneTps = document.getElementById('phoneTps');
            const phoneSpeed = document.getElementById('phoneSpeed');
            
            let tempVal = 0, tpsVal = 0, speedVal = 0;
            if (selectedEcu === 'ev_vcu') {
                tempVal = Math.floor(45 + Math.sin(counter * 0.1) * 3 + Math.random() * 0.5);
                tpsVal = Math.max(0, Math.floor(25 + Math.sin(counter * 0.8) * 10));
                speedVal = Math.min(120, Math.floor(rpm / 50));
            } else {
                tempVal = Math.floor(88 + Math.sin(counter * 0.05) * 2 + Math.random() * 0.5);
                tpsVal = Math.max(0, Math.floor(18 + Math.sin(counter * 0.6) * 5));
                speedVal = Math.floor(rpm / 60);
            }
            if (phoneTemp) phoneTemp.textContent = tempVal + '°C';
            if (phoneTps) phoneTps.textContent = tpsVal + '%';
            if (phoneSpeed) phoneSpeed.textContent = speedVal + ' km/h';
            
            // Bouncing mini chart bars on phone
            for (let i = 1; i <= 10; i++) {
                const bar = document.getElementById(`mbar${i}`);
                if (bar) {
                    const noise = Math.random() * 25;
                    // Make a sine-wave shaped base height distribution for 10 bars
                    const baseHeights = [20, 35, 55, 75, 65, 45, 30, 50, 75, 40];
                    const baseHeight = baseHeights[i - 1] || 30;
                    bar.style.height = `${baseHeight + noise}%`;
                    bar.classList.add('active');
                }
            }
            
            chartPoints.push(rpm);
            if (chartPoints.length > maxChartPoints) chartPoints.shift();
            drawChart();
            
        }, 150);
    }

    function stopTelemetry() {
        if (telemetryInterval) {
            clearInterval(telemetryInterval);
            telemetryInterval = null;
        }
        actionButtons.liveData.style.borderColor = '';
        actionButtons.liveData.style.background = '';
        actionButtons.liveData.style.color = '';
        
        const phoneTemp = document.getElementById('phoneTemp');
        const phoneTps = document.getElementById('phoneTps');
        const phoneSpeed = document.getElementById('phoneSpeed');
        if (phoneRpm) phoneRpm.textContent = '0 RPM';
        if (phoneVolt) phoneVolt.textContent = '0.0V';
        if (phoneTemp) phoneTemp.textContent = '0°C';
        if (phoneTps) phoneTps.textContent = '0%';
        if (phoneSpeed) phoneSpeed.textContent = '0 km/h';
        
        // Remove phone active bars
        for (let i = 1; i <= 10; i++) {
            const bar = document.getElementById(`mbar${i}`);
            if (bar) {
                bar.classList.remove('active');
            }
        }
    }

    function updateGauges(rpm, volt, soc) {
        if (rpmVal) rpmVal.textContent = rpm;
        if (voltVal) voltVal.textContent = volt.toFixed(1);
        if (socVal) socVal.textContent = soc;
        
        if (rpmGauge) {
            const maxRpm = selectedEcu === 'ev_vcu' ? 6000 : 8000;
            let offset = 251.2 - (Math.min(rpm, maxRpm) / maxRpm) * 251.2;
            rpmGauge.style.strokeDashoffset = offset;
        }
        if (voltGauge) {
            const maxVolt = selectedEcu === 'ev_vcu' ? 85 : 16;
            const minVolt = selectedEcu === 'ev_vcu' ? 55 : 9;
            let range = maxVolt - minVolt;
            let pct = Math.max(0, Math.min((volt - minVolt) / range, 1));
            let offset = 251.2 - pct * 251.2;
            voltGauge.style.strokeDashoffset = offset;
        }
        if (socGauge) {
            let offset = 251.2 - (soc / 100) * 251.2;
            socGauge.style.strokeDashoffset = offset;
        }
    }

    // Custom Canvas chart drawing function
    function drawChart() {
        if (!chartCtx || !telemetryChart) return;
        
        const w = telemetryChart.width;
        const h = telemetryChart.height;
        
        chartCtx.clearRect(0, 0, w, h);
        
        if (chartPoints.length === 0) return;
        
        // Grid background lines
        chartCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        chartCtx.lineWidth = 1;
        for (let i = 20; i < w; i += 40) {
            chartCtx.beginPath();
            chartCtx.moveTo(i, 0);
            chartCtx.lineTo(i, h);
            chartCtx.stroke();
        }
        for (let j = 20; j < h; j += 30) {
            chartCtx.beginPath();
            chartCtx.moveTo(0, j);
            chartCtx.lineTo(w, j);
            chartCtx.stroke();
        }
        
        const maxVal = selectedEcu === 'ev_vcu' ? 6000 : 8000;
        const minVal = 0;
        const valRange = maxVal - minVal;
        
        chartCtx.beginPath();
        const pointsLen = chartPoints.length;
        const step = w / (maxChartPoints - 1);
        
        chartCtx.lineWidth = 2;
        chartCtx.strokeStyle = '#00f2fe';
        chartCtx.shadowBlur = 6;
        chartCtx.shadowColor = 'rgba(0, 242, 254, 0.4)';
        
        for (let i = 0; i < pointsLen; i++) {
            const x = i * step;
            const pct = (chartPoints[i] - minVal) / valRange;
            const y = h - (pct * (h - 20) + 10);
            
            if (i === 0) {
                chartCtx.moveTo(x, y);
            } else {
                chartCtx.lineTo(x, y);
            }
        }
        chartCtx.stroke();
        
        chartCtx.shadowBlur = 0; // reset shadow
        if (pointsLen > 1) {
            chartCtx.lineTo((pointsLen - 1) * step, h);
            chartCtx.lineTo(0, h);
            chartCtx.closePath();
            
            const gradient = chartCtx.createLinearGradient(0, 0, 0, h);
            gradient.addColorStop(0, 'rgba(0, 242, 254, 0.12)');
            gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');
            
            chartCtx.fillStyle = gradient;
            chartCtx.fill();
        }
    }

    // Action 4: ECU FOTA Flashing
    if (actionButtons.flashEcu) {
        actionButtons.flashEcu.addEventListener('click', () => {
            if (!isVciConnected) return;
            
            const termTab = document.querySelector('[data-tab="terminal"]');
            if (termTab) termTab.click();
            
            const firmwareFiles = {
                tvs_uds: 'TVS_RIDEScan_EMS_v3.0.4.bin',
                bmw_k01: 'BMW_ABS_K01_v1.2.9.bin',
                drivex_obd: 'DRIVEX_UNIVERSAL_OBD_v2.1.0.bin',
                ev_vcu: 'EV_VCU_BMS_COMBO_v4.5.1.bin'
            };
            
            const selectedFirmware = firmwareFiles[selectedEcu] || 'GENERIC_ECU_FIRMWARE.bin';
            
            if (!confirm(`Are you sure you want to perform firmware flashing?\nTarget ECU: ${getEcuName(selectedEcu)}\nBinary: ${selectedFirmware}\nWARNING: Do not disconnect interface power during this process!`)) {
                return;
            }
            
            startFlashingProcess(selectedFirmware);
        });
    }

    function startFlashingProcess(filename) {
        isCanStreamPaused = true;
        connectVciBtn.disabled = true;
        Object.values(actionButtons).forEach(btn => {
            if (btn) btn.disabled = true;
        });
        
        flashProgressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        flashStatusLabel.textContent = `Flashing ${filename}: 0%`;

        // Update Phone Mockup elements
        if (phoneProgressBg) phoneProgressBg.classList.remove('hidden');
        if (phoneProgressBar) phoneProgressBar.style.width = '0%';
        if (phoneFotaStatus) phoneFotaStatus.textContent = 'FOTA: 0%';
        
        logToConsole(`*** START FIRMWARE FLASHING PIPELINE ***`, 'info');
        logToConsole(`Firmware Target file: ${filename}`, 'info');
        logToConsole(`Entering UDS Diagnostic Session $03 (Programming Session)...`, 'vci-out');
        
        let step = 0;
        const steps = [
            { pct: 5, msg: `ECU responded positively. Session state altered.`, type: 'ecu-in' },
            { pct: 10, msg: `Requesting Security Access $27 $01 (Seed Request)...`, type: 'vci-out' },
            { pct: 15, msg: `ECU Seed Received: E2 A9 8C 14. Decrypting security key...`, type: 'ecu-in' },
            { pct: 20, msg: `Sending Security Key Response $27 $02 [09 F4 D2 B8]...`, type: 'vci-out' },
            { pct: 25, msg: `ECU responded: Security Access Granted. Unlocking Flash ROM.`, type: 'ecu-in' },
            { pct: 30, msg: `Service $31 (Routine Control) Start Drive Erasure ($FF 00)...`, type: 'vci-out' },
            { pct: 35, msg: `ECU Erase completed. Sector boundaries optimized.`, type: 'ecu-in' },
            { pct: 40, msg: `Sending Service $34 (RequestDownload) payload boundaries...`, type: 'vci-out' },
            { pct: 45, msg: `ECU Response: $74 Max Block Length: 0x0FFF. Ready to receive.`, type: 'ecu-in' },
            { pct: 50, msg: `Sending Service $36 (TransferData) - Transmitting Block 1/6 (Address 0x0000)...`, type: 'vci-out' },
            { pct: 60, msg: `Transmitting Block 2/6 (Address 0x1000)...`, type: 'vci-out' },
            { pct: 70, msg: `Transmitting Block 3/6 (Address 0x2000)...`, type: 'vci-out' },
            { pct: 80, msg: `Transmitting Block 4/6 (Address 0x3000)...`, type: 'vci-out' },
            { pct: 85, msg: `Transmitting Block 5/6 (Address 0x4000)...`, type: 'vci-out' },
            { pct: 90, msg: `Transmitting Block 6/6 (Address 0x5000)...`, type: 'vci-out' },
            { pct: 93, msg: `Sending Service $37 (RequestTransferExit)...`, type: 'vci-out' },
            { pct: 95, msg: `Service $31 (Routine Control) Verify Checksum ($FF 01)... CRC32 Matches!`, type: 'vci-out' },
            { pct: 98, msg: `Sending Service $11 $01 (Hard Reset ECU)...`, type: 'vci-out' },
            { pct: 100, msg: `ECU Reset completed. Rebooting in Normal operation mode.`, type: 'ecu-in' }
        ];

        let idx = 0;
        const flashInterval = setInterval(() => {
            if (idx < steps.length) {
                const current = steps[idx];
                progressBar.style.width = `${current.pct}%`;
                flashStatusLabel.textContent = `Flashing ${filename}: ${current.pct}%`;
                flashTimeLabel.textContent = `Est: ${Math.floor((100 - current.pct) * 0.1)}s`;
                
                // Update Phone Progress UI
                if (phoneProgressBar) phoneProgressBar.style.width = `${current.pct}%`;
                if (phoneFotaStatus) phoneFotaStatus.textContent = `FOTA: ${current.pct}%`;
                
                logToConsole(current.msg, current.type);
                idx++;
            } else {
                clearInterval(flashInterval);
                finishFlashing();
            }
        }, 400);
    }

    function finishFlashing() {
        flashProgressContainer.classList.add('hidden');
        if (phoneProgressBg) phoneProgressBg.classList.add('hidden');
        if (phoneFotaStatus) phoneFotaStatus.textContent = 'FOTA Complete';
        logToConsole(`*** FOTA ECU FLASHING COMPLETED SUCCESSFULLY ***`, 'info');
        
        isCanStreamPaused = false;
        connectVciBtn.disabled = false;
        
        disconnectActions();
        alert(`Flashing Completed!\nThe ECU has reset successfully and is running the updated firmware.`);
    }

    // Real-Time CAN Frame Stream Simulation (PCAN-Viewer In-place updates)
    function startCanStream() {
        if (canStreamInterval) clearInterval(canStreamInterval);
        
        pcanFramesCounter = 0;
        pcanMessages = {};
        canStreamBody.innerHTML = '';
        if (pcanFrameCount) pcanFrameCount.textContent = '0';
        
        const canIds = {
            tvs_uds: ['18DAF110', '18D010F1', '0CF00400', '0C002011', '0F004301'],
            bmw_k01: ['18DAF110', '18D010F1', '0CF00100', '0A00103F'],
            drivex_obd: ['7DF', '7E8', '7E0', '0C100411'],
            ev_vcu: ['0C100105', '0C200105', '0C300105', '18DA10F1', '18DAF110']
        };

        const activeIds = canIds[selectedEcu] || ['18DAF110', '18D010F1'];

        canStreamInterval = setInterval(() => {
            if (isCanStreamPaused) return;
            
            pcanFramesCounter++;
            if (pcanFrameCount) pcanFrameCount.textContent = pcanFramesCounter;
            
            const timestamp = performance.now() / 1000;
            const id = activeIds[Math.floor(Math.random() * activeIds.length)];
            const isRx = id.includes('F1') || id === '7E8' || Math.random() > 0.5;
            
            const dlc = 8;
            let data = [];
            for (let i = 0; i < dlc; i++) {
                data.push(Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0'));
            }
            
            if (id === '18DAF110' && !isRx) {
                data = ['03', '19', '02', '0D', '00', '00', '00', '00'];
            } else if (id === '18D010F1' && isRx) {
                data = ['06', '59', '02', '0D', '01', '03', '02', '00'];
            }

            // In-place PCAN map update
            let msg = pcanMessages[id];
            if (!msg) {
                msg = {
                    id: id,
                    type: id.length > 3 ? 'Ext' : 'Std',
                    dlc: dlc,
                    data: data.join(' '),
                    count: 1,
                    lastTime: timestamp,
                    period: '-'
                };
                pcanMessages[id] = msg;
            } else {
                msg.count++;
                let diff = (timestamp - msg.lastTime) * 1000; // milliseconds
                msg.period = isNaN(diff) ? '-' : Math.round(diff);
                msg.lastTime = timestamp;
                msg.data = data.join(' ');
            }
            
            // Check filters before rendering
            const filterText = canFilterInput.value.trim().toUpperCase();
            
            // Render PCAN table body
            let html = '';
            let index = 0;
            
            // Sort by message ID ascending
            const sortedKeys = Object.keys(pcanMessages).sort();
            
            sortedKeys.forEach(k => {
                const item = pcanMessages[k];
                if (filterText && !item.id.includes(filterText)) {
                    return; // Skip filter mismatch
                }
                
                index++;
                const rowClass = item.id.includes('F1') || item.id === '7E8' ? 'rx' : 'tx';
                
                html += `
                    <tr class="${rowClass}">
                        <td>${index}</td>
                        <td>${item.id}</td>
                        <td>${item.type}</td>
                        <td>${item.dlc}</td>
                        <td>${item.data}</td>
                        <td>${item.count}</td>
                        <td>${item.period}</td>
                    </tr>
                `;
            });
            
            if (html === '') {
                canStreamBody.innerHTML = `<tr><td colspan="7" class="placeholder-row">Filtering hidden all active packets...</td></tr>`;
            } else {
                canStreamBody.innerHTML = html;
            }
            
        }, 150);
    }

    function stopCanStream() {
        if (canStreamInterval) {
            clearInterval(canStreamInterval);
            canStreamInterval = null;
        }
        canStreamBody.innerHTML = `<tr class="placeholder-row"><td colspan="7">Start VCI & select Live Data / ECU Actions to stream CAN frames in PCAN-Viewer.</td></tr>`;
        if (pcanFrameCount) pcanFrameCount.textContent = '0';
    }

    if (toggleCanBtn) {
        toggleCanBtn.addEventListener('click', () => {
            isCanStreamPaused = !isCanStreamPaused;
            const icon = toggleCanBtn.querySelector('i');
            const pulse = document.querySelector('.can-status-pulse');
            
            if (isCanStreamPaused) {
                toggleCanBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
                if (pulse) pulse.classList.add('paused');
            } else {
                toggleCanBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
                if (pulse) pulse.classList.remove('paused');
            }
        });
    }

    // Clear Terminal Logs Action
    if (clearTerminalBtn) {
        clearTerminalBtn.addEventListener('click', () => {
            if (terminalLog) {
                terminalLog.innerHTML = `<div class="log-line system">[SYSTEM] Terminal logs cleared.</div>`;
            }
        });
    }

    // ==========================================
    // 5. 3D GLOW TILT INTERACTION FOR CARDS
    // ==========================================
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6; 
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;

            const existingGloss = card.querySelector('.gloss-effect');
            if (!existingGloss) {
                const gloss = document.createElement('div');
                gloss.className = 'gloss-effect';
                gloss.style.position = 'absolute';
                gloss.style.top = '0';
                gloss.style.left = '0';
                gloss.style.width = '100%';
                gloss.style.height = '100%';
                gloss.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 242, 254, 0.08) 0%, transparent 65%)`;
                gloss.style.pointerEvents = 'none';
                gloss.style.zIndex = '5';
                gloss.style.borderRadius = 'inherit';
                card.appendChild(gloss);
            } else {
                existingGloss.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 242, 254, 0.12) 0%, transparent 65%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.15)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

            const gloss = card.querySelector('.gloss-effect');
            if (gloss) gloss.style.opacity = '0';
        });

        card.addEventListener('mouseenter', () => {
            const gloss = card.querySelector('.gloss-effect');
            if (gloss) gloss.style.opacity = '1';
        });
    });

    // ==========================================
    // 6. CONTACT FORM SUBMISSION (Premium Feedback)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalHtml = btn.innerHTML;

            btn.innerHTML = '<span>Sending Frame...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<span>Message Sent (Rx $7F Positive)</span> <i class="fa-solid fa-circle-check"></i>';
                btn.style.background = '#10b981';
                btn.style.color = '#fff';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }

    // ==========================================
    // 7. DIAGNOSTICS SHOWCASE ANIMATION TICKER
    // ==========================================
    function initShowcaseAnimations() {
        // Screen 1: Brand cycle (TVS, Ather, BMW, Honda, Hero, Bajaj, Ola)
        const logos = document.querySelectorAll('.brand-logo-cycle i');
        let activeLogoIdx = 0;
        if (logos.length > 0) {
            logos[0].classList.add('logo-active');
            setInterval(() => {
                logos[activeLogoIdx].classList.remove('logo-active');
                activeLogoIdx = (activeLogoIdx + 1) % logos.length;
                logos[activeLogoIdx].classList.add('logo-active');
                
                const statusTxt = document.querySelector('.detect-status-text');
                if (statusTxt) {
                    const brands = [
                        "TVS Motor Protocol...", 
                        "Ather Energy BLE...", 
                        "BMW CAN Protocol...", 
                        "Honda OBD2 Protocol...", 
                        "Hero MotoCorp CAN...", 
                        "Bajaj Auto Protocol...", 
                        "Ola Electric VCU..."
                    ];
                    statusTxt.textContent = brands[activeLogoIdx % brands.length];
                }
            }, 2000);
        }

        // Screen 1: VIN Validation Typewriter
        const vinElement = document.querySelector('.vin-text-cursor');
        const vinFill = document.querySelector('.vin-progress-fill');
        const vinString = "MD2A14B50H1094382";
        let vinCharIdx = 0;
        if (vinElement) {
            setInterval(() => {
                vinCharIdx++;
                if (vinCharIdx > vinString.length) {
                    vinCharIdx = 0;
                    if (vinFill) vinFill.style.width = '0%';
                }
                vinElement.textContent = vinString.substring(0, vinCharIdx);
                if (vinFill) {
                    vinFill.style.width = (vinCharIdx / vinString.length) * 100 + '%';
                }
            }, 150);
        }

        // Screen 2: Live Parameters Fluctuation
        const showRpm = document.getElementById('showcaseRpm');
        const showVolt = document.getElementById('showcaseVolt');
        const showTemp = document.getElementById('showcaseTemp');
        const showTps = document.getElementById('showcaseTps');
        const showSpeed = document.getElementById('showcaseSpeed');
        let paramCounter = 0;

        if (showRpm) {
            setInterval(() => {
                paramCounter += 0.15;
                const rpmVal = Math.floor(4800 + Math.sin(paramCounter) * 800 + Math.random() * 50);
                const voltVal = (13.6 + Math.sin(paramCounter * 0.5) * 0.3 + Math.random() * 0.05).toFixed(1);
                const tempVal = Math.floor(82 + Math.sin(paramCounter * 0.1) * 2);
                const tpsVal = Math.max(0, Math.floor(22 + Math.sin(paramCounter * 0.8) * 6));
                const speedVal = Math.floor(rpmVal / 70);

                showRpm.textContent = rpmVal + ' RPM';
                if (showVolt) showVolt.textContent = voltVal + 'V';
                if (showTemp) showTemp.textContent = tempVal + '°C';
                if (showTps) showTps.textContent = tpsVal + '%';
                if (showSpeed) showSpeed.textContent = speedVal + ' km/h';
            }, 250);
        }

        // Screen 4: Actuator & IO Control Toggles Loop
        const togglePill1 = document.querySelector('.animate-toggle-pill-1');
        const togglePill2 = document.querySelector('.animate-toggle-pill-2');
        const togglePill3 = document.querySelector('.animate-toggle-pill-3');
        const togglePill4 = document.querySelector('.animate-toggle-pill-4');
        const statusGlow = document.querySelector('.animate-status-glow');
        let toggleTick = 0;
        
        setInterval(() => {
            toggleTick++;
            if (toggleTick % 2 === 0) {
                if (togglePill1) { togglePill1.classList.add('indicator-override-active'); togglePill1.textContent = 'ACTIVE'; }
                if (togglePill2) { togglePill2.classList.remove('indicator-override-active'); togglePill2.textContent = 'DEFAULT'; }
                if (togglePill3) { togglePill3.classList.add('indicator-override-active'); togglePill3.textContent = 'ACTIVE'; }
                if (togglePill4) { togglePill4.classList.remove('indicator-override-active'); togglePill4.textContent = 'DEFAULT'; }
                if (statusGlow) {
                    statusGlow.classList.add('indicator-override-active');
                    statusGlow.textContent = 'IO Control: ACTIVE';
                }
            } else {
                if (togglePill1) { togglePill1.classList.remove('indicator-override-active'); togglePill1.textContent = 'DEFAULT'; }
                if (togglePill2) { togglePill2.classList.add('indicator-override-active'); togglePill2.textContent = 'ACTIVE'; }
                if (togglePill3) { togglePill3.classList.remove('indicator-override-active'); togglePill3.textContent = 'DEFAULT'; }
                if (togglePill4) { togglePill4.classList.add('indicator-override-active'); togglePill4.textContent = 'ACTIVE'; }
                if (statusGlow) {
                    statusGlow.classList.add('indicator-override-active');
                    statusGlow.textContent = 'IO Control: ACTIVE';
                }
            }
        }, 1800);
    }

    initShowcaseAnimations();
});
