export default function Home() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Newsletter Screenshot Capture</h1>
            <p>Use the API endpoint to capture screenshots of email newsletters:</p>

            <div style={{ margin: '20px 0' }}>
                <h3>API Endpoint:</h3>
                <code style={{ backgroundColor: '#f5f5f5', padding: '10px', display: 'block' }}>
                    GET /api/screenshot?url=YOUR_NEWSLETTER_URL
                </code>
            </div>

            <div style={{ margin: '20px 0' }}>
                <h3>Example:</h3>
                <code style={{ backgroundColor: '#f5f5f5', padding: '10px', display: 'block' }}>
                    /api/screenshot?url=https://example.com/newsletter
                </code>
            </div>

            <div style={{ margin: '20px 0' }}>
                <h3>Optional Parameters:</h3>
                <ul>
                    <li><code>filename</code> - Custom filename for the screenshot</li>
                </ul>
            </div>

            <div style={{ margin: '20px 0' }}>
                <h3>Response:</h3>
                <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                    {`{
  "success": true,
  "message": "Newsletter screenshot captured successfully",
  "filename": "newsletter_example_com_2024-01-15T10-30-45-123Z.png",
  "filepath": "/path/to/screenshot.png",
  "url": "https://example.com/newsletter",
  "timestamp": "2024-01-15T10:30:45.123Z"
}`}
                </pre>
            </div>
        </div>
    );
} 