/**
 * installer.js - Liaison System Installation Script
 * Detects platform and sets up the system accordingly
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
        dashboardPage: 'index.html'
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
        
        // Browser detection
        const isChrome = /chrome|crios/i.test(ua) && !/edge/i.test(ua);
        const isFirefox = /firefox|fxios/i.test(ua);
        const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua) && !/crios/i.test(ua);
        const isEdge = /edge/i.test(ua);
        const isOpera = /opr|opera/i.test(ua);
        
        return {
            type: isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop'),
            os: isWindows ? 'windows' : (isMac ? 'mac' : (isLinux ? 'linux' : (isAndroid ? 'android' : (isIOS ? 'ios' : 'unknown')))),
            browser: isChrome ? 'chrome' : (isFirefox ? 'firefox' : (isSafari ? 'safari' : (isEdge ? 'edge' : (isOpera ? 'opera' : 'unknown')))),
            isMobile: isMobile,
            isTablet: isTablet,
            isDesktop: isDesktop,
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: ua
        };
    }

    // ============================================================
    // INSTALLATION CHECK
    // ============================================================
    
    function checkInstallation() {
        // Check if already installed
        const installed = localStorage.getItem('liaison_installed');
        const installDate = localStorage.getItem('liaison_install_date');
        const platform = localStorage.getItem('liaison_platform');
        
        if (installed && installDate) {
            return {
                installed: true,
                date: installDate,
                platform: platform || 'unknown',
                version: localStorage.getItem('liaison_version') || '1.0.0'
            };
        }
        
        return { installed: false };
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
        
        // Save to localStorage
        localStorage.setItem('liaison_installed', 'true');
        localStorage.setItem('liaison_install_date', installData.date);
        localStorage.setItem('liaison_platform', installData.platform);
        localStorage.setItem('liaison_version', installData.version);
        localStorage.setItem('liaison_os', installData.os);
        localStorage.setItem('liaison_browser', installData.browser);
        localStorage.setItem('liaison_screen_size', installData.screenSize);
        
        // Create installation log
        const log = {
            ...installData,
            timestamp: now.getTime(),
            userAgent: navigator.userAgent
        };
        
        // Save installation log
        const logs = JSON.parse(localStorage.getItem('liaison_install_logs') || '[]');
        logs.push(log);
        localStorage.setItem('liaison_install_logs', JSON.stringify(logs));
        
        return installData;
    }

    // ============================================================
    // DISPLAY INSTALLATION STATUS
    // ============================================================
    
    function displayInstallStatus(platform, installation) {
        // Check if on login page
        const isLoginPage = window.location.pathname.includes('login.html');
        const isDashboardPage = window.location.pathname.includes('index.html');
        
        // Create installation status element
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 9999;
            max-width: 300px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.1);
            display: none;
        `;
        statusDiv.id = 'install-status';
        document.body.appendChild(statusDiv);
        
        // Only show on first visit or login page
        const showStatus = !installation.installed || isLoginPage;
        
        if (showStatus) {
            statusDiv.style.display = 'block';
            
            const status = installation.installed ? '✅ System Installed' : '⚙️ Installing System...';
            const platformText = platform.type.charAt(0).toUpperCase() + platform.type.slice(1);
            const osText = platform.os.charAt(0).toUpperCase() + platform.os.slice(1);
            
            statusDiv.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <span style="font-size:16px;">${installation.installed ? '✅' : '⚙️'}</span>
                    <strong>${CONFIG.appName}</strong>
                    <span style="font-size:10px;color:#888;">v${CONFIG.version}</span>
                </div>
                <div style="font-size:10px;color:#aaa;">
                    <span>${platformText} | ${osText}</span>
                    <span style="margin:0 6px;">•</span>
                    <span>${platform.screenSize}</span>
                    ${installation.installed ? `<br>📅 Installed: ${new Date(installation.date).toLocaleDateString()}` : ''}
                </div>
                ${!installation.installed ? `<div style="margin-top:4px;font-size:10px;color:#66bb6a;">Installation complete!</div>` : ''}
            `;
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                statusDiv.style.opacity = '0';
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 500);
            }, 8000);
        }
    }

    // ============================================================
    // REDIRECT TO LOGIN IF NOT INSTALLED
    // ============================================================
    
    function redirectIfNeeded(platform, installation) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isLoginPage = currentPage === 'login.html';
        const isDashboardPage = currentPage === 'index.html' || currentPage === '';
        
        // If not installed and not on login page, redirect to login
        if (!installation.installed && !isLoginPage) {
            console.log('🔄 Redirecting to login page for installation...');
            window.location.href = CONFIG.loginPage;
        }
        
        // If installed and on login page, and already authenticated, redirect to dashboard
        if (installation.installed && isLoginPage) {
            // Check if user is already logged in (has auth token)
            const isLoggedIn = sessionStorage.getItem('liaison_logged_in') === 'true';
            if (isLoggedIn) {
                console.log('🔄 Already logged in, redirecting to dashboard...');
                window.location.href = CONFIG.dashboardPage;
            }
        }
    }

    // ============================================================
    // ADD INSTALLATION TOAST
    // ============================================================
    
    function showInstallToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : (type === 'error' ? '#f44336' : '#2196f3')};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            max-width: 350px;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        toast.innerHTML = `
            <span style="font-size:18px;">${type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 5000);
    }

    // ============================================================
    // ADD STYLES
    // ============================================================
    
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .install-status {
                transition: opacity 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // MAIN INITIALIZATION
    // ============================================================
    
    function init() {
        console.log('🚀 Liaison System Installer v' + CONFIG.version);
        console.log('📱 Detecting platform...');
        
        // Detect platform
        const platform = detectPlatform();
        console.log('✅ Platform detected:', platform.type, '| OS:', platform.os, '| Browser:', platform.browser);
        console.log('📐 Screen:', platform.screenSize);
        console.log('👆 Touch support:', platform.isTouch);
        
        // Add styles
        addStyles();
        
        // Check installation
        const installation = checkInstallation();
        
        if (installation.installed) {
            console.log('✅ System already installed on', new Date(installation.date).toLocaleDateString());
            console.log('📦 Version:', installation.version);
            console.log('🖥️ Platform:', installation.platform);
        } else {
            console.log('⚙️ Performing first-time installation...');
            // Perform installation
            const installData = performInstallation(platform);
            console.log('✅ Installation complete!');
            console.log('📅 Installed on:', new Date(installData.date).toLocaleString());
            
            // Show installation toast
            setTimeout(() => {
                showInstallToast('🎉 System installed successfully! Please login.', 'success');
            }, 500);
        }
        
        // Display status
        displayInstallStatus(platform, installation);
        
        // Redirect if needed
        redirectIfNeeded(platform, installation);
        
        console.log('✅ Installer ready!');
        console.log('🔑 Login: admin / admin123');
    }

    // ============================================================
    // RUN INSTALLER
    // ============================================================
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================================
    // EXPOSE FUNCTIONS FOR CONSOLE
    // ============================================================
    
    window.LiaisonInstaller = {
        detectPlatform: detectPlatform,
        checkInstallation: checkInstallation,
        performInstallation: performInstallation,
        CONFIG: CONFIG
    };

})();