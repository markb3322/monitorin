/**
 * installer.js - Liaison System Installation Script
 * Detects platform and shows floating install prompt for Chrome (PC & Mobile)
 */

(function() {
    'use strict';

    // ============================================================
    // SYSTEM CONFIGURATION
    // ============================================================
    
    const CONFIG = {
        appName: 'Liaison System',
        version: '1.0.0',
        organization: 'BEPO-PESO',
        loginPage: 'login.html',
        dashboardPage: 'index.html',
        icon: '📋',
        installUrl: window.location.href
    };

    // ============================================================
    // PLATFORM DETECTION
    // ============================================================
    
    function detectPlatform() {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        
        // Mobile detection
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
        const isTablet = /ipad|tablet|playbook|silk/i.test(ua.toLowerCase());
        const isDesktop = !isMobile && !isTablet;
        
        // OS detection
        const isWindows = /windows|win32|win64/i.test(ua);
        const isMac = /macintosh|mac os x/i.test(ua);
        const isLinux = /linux/i.test(ua);
        const isAndroid = /android/i.test(ua);
        const isIOS = /iphone|ipad|ipod/i.test(ua);
        const isChromeOS = /cros/i.test(ua);
        
        // Browser detection
        const isChrome = /chrome|crios/i.test(ua) && !/edge/i.test(ua);
        const isFirefox = /firefox|fxios/i.test(ua);
        const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua) && !/crios/i.test(ua);
        const isEdge = /edge/i.test(ua);
        const isOpera = /opr|opera/i.test(ua);
        
        // Check if standalone (already installed as app)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone === true;
        
        return {
            type: isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop'),
            os: isWindows ? 'windows' : (isMac ? 'mac' : (isLinux ? 'linux' : (isAndroid ? 'android' : (isIOS ? 'ios' : (isChromeOS ? 'chromeos' : 'unknown'))))),
            browser: isChrome ? 'chrome' : (isFirefox ? 'firefox' : (isSafari ? 'safari' : (isEdge ? 'edge' : (isOpera ? 'opera' : 'unknown')))),
            isMobile: isMobile,
            isTablet: isTablet,
            isDesktop: isDesktop,
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: ua,
            isStandalone: isStandalone,
            isChrome: isChrome,
            isAndroid: isAndroid,
            isIOS: isIOS
        };
    }

    // ============================================================
    // INSTALLATION CHECK
    // ============================================================
    
    function checkInstallation() {
        const installed = localStorage.getItem('liaison_installed');
        const installDate = localStorage.getItem('liaison_install_date');
        const platform = localStorage.getItem('liaison_platform');
        const installDismissed = localStorage.getItem('liaison_install_dismissed');
        
        return {
            installed: installed === 'true',
            date: installDate || null,
            platform: platform || 'unknown',
            version: localStorage.getItem('liaison_version') || '1.0.0',
            dismissed: installDismissed === 'true'
        };
    }

    // ============================================================
    // PERFORM INSTALLATION
    // ============================================================
    
    function performInstallation(platform) {
        const now = new Date();
        const installData = {
            installed: true,
            date: now.toISOString(),
            platform: platform.type,
            version: CONFIG.version,
            os: platform.os,
            browser: platform.browser,
            screenSize: platform.screenSize
        };
        
        localStorage.setItem('liaison_installed', 'true');
        localStorage.setItem('liaison_install_date', installData.date);
        localStorage.setItem('liaison_platform', installData.platform);
        localStorage.setItem('liaison_version', installData.version);
        localStorage.setItem('liaison_os', installData.os);
        localStorage.setItem('liaison_browser', installData.browser);
        localStorage.setItem('liaison_screen_size', installData.screenSize);
        
        const logs = JSON.parse(localStorage.getItem('liaison_install_logs') || '[]');
        logs.push({ ...installData, timestamp: now.getTime() });
        localStorage.setItem('liaison_install_logs', JSON.stringify(logs));
        
        return installData;
    }

    // ============================================================
    // FLOATING INSTALL PROMPT
    // ============================================================
    
    function createFloatingInstallPrompt(platform, installation) {
        // Don't show if already installed or dismissed
        if (installation.installed || installation.dismissed) {
            return null;
        }

        // Don't show if already in standalone mode (installed as app)
        if (platform.isStandalone) {
            return null;
        }

        const prompt = document.createElement('div');
        prompt.id = 'liaison-install-prompt';
        prompt.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 99999;
            max-width: 90%;
            width: 480px;
            box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
            display: flex;
            align-items: center;
            gap: 16px;
            animation: slideUp 0.5s ease-out;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        // Add animation keyframes
        if (!document.getElementById('liaison-install-styles')) {
            const style = document.createElement('style');
            style.id = 'liaison-install-styles';
            style.textContent = `
                @keyframes slideUp {
                    from {
                        transform: translateX(-50%) translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .liaison-install-btn {
                    animation: pulse 2s infinite;
                }
                @media (max-width: 640px) {
                    #liaison-install-prompt {
                        padding: 12px 16px;
                        bottom: 10px;
                        width: 95%;
                        flex-wrap: wrap;
                        gap: 10px;
                        border-radius: 12px;
                    }
                    #liaison-install-prompt .prompt-text {
                        font-size: 13px;
                    }
                    #liaison-install-prompt .prompt-icon {
                        font-size: 28px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Determine install button text based on platform
        let installText = 'Add to Home Screen';
        let installSubtext = 'Install as app';
        
        if (platform.isAndroid && platform.isChrome) {
            installText = 'Add to Home Screen';
            installSubtext = 'Install app';
        } else if (platform.isIOS) {
            installText = 'Add to Home Screen';
            installSubtext = 'Tap Share then Add to Home Screen';
        } else if (platform.isDesktop && platform.isChrome) {
            installText = 'Install App';
            installSubtext = 'Chrome PC';
        } else {
            installText = 'Add to Home Screen';
            installSubtext = 'Install app';
        }

        prompt.innerHTML = `
            <div style="flex-shrink:0;font-size:32px;" class="prompt-icon">${CONFIG.icon}</div>
            <div style="flex:1;min-width:0;">
                <div style="font-weight:600;font-size:15px;" class="prompt-text">${CONFIG.appName}</div>
                <div style="font-size:12px;opacity:0.8;" class="prompt-text">${CONFIG.organization}</div>
                <div style="font-size:11px;opacity:0.7;margin-top:4px;" class="prompt-text">
                    <i class="fas fa-${platform.isMobile ? 'mobile-alt' : 'desktop'}"></i>
                    ${platform.type.charAt(0).toUpperCase() + platform.type.slice(1)} · ${platform.os.charAt(0).toUpperCase() + platform.os.slice(1)}
                </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button id="liaison-install-btn" class="liaison-install-btn" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 8px 18px;
                    border-radius: 10px;
                    font-weight:600;
                    font-size:13px;
                    cursor:pointer;
                    transition: all 0.3s ease;
                    white-space:nowrap;
                ">
                    ${installText}
                </button>
                <button id="liaison-dismiss-btn" style="
                    background: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.7);
                    border: none;
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-size:13px;
                    cursor:pointer;
                    transition: all 0.3s ease;
                ">
                    ✕
                </button>
            </div>
        `;

        document.body.appendChild(prompt);

        // Add hover effects
        const installBtn = document.getElementById('liaison-install-btn');
        const dismissBtn = document.getElementById('liaison-dismiss-btn');

        installBtn.addEventListener('mouseenter', () => {
            installBtn.style.background = 'rgba(255,255,255,0.3)';
        });
        installBtn.addEventListener('mouseleave', () => {
            installBtn.style.background = 'rgba(255,255,255,0.2)';
        });

        // Install button click
        installBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show installation instructions based on platform
            let message = '';
            let instructions = '';
            
            if (platform.isAndroid && platform.isChrome) {
                message = '📱 Add to Home Screen';
                instructions = 'Tap the menu (⋮) and select "Add to Home Screen" or "Install App"';
            } else if (platform.isIOS) {
                message = '📱 Add to Home Screen';
                instructions = 'Tap the Share button (⎔) and select "Add to Home Screen"';
            } else if (platform.isDesktop && platform.isChrome) {
                message = '💻 Install App';
                instructions = 'Click the install icon (⊕) in the address bar or select "Install App" from the Chrome menu';
            } else {
                message = '📋 Add to Home Screen';
                instructions = 'Use your browser\'s "Add to Home Screen" or "Install" feature';
            }

            // Show installation instructions
            const instructionDiv = document.createElement('div');
            instructionDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                color: #1e293b;
                padding: 32px;
                border-radius: 20px;
                z-index: 100000;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 24px 80px rgba(0,0,0,0.3);
                text-align: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;
            instructionDiv.innerHTML = `
                <div style="font-size:48px;margin-bottom:16px;">📲</div>
                <h3 style="font-size:20px;margin-bottom:8px;">${message}</h3>
                <p style="font-size:14px;color:#64748b;margin-bottom:16px;line-height:1.6;">${instructions}</p>
                <button id="liaison-instruction-close" style="
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 10px 32px;
                    border-radius: 12px;
                    font-weight:600;
                    font-size:14px;
                    cursor:pointer;
                    transition: all 0.3s ease;
                ">Got it!</button>
            `;
            document.body.appendChild(instructionDiv);

            // Close instruction overlay
            document.getElementById('liaison-instruction-close').addEventListener('click', function() {
                instructionDiv.remove();
                // Mark installation as in progress
                localStorage.setItem('liaison_install_in_progress', 'true');
            });

            // Close on click outside
            instructionDiv.addEventListener('click', function(e) {
                if (e.target === instructionDiv) {
                    instructionDiv.remove();
                }
            });
        });

        // Dismiss button
        dismissBtn.addEventListener('click', function() {
            prompt.remove();
            localStorage.setItem('liaison_install_dismissed', 'true');
            // Show a small toast
            showInstallToast('Installation dismissed. You can re-enable it anytime.', 'info');
        });

        return prompt;
    }

    // ============================================================
    // INSTALL TOAST NOTIFICATION
    // ============================================================
    
    function showInstallToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#22c55e' : (type === 'error' ? '#ef4444' : '#3b82f6')};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            font-size: 14px;
            z-index: 100001;
            max-width: 90%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease-out;
            text-align: center;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    // ============================================================
    // CHECK FOR INSTALL PROMPT EVENT (PWA)
    // ============================================================
    
    function setupPWAInstall() {
        let deferredPrompt = null;

        window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            deferredPrompt = e;
            
            // Update install button if it exists
            const installBtn = document.getElementById('liaison-install-btn');
            if (installBtn) {
                installBtn.textContent = '📲 Install App';
                installBtn.style.background = 'rgba(255,255,255,0.3)';
                
                // Replace click handler for PWA install
                installBtn.onclick = function() {
                    if (deferredPrompt) {
                        deferredPrompt.prompt();
                        deferredPrompt.userChoice.then((choiceResult) => {
                            if (choiceResult.outcome === 'accepted') {
                                showInstallToast('✅ App installed successfully!', 'success');
                            } else {
                                showInstallToast('Installation cancelled', 'info');
                            }
                            deferredPrompt = null;
                        });
                    }
                };
            }
        });

        // Track app installation
        window.addEventListener('appinstalled', function() {
            showInstallToast('🎉 App installed successfully!', 'success');
            localStorage.setItem('liaison_installed', 'true');
            // Remove the install prompt
            const prompt = document.getElementById('liaison-install-prompt');
            if (prompt) prompt.remove();
        });
    }

    // ============================================================
    // MAIN INITIALIZATION
    // ============================================================
    
    function init() {
        console.log('🚀 Liaison System Installer v' + CONFIG.version);
        
        // Detect platform
        const platform = detectPlatform();
        console.log('📱 Platform:', platform.type, '| OS:', platform.os, '| Browser:', platform.browser);
        console.log('📐 Screen:', platform.screenSize);
        console.log('👆 Touch support:', platform.isTouch);
        console.log('📲 Standalone mode:', platform.isStandalone);
        
        // Check installation
        const installation = checkInstallation();
        
        if (installation.installed) {
            console.log('✅ System already installed on', new Date(installation.date).toLocaleDateString());
            console.log('📦 Version:', installation.version);
            
            // Check if we need to show install prompt (for updates)
            if (installation.version !== CONFIG.version) {
                console.log('🔄 New version available!');
                // Update version
                localStorage.setItem('liaison_version', CONFIG.version);
            }
        } else {
            console.log('⚙️ New installation detected. Showing install prompt...');
            
            // Wait a moment then show the floating install prompt
            setTimeout(() => {
                createFloatingInstallPrompt(platform, installation);
            }, 1500);
        }
        
        // Setup PWA install
        setupPWAInstall();
        
        // Auto-install if conditions are met (optional)
        // This will auto-install on first visit after 30 seconds
        if (!installation.installed && !installation.dismissed) {
            setTimeout(() => {
                // Check if prompt is still visible
                const prompt = document.getElementById('liaison-install-prompt');
                if (prompt) {
                    // Flash effect to draw attention
                    prompt.style.border = '2px solid #fbbf24';
                    prompt.style.boxShadow = '0 12px 40px rgba(251, 191, 36, 0.4)';
                    setTimeout(() => {
                        prompt.style.border = '1px solid rgba(255,255,255,0.2)';
                        prompt.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
                    }, 1500);
                }
            }, 10000);
        }
        
        // Export for debugging
        window.LiaisonInstaller = {
            platform: platform,
            installation: installation,
            CONFIG: CONFIG,
            checkInstallation: checkInstallation,
            detectPlatform: detectPlatform,
            performInstallation: performInstallation
        };
        
        console.log('✅ Installer ready!');
        console.log('🔑 Login: admin / admin123');
    }

    // ============================================================
    // RUN INSTALLER
    // ============================================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
