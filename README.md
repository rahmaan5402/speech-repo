## Speech Repo
<img src="public/speech.png" width="120px">
<br/>

[ English | [Chinese / 中文](README_zh.md) ]

Speech Repo is a Chrome extension focused on improving response efficiency and standardizing message templates. It is widely applicable to daily online communication scenarios for operations, customer support, and merchants.

## Download

## Video Demo


## 🔧 Quick Start
1. Download the latest .crx file
2. Open chrome://extensions/ in Chrome
3. Enable "Developer mode"
4. Drag and drop the .crx file onto the page to install
5. On first use, Speech comes with default templates (which can be deleted)


## 🎯 Project Background
In PC web-based instant messaging scenarios, standardized message templates can greatly improve reply efficiency and maintain content consistency. However, templates are often scattered across documents, spreadsheets, or chat records, and sometimes rely on personal memory. As business needs evolve, the variety of templates increases, making them hard to find, difficult to manage, and prone to version inconsistencies.

Speech Repo was developed to address these issues: it centralizes frequently used replies, organizes them with categories and tags, and provides one-click copy functionality—so templates are always ready when needed, without hunting through files or relying on memory.

## ✨ Features
  - Add, edit, and delete frequently used templates
  - One-click copy of any template, ready to paste on any PC web page
  - Customizable category structure with tags for precise search
  - Mini window mode
  - Multi-language support
  - Other features under development

## 🚀 Technical Highlights
 - Lightweight design: Only 2MB, minimal impact on browser performance
 - Offline support: Local storage mechanism, no network dependency
 - Data security: Local encrypted storage to protect sensitive information

## 🛠️ Development
- Frontend: React + TypeScript + Vite + Shadcn UI + Tailwind CSS
- Database：IndexedDB

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd speech-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Load the extension:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the dist folder

## Sponsorship
<img src="docs/wx_pay.png" width="240px">

### Commercial License
The open-source version is under the AGPL-3.0 License and can be used for personal learning and use. For commercial purposes, please contact the author for authorization.

## Contact
- Email
yuanxiao5309@gmail.com

- WeChat
<img src="docs/wechat.png" width="240px">
<br/>

