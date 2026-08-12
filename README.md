# Liaison System - Installation Guide

## System Overview
Liaison is a comprehensive Monitoring & Record Management System for BEPO-PESO (Bohol Employment Placement Office - Public Employment Service Office).

## Requirements
- **PC:** Any modern web browser (Chrome, Firefox, Edge, Safari)
- **Mobile:** Any modern mobile browser (Chrome, Safari, Firefox)
- **Internet Connection:** Required for Supabase database connection
- **Storage:** No installation required - runs directly in browser

## Features
- Document Receive Management
- Daily Monitoring Tracking
- Office Management
- Report Generation
- User Authentication

## Quick Installation

### Option 1: Direct Access (PC & Mobile)
1. Open your web browser
2. Navigate to the system URL
3. Login with credentials
4. Start using the system

### Option 2: Local Setup
1. Download all HTML files to a folder
2. Open `login.html` in your browser
3. Login and start using

## File Structure
liaison-system/
├── index.html # Main Dashboard
├── login.html # Login Page
├── record.html # Document Receive Management
├── monitoring.html # Daily Monitoring
├── office.html # Office Management
├── report.html # Report Generation
├── config.json # Configuration File
├── installer.js # Installation Script
└── README.md # This file

## Supabase Configuration
The system uses Supabase as the backend database. Configuration is embedded in each HTML file.

### Database Tables
- `offices` - Office management
- `documents` - Document receive records
- `monitoring` - Daily monitoring records

### Default Login Credentials
- **Username:** admin
- **Password:** admin123

## Mobile Optimization
The system is fully responsive and optimized for:
- Smartphones (iOS, Android)
- Tablets
- Desktop computers
- All screen sizes

## Browser Compatibility
- ✅ Chrome (PC & Mobile)
- ✅ Firefox (PC & Mobile)
- ✅ Safari (PC & Mobile)
- ✅ Edge (PC & Mobile)
- ✅ Opera (PC & Mobile)

## Troubleshooting

### Connection Issues
1. Check your internet connection
2. Verify Supabase credentials
3. Check browser console for errors

### Login Issues
1. Ensure correct credentials (admin/admin123)
2. Clear browser cache
3. Try incognito/private mode

## Support
For technical support, contact the system administrator.

## Version
Version 1.0.0 - Initial Release

## License
© 2026 BEPO-PESO. All rights reserved.