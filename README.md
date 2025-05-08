# Network Location

A Raycast extension that provides a quick and easy way to change your macOS network location settings.
Based on https://github.com/eblanchette extension

## Features

- Switch between different network locations with just a few keystrokes
- Shows current active network location
- Requires administrator privileges to change network settings (will prompt for password)

## Requirements

- macOS
- [Raycast](https://raycast.com/) application installed
- Multiple network locations configured in System Preferences

## Development

### Prerequisites

- Node.js (v16 or later recommended)
- npm
- Raycast application installed

### Setup Development Environment

1. Clone this repository
```bash
git clone https://github.com/owner/network-location.git
cd network-location
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

This will open the extension in Raycast in development mode. Any changes you make to the code will be automatically reflected in the extension.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the extension
- `npm run lint` - Run ESLint
- `npm run fix-lint` - Fix ESLint errors automatically

## How It Works

The extension uses the `networksetup` command-line tool to list and switch between network locations. It uses AppleScript with administrator privileges to execute the command when switching locations.

## License

MIT
