
# iOS Share Extension Setup Guide

This guide explains how to set up the iOS Share Extension to allow users to share product URLs from Safari directly to the VirtualFit app.

## Overview

The Share Extension allows users to:
- Browse products in Safari or any browser
- Tap the Share button
- Select "VirtualFit" from the share sheet
- The product URL is automatically sent to the Wardrobe screen

## Setup Instructions

### Step 1: Install Required Dependencies

The app already includes the necessary dependencies. Make sure you have:
- `expo-linking` - for deep link handling
- `@react-native-async-storage/async-storage` - for data sharing

### Step 2: Run Prebuild

```bash
npx expo prebuild --platform ios
```

This generates the native iOS project in the `ios/` folder.

### Step 3: Add Share Extension in Xcode

1. Open the project in Xcode:
   ```bash
   open ios/VirtualFit.xcworkspace
   ```

2. Add a new target:
   - File → New → Target
   - Select "Share Extension"
   - Name it "ShareExtension"
   - Language: Swift
   - Click Finish

3. Configure the Share Extension:
   - Select the ShareExtension target
   - Go to "Signing & Capabilities"
   - Add "App Groups" capability
   - Enable the app group: `group.com.virtualfit.app`

4. Also add App Groups to the main app target:
   - Select the VirtualFit target
   - Go to "Signing & Capabilities"
   - Add "App Groups" capability
   - Enable the same app group: `group.com.virtualfit.app`

### Step 4: Replace ShareViewController.swift

Replace the contents of `ShareExtension/ShareViewController.swift` with:

```swift
import UIKit
import Social
import MobileCoreServices
import UniformTypeIdentifiers

class ShareViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        handleSharedContent()
    }
    
    private func handleSharedContent() {
        guard let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem,
              let itemProvider = extensionItem.attachments?.first else {
            closeExtension()
            return
        }
        
        // Handle URL sharing
        if itemProvider.hasItemConformingToTypeIdentifier(UTType.url.identifier) {
            itemProvider.loadItem(forTypeIdentifier: UTType.url.identifier, options: nil) { [weak self] (item, error) in
                guard let url = item as? URL else {
                    self?.closeExtension()
                    return
                }
                self?.saveSharedURL(url.absoluteString)
            }
        }
        // Handle text/URL as string
        else if itemProvider.hasItemConformingToTypeIdentifier(UTType.text.identifier) {
            itemProvider.loadItem(forTypeIdentifier: UTType.text.identifier, options: nil) { [weak self] (item, error) in
                guard let text = item as? String else {
                    self?.closeExtension()
                    return
                }
                self?.saveSharedURL(text)
            }
        } else {
            closeExtension()
        }
    }
    
    private func saveSharedURL(_ urlString: String) {
        // Save to shared UserDefaults (App Group)
        if let userDefaults = UserDefaults(suiteName: "group.com.virtualfit.app") {
            userDefaults.set(urlString, forKey: "shared_product_url")
            userDefaults.synchronize()
        }
        
        // Open main app with deep link
        let appURL = URL(string: "virtualfit://wardrobe?url=\\(urlString.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")")!
        
        DispatchQueue.main.async { [weak self] in
            self?.openURL(appURL)
        }
    }
    
    @objc private func openURL(_ url: URL) {
        var responder: UIResponder? = self
        while responder != nil {
            if let application = responder as? UIApplication {
                application.perform(#selector(openURL(_:)), with: url)
                break
            }
            responder = responder?.next
        }
        closeExtension()
    }
    
    private func closeExtension() {
        extensionContext?.completeRequest(returningItems: [], completionHandler: nil)
    }
}
```

### Step 5: Update Info.plist for Share Extension

In `ShareExtension/Info.plist`, ensure it has:

```xml
<key>NSExtension</key>
<dict>
    <key>NSExtensionAttributes</key>
    <dict>
        <key>NSExtensionActivationRule</key>
        <dict>
            <key>NSExtensionActivationSupportsWebURLWithMaxCount</key>
            <integer>1</integer>
            <key>NSExtensionActivationSupportsText</key>
            <true/>
        </dict>
    </dict>
    <key>NSExtensionMainStoryboard</key>
    <string>MainInterface</string>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.share-services</string>
</dict>
```

### Step 6: Build and Test

1. Build the app in Xcode
2. Run on a physical device or simulator
3. Open Safari and navigate to any product page
4. Tap the Share button
5. Select "VirtualFit" from the share sheet
6. The app should open with the URL pre-filled in the Wardrobe screen

## How It Works

1. **User shares URL**: User taps Share button in Safari and selects VirtualFit
2. **Share Extension receives URL**: The ShareViewController captures the URL
3. **Data is saved**: URL is saved to shared UserDefaults using App Groups
4. **App is opened**: Deep link opens the main app at the Wardrobe screen
5. **URL is loaded**: Wardrobe screen reads the shared URL and pre-fills the input field
6. **User adds name**: User adds an outfit name and saves

## Troubleshooting

### Share Extension doesn't appear
- Make sure App Groups are enabled for both targets
- Verify the bundle identifier is correct
- Check that the Info.plist activation rules are set correctly

### URL not appearing in app
- Verify the app group name matches in both the extension and main app
- Check that the deep link scheme is registered in app.json
- Ensure the Wardrobe screen is checking for shared URLs on mount

### App doesn't open
- Verify the URL scheme "virtualfit://" is registered
- Check that the deep link handler in the Wardrobe screen is working
- Test the deep link manually: `xcrun simctl openurl booted virtualfit://wardrobe?url=https://example.com`

## Alternative: Using Expo Config Plugin

For a more automated approach, you can create an Expo Config Plugin to set up the Share Extension automatically. This requires:

1. Creating a config plugin package
2. Modifying the iOS project during prebuild
3. Adding the Share Extension target programmatically

This is more advanced and requires knowledge of Expo Config Plugins. For most users, the manual Xcode setup above is recommended.

## Android Support

Android uses a different mechanism called "Share Intent". To add Android support:

1. Add intent filters to `android/app/src/main/AndroidManifest.xml`
2. Handle incoming intents in the MainActivity
3. Parse the shared URL and navigate to the Wardrobe screen

This is not currently implemented but can be added in a future update.
