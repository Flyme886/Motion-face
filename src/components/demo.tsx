"use client"

import * as React from "react"

import PolaroidLineCarousel, { type LandPalette, type Slide } from "@/components/ui/polaroid-line-carousel"

/*
 * Demo — six travel photographs pegged to the line.
 *
 * The JPEGs are deliberately NOT committed. Drop your own into
 * `public/photos/` under these exact names and they appear automatically:
 *
 *   first-bend.jpg  yellow-crane.jpg  toward-the-snow.jpg
 *   spring-in-reverse.jpg  yili-gold.jpg  nacreous.jpg
 *
 * Any shot whose file is missing falls back to the carousel's painted
 * landscape (the `palette` / `seed` below), so a fresh clone still runs and
 * still animates — it just hangs prints instead of photographs.
 */

type Shot = {
  file: string
  title: string
  caption: string
  alt: string
  palette: LandPalette
  seed: number
}

const SHOTS: Shot[] = [
  {
    file: "first-bend",
    title: "First Bend",
    caption: "The Yellow River unwinds across the grassland, seen from the cliff deck.",
    alt: "A wide river winding through green grassland below a wooden viewing deck.",
    palette: "mist",
    seed: 3,
  },
  {
    file: "yellow-crane",
    title: "Yellow Crane",
    caption: "Arms wide in front of the tower. Wuhan, an overcast afternoon.",
    alt: "A person jumping with arms raised in front of Yellow Crane Tower.",
    palette: "dawn",
    seed: 11,
  },
  {
    file: "toward-the-snow",
    title: "Toward the Snow",
    caption: "Riders resting on the meadow, clouds stacked over the range.",
    alt: "Three horsemen on a green meadow facing distant snow-capped mountains.",
    palette: "alpine",
    seed: 8,
  },
  {
    file: "spring-in-reverse",
    title: "Spring in Reverse",
    caption: "Cosmos at the shore, blossom overhead, a lake the colour of sky.",
    alt: "Pink cosmos flowers on a lakeshore beneath blossom branches and blue sky.",
    palette: "alpine",
    seed: 21,
  },
  {
    file: "yili-gold",
    title: "Yili Gold",
    caption: "A rider fords the shallows at golden hour. Ili, Xinjiang.",
    alt: "A rider on horseback crossing a shallow pond backlit by golden sun.",
    palette: "dusk",
    seed: 14,
  },
  {
    file: "nacreous",
    title: "Nacreous",
    caption: "Polar stratospheric clouds over a snowbound house at dusk.",
    alt: "Iridescent polar stratospheric clouds above a snow-covered house at dusk.",
    palette: "dusk",
    seed: 34,
  },
]

/** Which of `/photos/<file>.jpg` actually exist. `null` until probed. */
function useAvailablePhotos(files: string[]): boolean[] | null {
  const key = files.join("|")
  const [found, setFound] = React.useState<boolean[] | null>(null)
  React.useEffect(() => {
    let alive = true
    Promise.all(
      files.map(
        (f) =>
          new Promise<boolean>((resolve) => {
            const img = new Image()
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
            img.src = "/photos/" + f + ".jpg"
          }),
      ),
    ).then((r) => {
      if (alive) setFound(r)
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return found
}

export default function DemoPhotos() {
  const found = useAvailablePhotos(SHOTS.map((s) => s.file))

  // Hold the frame until the probe settles, so prints don't swap mid-animation.
  if (!found) {
    return <div style={{ height: "100svh", background: "var(--color-background)" }} />
  }

  const slides: Slide[] = SHOTS.map((s, i) => ({
    image: found[i] ? "/photos/" + s.file + ".jpg" : undefined,
    title: s.title,
    caption: s.caption,
    alt: s.alt,
    palette: s.palette,
    seed: s.seed,
  }))

  return <PolaroidLineCarousel slides={slides} />
}
