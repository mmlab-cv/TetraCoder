/*
 * Media paths are relative to index.html. Each scene has three matched renders
 * from stanford_comparison_15_pngs: adaptive = TetraCoder, baseline = TetraSDF
 * Large, mc_288 = Marching Cubes. All use the same 2000 x 1417 web canvas.
 * Source protocol notes are in static/images/SOURCES.md.
 * The editing cycle and geometry-motion clip are referenced directly in index.html.
 */
window.TETRACODER_MEDIA = {
  // Reported full-image metrics from paper Table R1; parameters are millions.
  imageScenes: [
    {
      "id": "albert",
      "label": "Albert",
      "width": 1024,
      "height": 1024,
      "before": {
        "src": "static/images/toy-albert-hash.webp",
        "psnr": "50.31",
        "parameters": "5.75"
      },
      "after": {
        "src": "static/images/toy-albert-tetracoder.webp",
        "psnr": "59.81",
        "parameters": "3.61"
      }
    },
    {
      "id": "summer",
      "label": "Summer",
      "width": 2000,
      "height": 1221,
      "before": {
        "src": "static/images/toy-summer-hash.webp",
        "psnr": "37.94",
        "parameters": "6.57"
      },
      "after": {
        "src": "static/images/toy-summer-tetracoder.webp",
        "psnr": "38.18",
        "parameters": "4.82"
      }
    },
    {
      "id": "pluto",
      "label": "Pluto",
      "width": 2000,
      "height": 2000,
      "before": {
        "src": "static/images/toy-pluto-hash.webp",
        "psnr": "44.03",
        "parameters": "23.96"
      },
      "after": {
        "src": "static/images/toy-pluto-tetracoder.webp",
        "psnr": "48.63",
        "parameters": "17.27"
      }
    },
    {
      "id": "girl",
      "label": "Girl",
      "width": 860,
      "height": 1000,
      "before": {
        "src": "static/images/toy-girl-hash.webp",
        "psnr": "35.96",
        "parameters": "86.20"
      },
      "after": {
        "src": "static/images/toy-girl-tetracoder.webp",
        "psnr": "36.14",
        "parameters": "58.74"
      }
    }
  ],
  meshScenes: [
    {
      "id": "dragon",
      "label": "Dragon",
      "before": "static/images/dragon-tetrasdf.webp",
      "after": "static/images/dragon-tetracoder.webp",
      "beforeLabel": "TetraSDF",
      "afterLabel": "TetraCoder",
      "alt": "Dragon surface reconstruction",
      "baselines": [
        {
          "id": "tetrasdf",
          "label": "TetraSDF",
          "src": "static/images/dragon-tetrasdf.webp"
        },
        {
          "id": "mc",
          "label": "Marching Cubes",
          "src": "static/images/dragon-mc.webp"
        }
      ]
    },
    {
      "id": "armadillo",
      "label": "Armadillo",
      "before": "static/images/armadillo-tetrasdf.webp",
      "after": "static/images/armadillo-tetracoder.webp",
      "beforeLabel": "TetraSDF",
      "afterLabel": "TetraCoder",
      "alt": "Armadillo surface reconstruction",
      "baselines": [
        {
          "id": "tetrasdf",
          "label": "TetraSDF",
          "src": "static/images/armadillo-tetrasdf.webp"
        },
        {
          "id": "mc",
          "label": "Marching Cubes",
          "src": "static/images/armadillo-mc.webp"
        }
      ]
    },
    {
      "id": "bunny",
      "label": "Bunny",
      "before": "static/images/bunny-tetrasdf.webp",
      "after": "static/images/bunny-tetracoder.webp",
      "beforeLabel": "TetraSDF",
      "afterLabel": "TetraCoder",
      "alt": "Bunny surface reconstruction",
      "baselines": [
        {
          "id": "tetrasdf",
          "label": "TetraSDF",
          "src": "static/images/bunny-tetrasdf.webp"
        },
        {
          "id": "mc",
          "label": "Marching Cubes",
          "src": "static/images/bunny-mc.webp"
        }
      ]
    },
    {
      "id": "happy",
      "label": "Happy Buddha",
      "before": "static/images/happy-tetrasdf.webp",
      "after": "static/images/happy-tetracoder.webp",
      "beforeLabel": "TetraSDF",
      "afterLabel": "TetraCoder",
      "alt": "Happy Buddha surface reconstruction",
      "baselines": [
        {
          "id": "tetrasdf",
          "label": "TetraSDF",
          "src": "static/images/happy-tetrasdf.webp"
        },
        {
          "id": "mc",
          "label": "Marching Cubes",
          "src": "static/images/happy-mc.webp"
        }
      ]
    },
    {
      "id": "lucy",
      "label": "Lucy",
      "before": "static/images/lucy-tetrasdf.webp",
      "after": "static/images/lucy-tetracoder.webp",
      "beforeLabel": "TetraSDF",
      "afterLabel": "TetraCoder",
      "alt": "Lucy surface reconstruction",
      "baselines": [
        {
          "id": "tetrasdf",
          "label": "TetraSDF",
          "src": "static/images/lucy-tetrasdf.webp"
        },
        {
          "id": "mc",
          "label": "Marching Cubes",
          "src": "static/images/lucy-mc.webp"
        }
      ]
    }
  ],
  // Additional clips can use {title, src, poster} entries here.
  videoShowcase: []
};
