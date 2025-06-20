# Newsletter Screenshot Capture

A minimal Next.js project that captures screenshots of email newsletters using Puppeteer.

## Features

- Capture full-page screenshots of newsletter URLs
- Automatic filename generation with domain and timestamp
- Optimized browser settings for reliable capture
- Saves screenshots to `screenshots/` folder

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Usage

### Endpoint
```
GET /api/screenshot?url=YOUR_NEWSLETTER_URL
```

### Parameters
- `url` (required): The newsletter URL to capture
- `filename` (optional): Custom filename for the screenshot

### Examples

**Basic usage:**
```
GET /api/screenshot?url=https://example.com/newsletter
```

**With custom filename:**
```
GET /api/screenshot?url=https://example.com/newsletter&filename=my_newsletter.png
```

### Response
```json
{
  "success": true,
  "message": "Newsletter screenshot captured successfully",
  "filename": "newsletter_example_com_2024-01-15T10-30-45-123Z.png",
  "filepath": "/path/to/screenshot.png",
  "url": "https://example.com/newsletter",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── screenshot/
│   │       └── route.ts          # API endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── screenshots/                  # Generated screenshots (created automatically)
├── package.json
├── next.config.js
└── tsconfig.json
```

## Technical Details

- **Framework**: Next.js 14 with App Router
- **Browser Automation**: Puppeteer
- **Language**: TypeScript
- **Screenshots**: Full-page PNG format
- **Browser**: Headless Chrome with optimized settings

## Notes

- On first run, Puppeteer will download Chrome automatically
- Screenshots are saved to the `screenshots/` folder in the project root
- The API includes proper error handling and validation 
