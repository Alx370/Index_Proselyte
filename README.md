<p align="center">
  <img src="public/The_Index_Logo.webp" alt="The Index emblem" width="140" height="140" />
</p>

## About the project

**The Will of the City (Index Proselyte)** is a fan project inspired by **The Index**, one of the Five Fingers in the City, part of the universe created by **Project Moon**. The Index follows the Prescripts, mysterious instructions believed to express the Will of the City.

The goal is to recreate the experience of receiving a Prescript as an Index Proselyte. Users can choose a name, draw randomly generated Prescripts, and mark them as completed before drawing another, with an animated text reveal, sound effects, and background music.

## To run it locally

### Requirements

- **Node.js 20.19+ (20.x), 22.12+ (22.x), or 24+.**
- **npm**, included with Node.js. The project specifies npm 11.6.2 as its package manager.
- **Git** to clone the repository.

### Installation and startup

```bash
git clone https://github.com/Alx370/Index_Proselyte.git
cd Index_Proselyte
npm ci
npm start
```

If you already have the repository, start with `npm ci` from the project directory. This installs the dependency versions recorded in `package-lock.json`.

Open **http://localhost:4200/** once the development server is running. The application automatically reloads when you change the source files. To use a different port, run `npm start -- --port 4300`.

The current application runs entirely in the browser and requires no backend or environment variables. The chosen name is stored locally in the browser for one hour.

Built with **Angular 21**, **TypeScript**, and **CSS**, using **Angular CLI** for development and builds, **Vitest** for testing, and **Prettier** for formatting.

## Inspiration and credits

The world, characters, artwork, and music that inspire this project belong to their respective creators. **Library of Ruina** and the universe of **Project Moon** are the inspiration behind The Will of the City.
