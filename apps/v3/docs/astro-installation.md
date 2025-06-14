# Setting Up an Astro Project with Preact and Tailwind CSS

This guide will walk you through creating an Astro project with Preact integration and Tailwind CSS for styling.

## 1. Create the Project

Run the following command to create a new Astro project:

```bash
bun create astro@latest
```

Select your preferred starter template when prompted.

## 2. Add the Preact Integration

To add Preact to your Astro project, execute:

```bash
bun run astro add preact
```

Type `y` for all questions to confirm the installation.

## 3. Add Tailwind CSS 3

Follow the instructions in the [Astro Tailwind CSS Guide](https://docs.astro.build/en/guides/styling/#legacy-tailwind-3-support) to add Tailwind CSS.

Run the following command:

```bash
bun add tailwindcss@3 @astrojs/tailwind
```

### Update `astro.config.mjs`

Import the Tailwind integration in your `astro.config.mjs` file and add it to the `integrations` array:

```tsx
// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), tailwind()],
});
```

### Configure Tailwind CSS

Add the following basic configuration to your `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 4. Update TypeScript Configuration

Modify your `tsconfig.json` to include the following settings:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"],
      "@ui/*": ["./src/components/ui/*"]
    }
  }
}
```

Install the Node.js types as a development dependency:

```bash
bun add -D @types/node
```

### Update `astro.config.mjs`

Make the following changes to your `astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import { resolve } from "path";

const __dirname = import.meta.dirname;

// https://astro.build/config
export default defineConfig({
  integrations: [preact({ compat: true }), tailwind()],
  vite: {
    resolve: {
      alias: {
        "@ui": resolve(resolve(__dirname), "./src/components/ui/"),
        "@": resolve(resolve(__dirname), "./src/"),
      },
    },
  },
});
```

### Update `package.json`

Add the following overrides to your `package.json`:

```json
{
  "overrides": {
    "react": "npm:@preact/compat@latest",
    "react-dom": "npm:@preact/compat@latest"
  }
}
```

## 5. Install Additional Packages

Run the following command to install additional dependencies:

```bash
bun add class-variance-authority clsx cmdk date-fns dayjs embla-carousel-react input-otp lucide-preact react-day-picker react-hot-toast recharts tailwind-merge tailwindcss-animate vaul @floating-ui/react-dom
```

## 6. Update Tailwind CSS Configuration

Modify your `tailwind.config.js` to include dark mode and extend the theme:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        "2xl": "calc(var(--radius) + 4px)",
        "xl": "calc(var(--radius) + 2px)",
        "lg": "var(--radius)",
        "md": "calc(var(--radius) - 2px)",
        "sm": "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### Add Base Styles

Create a CSS file (e.g., `styles.css`) and add the following base styles:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground;
}
```

## 7. Copy UI Components

To copy the UI components, run the following command:

```bash
bunx degit https://github.com/LiasCode/shadcn-preact/src/components/ui ./src/components/ui
```
