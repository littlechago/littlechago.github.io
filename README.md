# QR Hunt AdSense Implementation

This repository contains everything you need to implement Google AdSense in your QR Hunt app. I've created a complete solution that includes:

1. A public website for AdSense approval
2. A simplified ad landing page for your QR Hunt app
3. Detailed implementation guides
4. Earnings tracking tools

## Table of Contents

- [Getting AdSense Approval](#getting-adsense-approval)
- [Implementing AdSense in QR Hunt](#implementing-adsense-in-qr-hunt)
- [Tracking Your Earnings](#tracking-your-earnings)
- [Files Included](#files-included)
- [AdSense Best Practices](#adsense-best-practices)

## Getting AdSense Approval

Since your QR Hunt app isn't publicly accessible, you'll need a public website to get AdSense approval. I've created a complete website for you in the `github-pages` folder.

### Step 1: Set Up GitHub Pages

1. Create a GitHub account at [github.com](https://github.com/)
2. Create a new repository named `yourusername.github.io` (replace "yourusername" with your actual GitHub username)
3. Upload all the files from the `github-pages` folder to your repository
4. Your site will be published at `https://yourusername.github.io`

For detailed instructions, see the [GitHub Pages README](github-pages/README.md).

### Step 2: Apply for AdSense

1. Go to [Google AdSense](https://www.google.com/adsense/start/)
2. Sign up using your GitHub Pages URL
3. Add the AdSense code to your site
4. Wait for approval (typically 1-2 weeks)

For detailed instructions, see the [AdSense Implementation Guide](adsense-implementation-guide.md).

## Implementing AdSense in QR Hunt

Once your AdSense account is approved, you can implement it in your QR Hunt app.

### Step 1: Update the Ad Landing Page

1. Open `ad-landing-simple.html`
2. Replace the placeholder AdSense code with your actual AdSense publisher ID
3. Create an ad unit in your AdSense dashboard
4. Add the ad unit code to the ad container

For detailed instructions, see the [AdSense Implementation Guide](adsense-implementation-guide.md).

### Step 2: Update the QR Code Redirection

The `script.js` file has already been updated to redirect 95% of QR code scans to the ad landing page. No further changes are needed.

### Step 3: Test Your Implementation

1. Open your QR Hunt app
2. Scan a QR code
3. Verify that the ad appears correctly

## Tracking Your Earnings

I've created a simple earnings tracker to help you monitor your AdSense performance.

### Using the Earnings Tracker

1. Open `adsense-earnings-tracker.html` in your browser
2. Enter your daily ad views and earnings
3. The tracker will calculate key metrics like RPM and estimated monthly earnings
4. All data is stored locally in your browser

## Files Included

### GitHub Pages Website

- `github-pages/` - Complete website for AdSense approval
  - `index.html` - Homepage
  - `about.html` - About page
  - `how-it-works.html` - How QR Hunt works
  - `contact.html` - Contact page
  - `privacy-policy.html` - Privacy Policy (required for AdSense)
  - `terms-of-service.html` - Terms of Service (required for AdSense)
  - `styles.css` - Main stylesheet
  - `README.md` - Setup instructions

### AdSense Implementation

- `ad-landing-simple.html` - Simplified ad landing page for QR Hunt
- `ad-stats.js` - Script to track ad views and estimate revenue
- `adsense-implementation-guide.md` - Detailed implementation guide
- `adsense-earnings-tracker.html` - Tool to track your AdSense earnings

## AdSense Best Practices

To maintain a good standing with AdSense and maximize your earnings:

### Content Guidelines

1. **Don't click your own ads** - This violates AdSense policies
2. **Don't encourage users to click ads** - Against AdSense rules
3. **Provide valuable content** - Make sure your landing page offers value

### Ad Placement

1. **Limit ad units** - 1-3 per page is appropriate
2. **Strategic placement** - Visible but not intrusive
3. **Mobile optimization** - Ensure ads display correctly on all devices

### Performance Monitoring

1. **Check your AdSense dashboard regularly**
2. **Experiment with ad placement**
3. **Set up payment information correctly**

For more detailed best practices, see the [AdSense Implementation Guide](adsense-implementation-guide.md).

## Next Steps

1. Set up the GitHub Pages site
2. Apply for AdSense
3. Once approved, implement AdSense in your QR Hunt app
4. Start tracking your earnings

Good luck with your QR Hunt project! If you have any questions, refer to the detailed guides included in this repository.
