import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const filename = searchParams.get('filename');

    // Validate URL parameter
    if (!url) {
        return NextResponse.json(
            {
                error: 'URL parameter is required',
                example: '/api/screenshot?url=https://example.com/newsletter'
            },
            { status: 400 }
        );
    }

    // Validate URL format
    try {
        new URL(url);
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Invalid URL format',
                provided: url
            },
            { status: 400 }
        );
    }

    let browser: any = null;

    try {
        // Create screenshots directory if it doesn't exist
        const screenshotsDir = path.join(process.cwd(), 'screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        // Launch browser with serverless-compatible Chrome
        const isProd = process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL;

        if (isProd) {
            // Production: Use puppeteer-core with @sparticuz/chromium
            const puppeteer = require('puppeteer-core');
            const chromium = require('@sparticuz/chromium');

            const executablePath = await chromium.executablePath();

            browser = await puppeteer.launch({
                headless: true,
                executablePath,
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                ignoreHTTPSErrors: true,
            });
        } else {
            // Development: Use full puppeteer
            const puppeteer = require('puppeteer');

            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-zygote'
                ]
            });
        }

        const page = await browser.newPage();

        // Set user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Set viewport
        await page.setViewport({ width: 1200, height: 800 });

        console.log(`Navigating to: ${url}`);

        // Navigate to the URL
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get page dimensions
        const dimensions = await page.evaluate(() => {
            return {
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight
            };
        });

        // Adjust viewport to content size
        await page.setViewport({
            width: Math.min(dimensions.width, 1920),
            height: Math.min(dimensions.height, 1080)
        });

        // Generate filename
        let finalFilename = filename;
        if (!finalFilename) {
            const urlObj = new URL(url);
            const domain = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '_');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            finalFilename = `newsletter_${domain}_${timestamp}.png`;
        }

        // Ensure .png extension
        if (!finalFilename.endsWith('.png')) {
            finalFilename += '.png';
        }

        const outputPath = path.join(screenshotsDir, finalFilename);

        // Take screenshot
        console.log('Capturing screenshot...');
        await page.screenshot({
            path: outputPath,
            fullPage: true
        });

        console.log(`Screenshot saved to: ${outputPath}`);

        return NextResponse.json({
            success: true,
            message: 'Newsletter screenshot captured successfully',
            filename: finalFilename,
            filepath: outputPath,
            url: url,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error capturing screenshot:', error);

        let errorMessage = 'Failed to capture newsletter screenshot';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {
                error: 'Failed to capture newsletter screenshot',
                message: errorMessage,
                tip: 'If this is your first time running the API, Puppeteer may need to download Chrome. Please try again in a few moments.'
            },
            { status: 500 }
        );
    } finally {
        if (browser) {
            await browser.close();
            console.log('Browser closed');
        }
    }
} 