# Agent Instructions

This document is for AI coding agents working with this codebase. For human-readable documentation, see [README.md](./README.md).

## Overview

This is a recipe page template built with Next.js 16, Tailwind CSS v4, shadcn/ui, and TypeScript.

## Critical: Divergent Mobile/Desktop Design

**This codebase uses intentionally different layouts for mobile and desktop viewports.** Do not attempt to unify them—they are separate by design for optimal UX on each device.

### Mobile-Specific Patterns
- Quick info cards use full-width stacked layout
- Larger touch targets (44px+ tap areas)
- `active:` states for tactile feedback
- Full-screen menu overlay
- Hidden with `md:hidden`

### Desktop-Specific Patterns
- Inline layouts for quick info
- `hover:` states for mouse interaction
- Slide-in menu panel (400px width)
- Hidden with `hidden md:flex` or `hidden md:block`

### Breakpoint
- Mobile: default (no prefix)
- Desktop: `md:` prefix (768px+)

## File Structure

```
config/settings.json   → App configuration (default recipe, homepage mode)
data/recipes/*.json    → Recipe content (edit this for new recipes)
types/recipe.ts        → Recipe TypeScript interfaces
types/config.ts        → Config TypeScript interfaces
components/recipe-page.tsx → Main UI component (handles both viewports)
components/recipe-menu.tsx → Hamburger menu component
app/page.tsx           → Imports, registers, and renders recipes
app/layout.tsx         → Metadata and Open Graph tags
app/globals.css        → Tailwind v4 config and design tokens
```

## Configuration System

### Settings File (`config/settings.json`)

```json
{
  "defaultRecipeSlug": "ryans-devileds",
  "homepageMode": "recipe"
}
```

**Important behaviors:**
- If only ONE recipe exists in `recipeRegistry`, it is ALWAYS the default (setting is ignored)
- If multiple recipes exist, `defaultRecipeSlug` determines which loads on homepage
- `homepageMode: "list"` is defined but NOT YET IMPLEMENTED (requires backend)

### Recipe Registry (`app/page.tsx`)

All recipes must be imported and added to the `recipeRegistry` object:

```tsx
const recipeRegistry: Record<string, Recipe> = {
  "ryans-devileds": recipeData as Recipe,
  "another-recipe": anotherRecipeData as Recipe,
}
```

## Common Tasks

### Add a New Recipe
1. Create `data/recipes/[recipe-name].json` matching the `Recipe` type
2. Import in `app/page.tsx` and add to `recipeRegistry`
3. Add images to `public/`
4. Optionally update `config/settings.json` to set as default
5. Update metadata in `app/layout.tsx`

### Change Default Recipe
1. Edit `config/settings.json`
2. Set `defaultRecipeSlug` to the desired recipe's slug

### Modify Styling
- Design tokens are in `app/globals.css` under `@theme inline`
- Use semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`
- Font families: `font-sans` (Geist)

### Add New Recipe Fields
1. Update `types/recipe.ts` with new interface properties
2. Update JSON files in `data/recipes/`
3. Update `components/recipe-page.tsx` to render new fields

## Backend Integration (Future)

To enable the "Add New Recipe" UI functionality:

1. **Set up Vercel Blob storage** for recipe JSON files and images
2. **Create API routes** for:
   - `POST /api/recipes` - Create new recipe
   - `PUT /api/recipes/[slug]` - Update recipe
   - `DELETE /api/recipes/[slug]` - Delete recipe
   - `POST /api/upload` - Upload recipe images
3. **Update `app/page.tsx`** to fetch recipes dynamically instead of static imports
4. **Update `config/settings.json`** - `homepageMode: "list"` can then show a recipe list instead of a single default recipe
5. **Update the menu component** to call the API instead of showing "Coming Soon"

Currently, all recipe management is file-based and requires code changes.

## Tech Stack Details

| Technology | Version | Notes |
|------------|---------|-------|
| Next.js | 16 | App Router, Server Components |
| Tailwind CSS | v4 | Config in globals.css, not tailwind.config.js |
| shadcn/ui | Latest | Checkbox component used |
| TypeScript | Strict | All components fully typed |

## Design Tokens

Located in `app/globals.css`:
- `--background` / `--foreground` - Base colors
- `--muted` / `--muted-foreground` - Secondary text
- `--border` - Border color
- `--radius` - Corner rounding

## Do Not

- Do not merge mobile and desktop layouts into a single responsive flow
- Do not use `tailwind.config.js` (Tailwind v4 uses CSS-based config)
- Do not hardcode colors—use design tokens
- Do not remove the `scrollbar-hide` utility class on mobile scroll containers
- Do not bypass `recipeRegistry` when adding recipes—all recipes must be registered there
