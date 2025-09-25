# Beautiful Safari Extension

A Safari extension that provides beautiful backgrounds and AI chat functionality with secure API management.

## App Store Deployment Guide

### Prerequisites

1. **Apple Developer Account** - Required for Safari Extension distribution
2. **Vercel Account** - For secure backend hosting
3. **API Keys**:
   - Google Gemini API Key (for AI chat)
   - Unsplash Access Key (for background images)

### Step 1: Setup Secure Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy to Vercel:
   ```bash
   npx vercel
   ```

4. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `UNSPLASH_ACCESS_KEY`: Your Unsplash access key

5. Update the `apiEndpoint` in `newtab.js` with your Vercel deployment URL

### Step 2: Update Extension Configuration

1. **Update Info.plist**:
   - Replace `YOUR_APPLE_DEVELOPER_ID` with your actual Apple Developer ID
   - Update `Allowed Domains` to include your Vercel backend URL

2. **Update API Endpoint**:
   - In `newtab.js`, change `this.apiEndpoint` to your deployed backend URL
   - In `global.js`, update the fetch URL to your backend

### Step 3: Test Extension

1. Load the extension in Safari Developer mode
2. Test all functionality:
   - Background image loading
   - AI chat with and without file uploads
   - Settings persistence
   - Calendar functionality

### Step 4: Submit to App Store

1. **Package Extension**:
   - Ensure all placeholder values are replaced
   - Remove any development files
   - Test thoroughly

2. **App Store Connect**:
   - Create new app listing
   - Upload privacy policy and terms of service
   - Submit for review

### Security Features

- ✅ No hardcoded API keys in client code
- ✅ All API calls go through secure backend
- ✅ Minimal required permissions
- ✅ Privacy policy and terms of service included
- ✅ CORS properly configured

### Files Structure

```
Beautiful Safari Extension.safariextension/
├── Info.plist              # Extension configuration
├── newtab.html             # Main new tab page
├── newtab.js               # Main application logic
├── global.js               # Background script
├── content.js              # Content script
├── styles.css              # Styles
├── privacy-policy.html     # Privacy policy
├── terms-of-service.html   # Terms of service
└── backend/                # Secure backend
    ├── api/
    │   ├── chat.js         # Gemini API proxy
    │   └── background.js   # Unsplash API proxy
    ├── package.json
    ├── vercel.json
    └── .env.example
```

### Important Notes

- Replace all placeholder values before deployment
- Test thoroughly in Safari before submission
- Ensure backend is deployed and working
- Privacy policy must be accessible via web URL
- All API keys must be stored as Vercel environment variables

### Support

For issues or questions, please refer to the privacy policy and terms of service contact information.