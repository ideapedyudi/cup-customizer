# 🥤 3D Drink Cup Customizer

A sleek, modern web application that allows users to customize a 3D drink cup in real-time. Built with Next.js 14, this app features a stunning **Dark Glassmorphism** & **Warm Neon (Orange/Yellow)** aesthetic, complete with an interactive 3D canvas and a powerful AI-powered design generator.

![UI Preview](https://github.com/ideapedyudi/cup-customizer/blob/master/src/images/preview.png?raw=true)

## ✨ Features

- **Interactive 3D Viewer**: Powered by `three.js` & `@react-three/fiber`, providing a high-quality, real-time 3D inspection of the cup.
- **AI Design Generator**: Generate stunning patterns and logos using **OpenRouter AI** (Model: `sourceful/riverflow-v2-pro`).
- **Dynamic Texture Mapping**: Instantly apply generated AI designs or uploaded `.png` images onto the cup's surface as a decal.
- **IndexedDB Persistent Gallery**: High-res designs and 3D screenshots are automatically saved and persistent even after page refreshes.
- **Premium UI/UX**: A dark-themed glassmorphism design with responsive neon lighting effects and smooth micro-animations.
- **Save & Export**: High-quality 2D renders of your final 3D design can be exported directly to your device.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **3D Core**: [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) + `@react-three/drei`
- **Generative AI**: [OpenRouter API](https://openrouter.ai/)
- **Storage**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via `idb-keyval`)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: `lucide-react`

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [OpenRouter API Key](https://openrouter.ai/keys)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/ideapedyudi/cup-customizer.git

# Navigate to directory
cd cup-customizer

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following:

```env
OPENROUTER_API_KEY="your_api_key_here"
OPENROUTER_MODEL="sourceful/riverflow-v2-pro"
```

> [!IMPORTANT]
> Since the project uses OpenRouter for image generation, ensure your API key has sufficient credits for the selected model.

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your app in action!

## 📜 License
Built for creative prototyping. Feel free to use and adapt this for your own projects.
