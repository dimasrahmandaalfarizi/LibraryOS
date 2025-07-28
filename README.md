# Library Management System

A modern library management system built with React, TypeScript, and Vite.

## Features

- Book catalog management
- User authentication
- Book borrowing system
- Admin dashboard
- Member dashboard
- Activity logs

## Development

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dimasrahmandaalfarizi/LibraryOS.git
cd LibraryOS
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment to GitHub Pages

### Prerequisites

1. Make sure your repository is pushed to GitHub
2. Ensure the repository name matches the homepage URL in `package.json`

### Deployment Steps

1. Build the project:

```bash
npm run build
```

2. Deploy to GitHub Pages:

```bash
npm run deploy
```

### Configuration

The project is configured for GitHub Pages deployment with:

- Base path: `/LibraryOS/` (matches repository name)
- Homepage: `https://dimasrahmandaalfarizi.github.io/LibraryOS`
- Build output directory: `dist`

### GitHub Pages Settings

After deployment, make sure to:

1. Go to your repository on GitHub
2. Navigate to Settings > Pages
3. Set the source to "Deploy from a branch"
4. Select the `gh-pages` branch
5. Set the folder to `/ (root)`
6. Click Save

Your website will be available at: `https://dimasrahmandaalfarizi.github.io/LibraryOS`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)
- ESLint

## License

This project is open source and available under the [MIT License](LICENSE).
