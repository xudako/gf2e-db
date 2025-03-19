import { ThemeOptions } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    raritySSR?: PaletteColor;
    raritySR?: PaletteColor;
    rarityR?: PaletteColor;
  }

  interface PaletteOptions {
    raritySSR?: PaletteColorOptions;
    raritySR?: PaletteColorOptions;
    rarityR?: PaletteColorOptions;
  }
}
