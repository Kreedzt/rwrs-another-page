# RWRS Another Page

A clean and modern server browser for Running with Rifles (RWR) game, inspired by rwrstats.com.

## Overview

RWRS Another Page provides a pure and efficient way to browse Running with Rifles game servers. Built with modern web technologies, it offers:

- Real-time server list with auto-refresh capability
- Advanced filtering and search functionality
- Multiple view modes (table and map-based)
- Multilingual support (English and Chinese)
- Mobile-friendly responsive design

## Dependencies

This project requires the following backend:
- [rwrs-server](https://github.com/Kreedzt/rwrs-server) - Provides the API for server data

## Development

### Prerequisites

- Node.js (v20 or later recommended)
- pnpm package manager

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rwrs-another-page.git
   cd rwrs-another-page
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

The application will be available at http://localhost:5173 and will proxy API requests to the backend server.

### Building

To build for production:

```bash
pnpm build
```

## Deployment

### Docker

The easiest way to deploy is using Docker:

```bash
docker pull zhaozisong0/rwrs-another-page:latest
docker run -p 80:80 zhaozisong0/rwrs-another-page:latest
```

You can inject custom header scripts using the `HEADER_SCRIPTS` environment variable:

```bash
docker run -p 80:80 -e "HEADER_SCRIPTS=<script>console.log('Custom script');</script>" zhaozisong0/rwrs-another-page:latest
```

### Manual Deployment

1. Build the project:
   ```bash
   pnpm build
   ```

2. Deploy the contents of the `dist` directory to your web server.

3. Configure your web server to proxy API requests to the rwrs-server backend.

## License

- [MIT](LICENSE)