# Cringepunk.js
In-house [PIXI.js](https://pixijs.com/) project template prepared for playable ads development. Uses [webpack](https://webpack.js.org/), [Pug](https://pugjs.org/api/getting-started.html), [pixi-spine](https://github.com/pixijs/spine)

## [Demo build](https://mikumiku.vercel.app/pages/cringepunk/)

## What's inside
- **Configured webpack**: ready to go as soon as npm dependencies are installed. Has *debug*, *build* and *watch* commands ready. Also runs *[BundleAnalyzerPlugin](https://www.npmjs.com/package/webpack-bundle-analyzer)* on release build
- **Ads API integration**: supports DAPI for *ironSource* (fuck ironSource, seriously) and MRAID 2.0 for *Unity Ads*, *Applovin* and *Vungle*. Simultaneously, no rebuilding. Can also be built for *Facebook* ads, enable *FB_ON* flag in *ads_api.js*
- **zipper.js**: Pretty much specific in-house script, just in case your manager wants builds to be saved as a set of zip archives for different ad networks and you don't want to do it manually
- **Proper asset managing and packing**: fonts, jsons, graphics, spine animations, sounds -- whatever you need is automatically loaded and packed into single HTML file
- **JPEG masking support**: Not as effective as optimizing graphics with [PNGQuant](https://pngquant.org/), but if you have to load your graphics as set of sprites and b&w masks for transparency -- you are welcome, just add masks with "*_mask*" suffix to *assets.js* and corresponding images will be clipped automatically
- **Automatically adjustable to screen size**: You can use resizables feature to scale and position PIXI sprites relatively to screen, resizing them once screen dimensions change
- **anime.js**: Simple and powerful tweening library. I just didn't know that it was called tweening and made it myself, battle-tested for half an year of real development. Kinda documented with JSDoc
- **director.js**: Your ad script looks like a bunch of consecutive scenes? Don't bother with chains of events and other bullshit, just write your code block by block with *director.js*. Usage example is at the bottom of *game.js*. Don't check it's source code, it's too complex
- **sprites.js**: Some boilerplate making it easier to work with PIXI sprites
- **sounding.js**: Don't mind the funny name, it's an alternative for [PIXI Sound](https://github.com/pixijs/sound) that works directly with browser API. It's not like it's impossible to use PIXI Sound with Cringepunk, I just find it easier to work directly with browser
- **camera.js**: Use camera if you need to pan around your scene. Usage examplle is in *game.js*
- **utils.js**: Dependency-free miscellaneous JS utils

## Usage
- **npm i** to install dependencies
- **npm run debug** to make a debug build
- **npm run watch** to make a continuous debug builds
- **npm run build** to make a release build, saved into folders with different names and *BundleAnalyzerPlugin*
- **npm run zip** for packing release build into zip archives

Builds are saved to *dist/* directory

See *game.js* for detailed example

## License
Shared under WTFPL license.
