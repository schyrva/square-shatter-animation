# Square Shatter Animation (Test task)

An interactive animation that displays a square breaking into randomly generated fragments with a pulsing effect. Built with TypeScript and HTML Canvas.

## Features

- Dynamic square fragmentation using random line intersections
- Smooth scaling animation of fragments
- Responsive design that adapts to window resizing
- Randomly generated colors for each fragment
- Clean geometric calculations for polygon cutting and centroid computation

## Demo

❗[Live Demo](https://square-shatter-animation.vercel.app/)❗


![Animation Preview](assets/preview.gif)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/schyrva/square-shatter-animation.git
cd square-shatter-animation
```

2. Install dependencies:

```bash
npm install
or
yarn
```

3. Start the development server:

```bash
npm run dev
or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Configuration

You can customize the animation by modifying the constants in `src/constants/config.ts`:

- `SPEED`: Controls the animation speed
- `MAX_SCALE`: Maximum scale factor for the fragments
- `AREA_THRESHOLD`: Minimum area for valid fragments
- `MIN_LINES`/`MAX_LINES`: Range for number of cutting lines
- `MIN_RGB`/`MAX_RGB`: Color range for fragments
- `STROKE_STYLE`: Border color of fragments
- `LINE_WIDTH`: Border width of fragments

## Technical Details

The animation works by:
1. Creating an initial square
2. Generating random lines to cut the square into fragments
3. Computing centroids and areas for each fragment
4. Animating the fragments using scale transformations
5. Regenerating fragments when the animation cycle completes

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Author

Stanislav Chyrva - [GitHub](https://github.com/schyrva), [LinkedIn](https://www.linkedin.com/in/stanislav-chyrva-3a3b24347/), stanislav.chyrva@gmail.com

## Acknowledgments

- Inspired by geometric fragmentation animations
- Built with Vite and TypeScript