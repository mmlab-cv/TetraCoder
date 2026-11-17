# TetraCoder website image provenance

Images come from the user-supplied TetraCoder manuscript's `fig/` directory,
the later Stanford mesh-render and 2D budget-validation exports, the geometry-
editing GIF, the encoder-adaptation video and stills, and four camera-52
scene-editing renders supplied separately.
They are actual research outputs, not generated illustrations.
The source manuscript's `fig/qualitative.tex` identifies the methods, scenes,
and editing sequence. Its `fig/2D_editing_supp.tex` identifies the three 2D
editing panels. Original source filenames are preserved in the table below.

The WebP files use **lossless WebP encoding**. Large inputs were uniformly
downsampled with Pillow's Lanczos filter for web delivery; lossless encoding
therefore refers to the resized pixels, not full-resolution source recovery.
No retouching, sharpening, color adjustment, content replacement, or synthetic
image generation was applied. Transparency is preserved. Display the mesh
comparisons against a white background, as in the paper.

The four editing renders below come from the supplied camera-52 PNGs. The
remaining entries come from the manuscript's `fig/` directory.

| Website asset | Source file | Original dimensions | Web dimensions | Meaning |
| --- | --- | --- | --- | --- |
| `editing-original.webp` | `before_camera_52.png` | 1600 × 1600 | 1600 × 1600 | Fitted Lego scene |
| `editing-appearance.webp` | `after_camera_52.png` | 1600 × 1600 | 1600 × 1600 | Blue bucket and red painted region |
| `editing-geometry.webp` | `lowered_camera_52.png` | 1600 × 1600 | 1600 × 1600 | Lowered bucket after appearance editing |
| `editing-physics.webp` | `rock_impact_camera_52.png` | 1600 × 1600 | 1600 × 1600 | Physics simulation with another object |
| `locality-hash.webp` | `2D_ingp.png` | 6114 × 3734 | 1200 × 733 | Hash encoding after a local 2D edit |
| `locality-tetracoder.webp` | `2D_ours.png` | 6114 × 3734 | 1200 × 733 | TetraCoder after the same local 2D edit |
| `locality-target.webp` | `2D_target.png` | 6114 × 3734 | 1200 × 733 | Target: red on the left; original image on the right |
| `novel-view-frog.webp` | `qualitative_nvs_0.png` | 1575 × 1116 | 1200 × 850 | DTU frog, including the original detail inset |
| `novel-view-hotdog.webp` | `qualitative_nvs_2.png` | 1575 × 1116 | 1200 × 850 | NeRF Synthetic hotdog, including the original detail inset |

## Stanford mesh comparisons

All 15 current geometry assets come from the user-supplied
`stanford_comparison_15_pngs` folder. They replace the earlier four mesh figures
extracted from the manuscript. Each source is 5211 × 3691 RGBA; each web asset
is 2000 × 1417 RGBA, resized with Pillow Lanczos and encoded as lossless WebP.
Every decoded WebP matches the resized RGBA pixels exactly. Transparency and
the complete source canvas are retained, with no crop, padding, retouching,
sharpening, or image synthesis. Total web size: 15,461,240 bytes.

| Scene | TetraCoder source → asset | TetraSDF source → asset | Marching Cubes source → asset |
| --- | --- | --- | --- |
| Dragon | `dragon_adaptive.png` → `dragon-tetracoder.webp` | `dragon_baseline.png` → `dragon-tetrasdf.webp` | `dragon_mc_288.png` → `dragon-mc.webp` |
| Armadillo | `armadillo_adaptive.png` → `armadillo-tetracoder.webp` | `armadillo_baseline.png` → `armadillo-tetrasdf.webp` | `armadillo_mc_288.png` → `armadillo-mc.webp` |
| Bunny | `bunny_adaptive.png` → `bunny-tetracoder.webp` | `bunny_baseline.png` → `bunny-tetrasdf.webp` | `bunny_mc_288.png` → `bunny-mc.webp` |
| Happy Buddha | `happy_adaptive.png` → `happy-tetracoder.webp` | `happy_baseline.png` → `happy-tetrasdf.webp` | `happy_mc_288.png` → `happy-mc.webp` |
| Lucy | `lucy_adaptive.png` → `lucy-tetracoder.webp` | `lucy_baseline.png` → `lucy-tetrasdf.webp` | `lucy_mc_288.png` → `lucy-mc.webp` |

The research branch's `BUNNY_COMPARISON.md` and
`TetraSDF/validation/evaluate_stanford_consistency.py` identify `baseline` as
TetraSDF Large and `adaptive` as TetraCoder. `happy` is Happy Buddha. The MC
renders use the supplied `mc_288` variant. No metadata or export manifest
establishes its source checkpoint, which model's field was sampled, or the
precise interpretation of `288`; the website therefore avoids a same-field
extraction claim or an unverified grid-resolution claim for these images.

Contact sheets confirm the same camera/framing across each scene's three
renders. Armadillo is an upper-body view; Dragon and Lucy meet the source canvas
edges. This supplied framing is unchanged. These are qualitative mesh views,
not registered pixelwise error maps. Full-resolution PNGs remain outside the
website so the deployment stays compact.

## Other comparison alignment

The locality images already share exactly the same dimensions and framing;
the same resize is applied to all three. They demonstrate **editing locality**,
not an unedited image-fitting comparison. The red half-plane is the intended
edit, rather than missing media or a visualization mask added by the website.
Method labels and numeric benchmark claims should remain separate from these
images unless their exact source experiment is verified.

The four Lego images share dimensions and composition. They represent a
sequence of distinct scene changes; use stage selection or an original/edited
comparison. A static physics result should not be presented as an animation.

## Replacement media

For future interactive comparisons, export both methods at the same pixel
resolution, camera pose, crop, lighting, background, and color settings.
Preserve full-resolution originals separately. Avoid baked-in dividing lines
or labels: the website supplies those controls. Export videos as H.264 MP4
(optionally WebM too) with a poster image from the same camera path, and
include captions if narration is added.

No SDFoam result images or unverified experiment-cache images were reused.

## Original teaser

The main teaser is the actual three-panel paper teaser, in the order used by
`fig/teaser.tex`: Hash Encoder, TetraSDF, TetraCoder. The three PDF source pages
were rendered against white using macOS PDFKit/Core Graphics because Poppler
was not installed. No diagram or result content was redrawn, cropped, or
retouched. The individual pages were rendered to 1,000 pixels wide, then each
was uniformly resized to 600 pixels for the composite, with 20-pixel white
spaces between panels. The compound figure follows the paper's equal-width
panel layout. Lossless WebP preserves these rasterized pixels.

The visible caption reproduces the scientific text in `fig/teaser.tex`, with
TeX macros expanded to HTML. Only the outdated code-availability sentence is
omitted. Section text follows `sec/3_method.tex`, `sec/4_results.tex`, and the
qualitative captions, shortened to avoid repeated explanations. Demonstration
captions still identify the supplied training playback and crossfades accurately.

| Website asset | Source in manuscript `fig/` | Web dimensions |
| --- | --- | --- |
| `teaser-hash.webp` | `teaser_HE.pdf`, page 1 | 1000 × 934 |
| `teaser-tetrahash.webp` | `teaser_TSDF.pdf`, page 1 | 1000 × 935 |
| `teaser-tetracoder.webp` | `teaser_TC.pdf`, page 1 | 1000 × 955 |
| `teaser.webp` | The three preceding panels, in that order | 1840 × 573 |

## 2D image-fitting comparisons

The old diagonal composite and its separate table have been removed. All eight
current 2D comparison images come exclusively from the supplied
`budget_validation` folder. `ingp` identifies Hash encoding (Instant-NGP), and
`ours` identifies TetraCoder. There are no baked-in comparison dividers or
metric labels; the website renders those controls independently.

| Scene | Source files beneath `budget_validation/` | Source dimensions | Web dimensions | Website assets |
| --- | --- | --- | --- | --- |
| Albert | `albert/{ingp,ours}/reconstruction.png` | 1024 × 1024 | 1024 × 1024 | `toy-albert-{hash,tetracoder}.webp` |
| Summer | `summer/{ingp,ours}/reconstruction.png` | 6114 × 3734 | 2000 × 1221 | `toy-summer-{hash,tetracoder}.webp` |
| Pluto | `pluto/{ingp,ours}/reconstruction.png` | 8000 × 8000 | 2000 × 2000 | `toy-pluto-{hash,tetracoder}.webp` |
| Girl | `girl/{ingp,ours}/preview.png` | 860 × 1000 | 860 × 1000 | `toy-girl-{hash,tetracoder}.webp` |

Full reconstruction PNGs were used when supplied for both methods. Only preview
PNGs were supplied for Girl. Matching pairs share dimensions and framing. Both
methods receive identical proportional Lanczos resizing, followed by lossless
WebP encoding. Decoded RGB pixels match the resized source exactly; Albert and
Girl retain their original pixels. No cropping, padding, color changes,
sharpening, or synthetic image processing was applied. The eight assets total
13,430,020 bytes. Original PNGs remain outside the published site.

The viewer's optional zoom and pan apply the same CSS transform to both images.
The comparison divider, labels, and metrics are independent of that transform.
Magnification does not create higher-resolution data or alter the numerical
evaluation; the full-image reported scores stay unchanged at every zoom level.

### Reported metrics

All 14 supplied PNGs (including unused previews) are SHA-256-identical to their
matching files under the research branch's `2d_experiments/cache/budget_validation`.
The displayed values reproduce manuscript `tables/2d_toy_results.tex` (Table R1):

| Scene | Hash PSNR (dB) | Hash params (M) | TetraCoder PSNR (dB) | TetraCoder params (M) |
| --- | ---: | ---: | ---: | ---: |
| Albert | 50.31 | 5.75 | 59.81 | 3.61 |
| Summer | 37.94 | 6.57 | 38.18 | 4.82 |
| Pluto | 44.03 | 23.96 | 48.63 | 17.27 |
| Girl | 35.96 | 86.20 | 36.14 | 58.74 |

These are reported full-image results, not newly computed preview-image scores.
`2d_experiments/validate_budget_models.py` links this export directory to selected
models and their full-pixel validation. The selected-run/validation JSON files
are absent from this checkout, so exact unrounded results are not inferred.
The stored Summer values in `2d_experiments/HOWTO.txt` independently round to
the paper's values.

Parameter counts include stored encoder and decoder scalars. TetraCoder's count
includes XYZ site coordinates and decoder weights/biases; Hash includes native
alignment/padded output weights. Optimizer state and topology indices are
excluded. See the research branch's `2d_experiments/fit_image.py` and
`train_ingp.py`. Full-image PSNR evaluates unquantized sRGB predictions rather
than the resized display assets. No equal-training-work claim is added here.

## Editing cycle animation

`static/videos/editing-cycle.mp4` and `static/videos/editing-cycle.gif` are
derived from the four camera-52 `editing-*.webp` files listed above, in order:
Original, Appearance, Geometry, Simulation, then back to Original. The loop is
12 seconds, with a 2-second hold and 1-second smooth crossfade for each state.
These transitions blend recorded frames; they do not infer a geometric
deformation path or represent a continuous physics recording. No intermediate
scene geometry is synthesized.

These replace the earlier four manuscript editing images. Each WebP preserves
the complete 1600 × 1600 RGBA source pixels losslessly, with no cropping or
color changes. The supplied PNGs remain outside the website.

The images are composited against white before resizing. A white footer is
added below the source image, with all four state labels and smoothly changing
highlights; it does not cover result content. The final source frame equals
the first exactly, so the loop closes without a hard cut.

- MP4: 960 × 1030, 30 FPS, H.264, `yuv420p`, fast-start metadata, no audio;
  721,352 bytes.
- GIF: 640 × 686, 12 FPS, 144 frames, 12,000 ms, infinite loop;
  8,436,225 bytes.

The website embeds the much smaller MP4. The GIF is retained as an asset;
there are no media download links on the page.
Recreate both with `python3 scripts/website/make_editing_animation.py` (Pillow
and FFmpeg required). Pass `--ffmpeg` or `--font` if they are not found.
The generator streams raw frames without storing a frame sequence. Optional
QA contact sheets belong outside the published assets.

## User-supplied geometry-editing recording

`static/videos/geometry-editing.gif` is an exact, unmodified copy of the
user-supplied `lego_bucket_1600.gif`. It shows the yellow Lego bulldozer's bucket
moving downward and returning upward against a dark background. This continuous
geometry-editing recording is distinct from the four-still crossfade animation
above. The ending returns to the raised-bucket pose; no synthetic frames or
scene geometry were added.

The full 1600 × 1600 source resolution is retained. All 97 frames and their
variable presentation times and durations are preserved in the H.264 MP4,
including the longer holds at the beginning, lowest bucket position, and end.
The loop lasts 5.790 seconds. The MP4 is silent, uses `yuv420p`, and places its
fast-start metadata at the front for web delivery. It is encoded with libx264,
CRF 19, slow preset, and no B-frames so every frame duration is retained exactly.

- `static/videos/geometry-editing.gif`: 36,692,187 bytes; original 1600 × 1600
  GIF, 97 frames, 5,790 ms, infinite loop. Its SHA-256 matches the supplied file.
- `static/videos/geometry-editing.mp4`: 1,103,913 bytes; 1600 × 1600, 97 frames,
  5.790 seconds, preserving the original variable timing.
- `static/images/geometry-editing-poster.webp`: 270,128 bytes; the full 1600 × 1600
  first displayed frame, losslessly encoded as WebP.

Both animation formats were fully decoded for validation. Every MP4 frame's
presentation timestamp and duration matches the source GIF. The poster pixels
match the source first frame exactly. The smaller MP4 serves inline playback;
the original high-resolution GIF remains available as a download.

## User-supplied encoder adaptation recording

The assets below come from the explicitly named user-supplied files
`encoder-adaptation.mp4`, `encoder-adaptation-final.png`, and
`encoder-adaptation-states.png`. Files with `(1)` suffixes were not used.
The supplied `encoder-adaptation-initial.png` was inspected for context but is
not duplicated in the website assets.

The video pairs a tetrahedral grid cutaway with a reconstructed bunny surface.
Its embedded labels identify the left panel as tetrahedral cells crossing a
fixed plane and the right panel as analytic extraction from the same training
state. The surface begins absent and then emerges as the displayed training
iteration advances. The source labels show iteration 0 with 8,192 grid vertices
and 54,674 tetrahedra, and iteration 5,000 with 32,768 vertices and 210,322
tetrahedra. These are the values displayed in the supplied visualization, not
new measurements made for the website.

Sampled video footers at 0, 2, 4, 6, 8, and 10 seconds show iterations 0, 100,
1,300, 2,500, 3,900, and 5,000, respectively. The final state is held, and the
last frame adds the source's “NEXT LOOP: RESET TO INITIALIZATION” cue while
retaining iteration 5,000 and the final counts. Playback repeats the supplied
recording; no interpolated meshes or synthetic transition frames were added.

- `static/videos/encoder-adaptation.mp4`: 1,543,485 bytes; an exact, unmodified
  copy of the supplied MP4, verified by SHA-256. H.264, `yuv420p`, 1600 × 800,
  24 FPS, 288 frames, 12.000 seconds, no audio. The source already places its
  `moov` metadata before `mdat`, so fast-start delivery requires no remuxing.
- `static/images/encoder-adaptation-poster.webp`: 317,758 bytes; lossless WebP
  of `encoder-adaptation-final.png`, at the original 1600 × 800 resolution.
- `static/images/encoder-adaptation-states.webp`: 515,794 bytes; lossless WebP
  of `encoder-adaptation-states.png`, at the original 2400 × 800 resolution.
  It shows the labeled initial grid, adapted grid, and reconstructed surface.

The MP4 was fully decoded and its beginning, intermediate states, and ending
were visually inspected. Both WebPs preserve every RGB pixel of their source
PNG; no resizing, cropping, padding, or content edits were applied.
