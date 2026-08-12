/**
 * installer.js - Liaison System Installation Script
 * Chrome App Installer for PC and Mobile
 */

(function() {
    'use strict';

    // ============================================================
    // SYSTEM CONFIGURATION
    // ============================================================
    
    const CONFIG = {
        appName: 'Liaison System',
        shortName: 'Liaison',
        version: '1.0.0',
        organization: 'BEPO-PESO',
        loginPage: 'login.html',
        dashboardPage: 'index.html',
        installUrl: window.location.href
    };

    // ============================================================
    // PLATFORM DETECTION
    // ============================================================
    
    function detectPlatform() {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
        const isTablet = /ipad|tablet|playbook|silk/i.test(ua.toLowerCase());
        const isDesktop = !isMobile && !isTablet;
        
        const isWindows = /windows|win32|win64/i.test(ua);
        const isMac = /macintosh|mac os x/i.test(ua);
        const isLinux = /linux/i.test(ua);
        const isAndroid = /android/i.test(ua);
        const isIOS = /iphone|ipad|ipod/i.test(ua);
        
        const isChrome = /chrome|crios/i.test(ua) && !/edge/i.test(ua);
        const isFirefox = /firefox|fxios/i.test(ua);
        const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua) && !/crios/i.test(ua);
        const isEdge = /edge/i.test(ua);
        
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone === true;
        
        return {
            type: isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop'),
            os: isWindows ? 'windows' : (isMac ? 'mac' : (isLinux ? 'linux' : (isAndroid ? 'android' : (isIOS ? 'ios' : 'unknown')))),
            browser: isChrome ? 'chrome' : (isFirefox ? 'firefox' : (isSafari ? 'safari' : (isEdge ? 'edge' : 'unknown'))),
            isMobile: isMobile,
            isTablet: isTablet,
            isDesktop: isDesktop,
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: ua,
            isStandalone: isStandalone,
            isChrome: isChrome,
            isAndroid: isAndroid,
            isIOS: isIOS,
            isChromeOS: /cros/i.test(ua)
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
    // PWA INSTALL HANDLER
    // ============================================================
    
    let deferredPrompt = null;
    let installButton = null;

    function setupPWAInstall() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', function(e) {
            console.log('📲 beforeinstallprompt event fired');
            e.preventDefault();
            deferredPrompt = e;
            
            // Show the install button
            showInstallButton();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', function() {
            console.log('✅ App installed successfully!');
            localStorage.setItem('liaison_installed', 'true');
            localStorage.setItem('liaison_install_date', new Date().toISOString());
            localStorage.setItem('liaison_platform', detectPlatform().type);
            
            // Hide the install button
            hideInstallButton();
            
            // Show success message
            showToast('🎉 App installed successfully!', 'success');
        });

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ App is already installed (standalone mode)');
            localStorage.setItem('liaison_installed', 'true');
        }
    }

    // ============================================================
    // SHOW/HIDE INSTALL BUTTON
    // ============================================================
    
    function showInstallButton() {
        // Remove existing install button if any
        hideInstallButton();
        
        const platform = detectPlatform();
        const installation = checkInstallation();
        
        // Don't show if already installed or dismissed
        if (installation.installed || installation.dismissed) {
            return;
        }
        
        // Don't show if in standalone mode
        if (platform.isStandalone) {
            return;
        }

        // Create floating install button
        const container = document.createElement('div');
        container.id = 'liaison-install-container';
        container.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 99999;
            width: auto;
            max-width: 90%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // Get install text based on platform
        let installText = '📲 Install App';
        let subText = 'Add to Home Screen';
        
        if (platform.isAndroid && platform.isChrome) {
            installText = '📱 Install App';
            subText = 'Add to Home Screen';
        } else if (platform.isDesktop && platform.isChrome) {
            installText = '⬇️ Install App';
            subText = 'Chrome App';
        } else {
            installText = '📲 Install App';
            subText = 'Add to Home Screen';
        }

        container.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 24px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
                display: flex;
                align-items: center;
                gap: 16px;
                border: 1px solid rgba(255,255,255,0.2);
                backdrop-filter: blur(10px);
                animation: slideUp 0.5s ease-out;
            ">
                <div style="font-size:28px;flex-shrink:0;">📋</div>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:14px;">${CONFIG.appName}</div>
                    <div style="font-size:11px;opacity:0.8;">${CONFIG.organization}</div>
                    <div style="font-size:10px;opacity:0.6;margin-top:2px;">${subText}</div>
                </div>
                <button id="liaison-install-btn" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 8px 20px;
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
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size:16px;
                    cursor:pointer;
                    transition: all 0.3s ease;
                    line-height:1;
                ">
                    ×
                </button>
            </div>
        `;

        document.body.appendChild(container);

        // Add animation styles if not present
        if (!document.getElementById('liaison-install-styles')) {
            const style = document.createElement('style');
            style.id = 'liaison-install-styles';
            style.textContent = `
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(30px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @media (max-width: 640px) {
                    #liaison-install-container > div {
                        padding: 12px 16px !important;
                        flex-wrap: wrap !important;
                        justify-content: center !important;
                        gap: 10px !important;
                        border-radius: 12px !important;
                    }
                    #liaison-install-container .install-text {
                        font-size: 12px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Store reference to install button
        installButton = document.getElementById('liaison-install-btn');
        const dismissBtn = document.getElementById('liaison-dismiss-btn');

        // Install button click handler
        installButton.addEventListener('click', function(e) {
            e.preventDefault();
            triggerInstall();
        });

        // Dismiss button click handler
        dismissBtn.addEventListener('click', function() {
            container.remove();
            localStorage.setItem('liaison_install_dismissed', 'true');
            showToast('Installation dismissed', 'info');
        });

        // Hover effects
        installButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.3)';
        });
        installButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255,255,255,0.2)';
        });
    }

    function hideInstallButton() {
        const container = document.getElementById('liaison-install-container');
        if (container) {
            container.remove();
        }
    }

    // ============================================================
    // TRIGGER INSTALL
    // ============================================================
    
    function triggerInstall() {
        // Check if we have a deferred prompt (Chrome)
        if (deferredPrompt) {
            // Show the native install prompt
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('✅ User accepted the install prompt');
                    showToast('🎉 Installing app...', 'success');
                } else {
                    console.log('❌ User dismissed the install prompt');
                    showToast('Installation cancelled', 'info');
                }
                deferredPrompt = null;
            });
            return;
        }

        // Fallback for non-Chrome browsers or when prompt is not available
        const platform = detectPlatform();
        let message = '';
        let instructions = '';

        if (platform.isAndroid) {
            message = '📱 Install App on Android';
            instructions = '1. Tap the Chrome menu (⋮)\n2. Select "Add to Home Screen"\n3. Tap "Install" or "Add"';
        } else if (platform.isIOS) {
            message = '📱 Install App on iOS';
            instructions = '1. Tap the Share button (⎔)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"';
        } else if (platform.isDesktop) {
            message = '💻 Install App on Desktop';
            instructions = '1. Click the install icon (⊕) in the address bar\n2. Click "Install"\n3. The app will open in a new window';
        } else {
            message = '📲 Install App';
            instructions = 'Use your browser\'s "Add to Home Screen" or "Install" feature';
        }

        // Show installation instructions
        showInstallInstructions(message, instructions);
    }

    // ============================================================
    // INSTALL INSTRUCTIONS MODAL
    // ============================================================
    
    function showInstallInstructions(title, instructions) {
        // Remove existing modal
        const existing = document.getElementById('liaison-install-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'liaison-install-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(8px);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                color: #1e293b;
                padding: 32px;
                border-radius: 20px;
                max-width: 420px;
                width: 90%;
                box-shadow: 0 24px 80px rgba(0,0,0,0.4);
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <button id="liaison-modal-close" style="
                    position: absolute;
                    top: 12px;
                    right: 16px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                ">×</button>
                
                <div style="font-size:48px;text-align:center;margin-bottom:16px;">📲</div>
                <h3 style="font-size:20px;font-weight:700;text-align:center;margin-bottom:8px;">${title}</h3>
                <div style="
                    background: #f1f5f9;
                    padding: 16px;
                    border-radius: 12px;
                    margin: 16px 0;
                    font-size:14px;
                    line-height:1.8;
                    white-space:pre-line;
                    color: #334155;
                ">${instructions}</div>
                <button id="liaison-modal-gotit" style="
                    width: 100%;
                    background: #6366f1;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 12px;
                    font-weight:600;
                    font-size:15px;
                    cursor:pointer;
                    transition: all 0.3s ease;
                    margin-top: 8px;
                ">Got it!</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add fade animation
        if (!document.getElementById('liaison-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'liaison-modal-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // Close handlers
        const closeBtn = document.getElementById('liaison-modal-close');
        const gotItBtn = document.getElementById('liaison-modal-gotit');
        
        function closeModal() {
            modal.remove();
        }

        closeBtn.addEventListener('click', closeModal);
        gotItBtn.addEventListener('click', closeModal);
        
        // Close on click outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ============================================================
    // TOAST NOTIFICATION
    // ============================================================
    
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#22c55e' : (type === 'error' ? '#ef4444' : '#3b82f6')};
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-size: 14px;
            z-index: 100001;
            max-width: 90%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease-out;
            text-align: center;
            font-weight: 500;
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
    // CHECK INSTALLATION STATUS ON LOAD
    // ============================================================
    
    function checkInstallationStatus() {
        // Check if app is installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ App running in standalone mode');
            localStorage.setItem('liaison_installed', 'true');
            return true;
        }
        
        // Check if installed via localStorage
        const installed = localStorage.getItem('liaison_installed') === 'true';
        if (installed) {
            console.log('✅ App previously installed');
            return true;
        }
        
        return false;
    }

    // ============================================================
    // MAIN INITIALIZATION
    // ============================================================
    
    function init() {
        console.log('🚀 Liaison System Installer v' + CONFIG.version);
        
        const platform = detectPlatform();
        console.log('📱 Platform:', platform.type, '| OS:', platform.os, '| Browser:', platform.browser);
        console.log('📐 Screen:', platform.screenSize);
        
        // Check installation status
        const isInstalled = checkInstallationStatus();
        const installation = checkInstallation();
        
        if (isInstalled) {
            console.log('✅ System is installed');
            // Remove any lingering install buttons
            hideInstallButton();
        } else {
            console.log('⚙️ System not installed. Setting up install prompt...');
            // Setup PWA install
            setupPWAInstall();
            
            // If Chrome, show install button (will be shown by beforeinstallprompt)
            // If not Chrome, show manual install instructions after delay
            if (!platform.isChrome) {
                setTimeout(() => {
                    if (!installation.dismissed) {
                        showInstallInstructions(
                            '📲 Install App',
                            `To install this app on ${platform.os.charAt(0).toUpperCase() + platform.os.slice(1)}:\n\n` +
                            '1. Open the browser menu\n' +
                            '2. Select "Add to Home Screen" or "Install App"\n' +
                            '3. Follow the prompts to complete installation'
                        );
                    }
                }, 3000);
            }
        }
        
        // Export for debugging
        window.LiaisonInstaller = {
            platform: platform,
            installation: installation,
            CONFIG: CONFIG,
            triggerInstall: triggerInstall,
            showInstallButton: showInstallButton,
            hideInstallButton: hideInstallButton,
            checkInstallation: checkInstallation
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
