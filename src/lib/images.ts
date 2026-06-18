/**
 * Curated real photography for ElimuSphere Kenya.
 *
 * IMPORTANT: every ID below was verified by fetching its actual Unsplash
 * photo page and confirming (a) it resolves on the free images.unsplash.com
 * CDN - never the paid plus.unsplash.com tier, which requires a paid API
 * key and silently fails to load without one - and (b) it carries the
 * standard "Unsplash License" (free to use), not an Unsplash+ license.
 * Do not add new keys here without doing the same check; a wrong or
 * Unsplash+ id is exactly what causes images to silently fail to render.
 *
 * `img()` appends Unsplash's image-processing query params so every call
 * site gets a correctly-sized, compressed asset. The default width (1200)
 * and quality (80) are set high enough to stay crisp on 2x/3x device
 * pixel ratios (typical on modern phones) - a narrower request than the
 * rendered CSS size is what makes a "real" photo look soft or blurry.
 */

type ImgOpts = {
  w?: number;
  h?: number;
  fit?: 'crop' | 'clip' | 'fill';
  q?: number;
};

const BASE: Record<string, string> = {
  // Hero / classroom
  heroClassroom: 'photo-1473649085228-583485e6e4d7', // children sitting on chairs inside a classroom

  // Role cards
  learnerPortal: 'photo-1758685848895-e724272475d2', // student studying at a desk with a chalkboard
  teacherHub: 'photo-1632215861513-130b66fe97f4', // woman standing in front of a group of children
  heroTeacherTablet: 'photo-1632215861513-130b66fe97f4', // reuse: same teacher/children photo
  parentMonitor: 'photo-1551498800-17cbc39c85bb', // woman reading with a girl on a picnic mat
  schoolErp: 'photo-1473649085228-583485e6e4d7', // reuse: classroom photo reads well for the institution card too

  // AI / tech accents
  aiTutorChat: 'photo-1726066012801-14d892021339', // close-up of a person using a mobile payment app
  codingKids: 'photo-1660616246653-e2c57d1077b9', // close-up of code on a computer screen
  dataDashboard: 'photo-1660616246653-e2c57d1077b9', // reuse: same code/screen photo

  // People (about / careers)
  portraitTeacherFemale: 'photo-1632215861513-130b66fe97f4',
  portraitTeacherMale: 'photo-1758685848895-e724272475d2',
  portraitParent: 'photo-1551498800-17cbc39c85bb',

  // Subjects / curriculum imagery
  mathematics: 'photo-1758685734303-e85757067f28', // hand writing mathematical formulas on a chalkboard
  science: 'photo-1758685734303-e85757067f28', // reuse: chalkboard/formula photo doubles for general "science"
  agriculture: 'photo-1560493676-04071c5f467b', // rows of green crops in a field at sunset
  reading: 'photo-1567057420215-0afa9aa9253a', // children writing in books
  computerLab: 'photo-1660616246653-e2c57d1077b9', // reuse: code on screen

  // Payments / mobile money
  mobileMoneyPhone: 'photo-1726066012801-14d892021339',

  // Auth pages
  authClassroom: 'photo-1473649085228-583485e6e4d7',
  authStudyGroup: 'photo-1567057420215-0afa9aa9253a',
};

export function img(key: keyof typeof BASE, opts: ImgOpts = {}): string {
  const id = BASE[key];
  const { w = 1200, h, fit = 'crop', q = 80 } = opts;
  const params = new URLSearchParams({
    auto: 'format',
    fit,
    q: String(q),
    w: String(w),
  });
  if (h) params.set('h', String(h));
  return `https://images.unsplash.com/${id}?${params.toString()}`;
}

/** Convenience: returns a srcSet-ready pair of small/large for responsive images. */
export function imgSrcSet(key: keyof typeof BASE, baseWidth = 800): { src: string; srcSet: string } {
  return {
    src: img(key, { w: baseWidth }),
    srcSet: `${img(key, { w: baseWidth })} ${baseWidth}w, ${img(key, { w: baseWidth * 2 })} ${baseWidth * 2}w`,
  };
}
