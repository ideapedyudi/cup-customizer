# 🥤 3D Drink Cup Customizer

A sleek, modern web application that allows users to customize a 3D drink cup in real-time. Built with Next.js 14, this app features a stunning **Dark Glassmorphism** & **Warm Neon (Orange/Yellow)** aesthetic, complete with an interactive 3D canvas and an AI-powered design generator.

![UI Preview](https://github.com/ideapedyudi/cup-customizer/blob/master/src/images/preview.png?raw=true)

## ✨ Features

- **Interactive 3D Viewer**: Built with `three.js` & `@react-three/fiber`, users can freely rotate and inspect a high-quality 3D Cup model.
- **Dynamic Decal Textures**: Upload any image (or `.png` with transparency) and watch it instantly apply as a sticker/sablon wrap on the cup's body.
- **Dark Glass + Neon Aesthetic**: A premium UI featuring backdrop-blur glassmorphism panels and radiant orange/yellow neon studio lighting reflecting off the cup's glossy surface.
- **AI Design Generator**: (Integration Ready) Generate stunning prompt-based designs directly through Google's **Gemini API**.
- **Local Storage Gallery**: Your previous masterpiece designs, including high-res 3D snapshots, are automatically captured and saved locally in a seamless gallery.
- **Export**: Render the final customized 3D cup into a downloadable 2D image via the "Save & Export" feature.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) + Custom HSL variables
- **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) + `@react-three/drei`
- **Generative AI**: OpenRouter API (`google/gemini-3.1-flash-image-preview`)
- **Icons**: `lucide-react`

---

## 🚀 Getting Started

Follow these instructions to run the project in your local development environment.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine (v18.0.0 or higher is recommended).

### 2. Installation
Clone the repository and install the NPM dependencies:

```bash
# Clone the repository (if applicable)
# git clone <repository-url>

# Navigate into the directory
cd cup-customizer

# Install dependencies
npm install
```

### 3. Environment Variables
To fully utilize the **AI Design Generator** feature, you need an OpenRouter API Key.
Create a new file called `.env.local` in the root of your project and inject your key:

```env
NEXT_PUBLIC_OPENROUTER_API_KEY="your_openrouter_api_key_here"
```
*(You can get your API key from [OpenRouter.ai](https://openrouter.ai/)).*

### 4. Run the Development Server
Fire up the Next.js local development server:

```bash
npm run dev
```

### 5. Open the App
Visit [http://localhost:3000](http://localhost:3000) in your browser. 
- Try dragging your mouse over the cup to view it from all angles (the cursor will automatically change to a pointer).
- Click **Upload Image** to stick a custom printed logo onto your cup!

## 📜 License
This project was built as a creative prototype. Feel free to modify and adapt it to your own personal or commercial projects.
