# Recipe Page Template

A beautiful, mobile-optimized recipe page template built with modern web technologies.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **TypeScript** - Type-safe development

## Features

- Clean, editorial design aesthetic
- **Divergent mobile/desktop layouts** - The UI is specifically optimized for each viewport:
  - Mobile: Full-width stacked info cards, larger touch targets, full-screen menu
  - Desktop: Inline info display, hover states, slide-in menu panel
- Interactive ingredient checklist
- Step completion tracking with checkboxes
- Per-step warnings for critical instructions
- Pro tips section
- Open Graph meta tags for social sharing
- Hamburger menu for recipe navigation

## Project Structure

```
├── app/
│   ├── page.tsx          # Main page (imports recipe data)
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Tailwind v4 config & design tokens
├── components/
│   ├── recipe-page.tsx   # Generic recipe page component
│   ├── recipe-menu.tsx   # Hamburger menu component
│   └── ui/               # shadcn/ui components
├── config/
│   └── settings.json     # App configuration (default recipe, homepage mode)
├── data/
│   └── recipes/          # Recipe JSON files
│       └── ryans-devileds.json
├── types/
│   ├── recipe.ts         # Recipe TypeScript interfaces
│   └── config.ts         # Config TypeScript interfaces
└── public/
    ├── og-image.jpg      # Open Graph image (1200x400)
    └── [recipe-image].jpg
```

## Configuration

### App Settings (`config/settings.json`)

```json
{
  "defaultRecipeSlug": "ryans-devileds",
  "homepageMode": "recipe"
}
```

| Setting | Description |
|---------|-------------|
| `defaultRecipeSlug` | The slug of the recipe to display on the homepage. Ignored if only one recipe exists (that recipe becomes the automatic default). |
| `homepageMode` | Either `"recipe"` (show the default recipe) or `"list"` (show a list of all recipes). **Note:** `"list"` mode is not yet implemented—requires backend storage. |

## Customization

### Adding a New Recipe

1. Create a new JSON file in `data/recipes/` following the schema in `types/recipe.ts`
2. Import and register the recipe in `app/page.tsx` in the `recipeRegistry` object
3. Add your recipe image to `public/`
4. Optionally update `config/settings.json` to set the new recipe as default
5. Update the Open Graph image and metadata in `app/layout.tsx`

### Recipe JSON Schema

```json
{
  "id": "unique-id",
  "title": "Recipe Title",
  "description": "Short description",
  "image": "/your-image.jpg",
  "ogImage": "/og-image.jpg",
  "prepTime": "30 min",
  "serves": "4 servings",
  "level": "Easy",
  "ingredients": [
    { "amount": "1 cup", "item": "ingredient name" }
  ],
  "directions": [
    { 
      "title": "Step title", 
      "description": "Step instructions",
      "warning": "Optional warning for this step"
    }
  ],
  "tips": [
    { "title": "Tip title", "description": "Tip content", "highlight": false }
  ],
  "footer": "Footer message"
}
```

## Future Features (Requires Backend)

The "Add New Recipe" button in the menu currently shows a "Coming Soon" modal. To enable dynamic recipe management via the UI:

- **Blob storage integration** is required to store recipe JSON files and images
- See `agents.md` for technical implementation details

## For AI Coding Agents

See [agents.md](./agents.md) for detailed instructions on modifying this codebase programmatically.

## License

MIT
