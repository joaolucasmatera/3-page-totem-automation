# 3-Page Totem Automation

![Node.js](https://img.shields.io/badge/node.js-16%2B-brightgreen)
![Platform](https://img.shields.io/badge/platform-windows-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PowerShell](https://img.shields.io/badge/powershell-5.1%2B-blue)

Professional web automation solution for managing multiple browser instances with automated login and optimized window organization.

## Overview

This automation system orchestrates three synchronized browser windows in a vertical totem layout, providing automated authentication and session management across production and staging environments.

## Features

### Core Capabilities
- **Multi-Instance Management**: Concurrent handling of three browser windows
- **Automated Authentication**: Environment-specific credential management
- **Window Organization**: Intelligent vertical layout optimization
- **Cross-Environment Support**: Production and staging environment isolation
- **One-Click Execution**: Streamlined deployment process

### Technical Stack
- **Browser Automation**: Playwright with Chromium engine
- **Window Management**: PowerShell-based positioning system
- **Configuration Management**: Environment variables with dotenv
- **Cross-Platform Compatibility**: Windows-optimized with PowerShell integration

## Architecture

```
┌─────────────────────────────────────┐
│ TOP TIER    - Production Dashboard  │
├─────────────────────────────────────┤  
│ MIDDLE TIER - User Profile          │
├─────────────────────────────────────┤
│ BOTTOM TIER - Staging Environment   │
└─────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- Windows 10/11 operating system
- PowerShell 5.1 or higher
- Git (for version control)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joaolucasmatera/3-page-totem-automation.git
   cd 3-page-totem-automation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   copy .env.example .env
   ```

### Configuration

Create and configure your `.env` file with the following variables:

```env
# Production Environment Credentials
PRODUCTION_EMAIL=your-production-email@domain.com
PRODUCTION_PASSWORD=your-production-password

# Staging Environment Credentials  
STAGING_EMAIL=your-staging-email@domain.com
STAGING_PASSWORD=your-staging-password

# Application URLs
DASHBOARD_URL=https://app.yourdomain.com/dashboard
PROFILE_URL=https://app.yourdomain.com/profile/?user_id=YOUR-USER-ID
STAGING_URL=https://staging.yourdomain.com/?page=0&role=reviewer&rowsPerPage=10

# Authentication Endpoints
PRODUCTION_LOGIN_URL=https://app.yourdomain.com/
STAGING_LOGIN_URL=https://staging.yourdomain.com/

# Window Configuration
WINDOW_WIDTH=800
WINDOW_HEIGHT=360
```

## Usage

### Automated Execution (Recommended)
```bash
.\run-automation.bat
```

### Available NPM Scripts
```bash
npm run automation    # Execute Playwright automation sequence
npm run organize      # Apply vertical window organization
npm run run-all       # Execute complete automation pipeline
npm run test-config   # Validate environment configuration
npm run setup         # Initialize development environment
```

## Security Considerations

- **Credential Management**: All sensitive data stored in environment variables
- **Version Control**: `.env` files excluded from repository
- **Access Control**: Environment-specific authentication tokens
- **Data Protection**: No hardcoded credentials in source code

## Project Structure

```
3-page-totem-automation/
├── scripts/
│   ├── 1-playwright-automation.js    # Browser automation logic
│   ├── 2-organize-windows.ps1        # Window positioning system
│   └── test-config.js                # Configuration validator
├── .env.example                      # Environment template
├── .gitignore                        # Version control exclusions
├── package.json                      # Project dependencies
├── run-automation.bat               # Main execution script
└── README.md                        # Documentation
```

## Development

### Testing Configuration
Validate your environment setup:
```bash
npm run test-config
```

### Manual Component Testing
Test individual components:
```bash
# Test browser automation only
npm run automation

# Test window organization only  
npm run organize
```

### Troubleshooting

**Common Issues:**

- **Browser Installation**: Run `npx playwright install` if browsers are missing
- **PowerShell Policy**: Execute `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` 
- **Environment Variables**: Verify `.env` file configuration with `npm run test-config`
- **Port Conflicts**: Ensure no other instances are running

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**João Lucas Matera**
- GitHub: [@joaolucasmatera](https://github.com/joaolucasmatera)
- Email: joao.matera@gmail.com

## Acknowledgments

- Built with [Playwright](https://playwright.dev/) for reliable browser automation
- PowerShell integration for Windows-native window management
- Node.js ecosystem for cross-platform compatibility
