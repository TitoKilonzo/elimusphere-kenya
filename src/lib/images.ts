/**
 * Curated real photography for ElimuSphere Kenya.
 *
 * All images are served directly from Unsplash's CDN (images.unsplash.com),
 * which allows hot-linking without an API key. Each entry points at a real,
 * specific photograph (not a generic "/random" search) so the same image
 * loads reliably every time and the crop/quality can be tuned per use.
 *
 * `img()` appends Unsplash's image-processing query params so every call
 * site gets a correctly-sized, compressed asset (important for the
 * low-end-Android, patchy-data audience this product targets).
 */

type ImgOpts = {
  w?: number;
  h?: number;
  fit?: 'crop' | 'clip' | 'fill';
  q?: number;
};

const BASE: Record<string, string> = {
  // Hero / landing
  heroClassroom: 'photo-1497486751825-1233686d614e', // students raising hands in classroom
  heroTeacherTablet: 'photo-1610484826967-09c5720778c7', // teacher with tablet in African classroom
  heroKidsLaptop: 'photo-1588072432836-e10032774350', // kids using laptop together

  // Role cards
  learnerPortal: 'photo-1503676260728-1c00da094a0b', // student writing notes, focused
  teacherHub: 'photo-1577896851231-70ef18881754', // teacher at whiteboard
  parentMonitor: 'photo-1591711788400-c2c5db73c1c4', // parent and child with book
  schoolErp: 'photo-1523240795612-9a054b0db644', // school building / campus

  // AI / tech accents
  aiTutorChat: 'photo-1531482615713-2afd69097998', // person using phone, mobile-first
  codingKids: 'photo-1581091226825-a6a2a5aee158', // laptop coding close-up
  dataDashboard: 'photo-1551288049-bebda4e38f71', // analytics dashboard on screen

  // People (for testimonials / about)
  portraitTeacherFemale: 'photo-1573496359142-b8d87734a5a2',
  portraitTeacherMale: 'photo-1507003211169-0a1dd7228f2d',
  portraitStudentFemale: 'photo-1517841905240-472988babdf9',
  portraitStudentMale: 'photo-1500648767791-00dcc994a43e',
  portraitParent: 'photo-1542206395-9feb3edaa68d',

  // Subjects / curriculum imagery
  mathematics: 'photo-1635070041078-e363dbe005cb',
  science: 'photo-1532094349884-543bc11b234d',
  agriculture: 'photo-1500651230702-0e2d8a49d4ad',
  reading: 'photo-1543002588-bfa74002ed7e',
  computerLab: 'photo-1581092580497-e0d23cbdf1dc',

  // Payments / mobile money
  mobileMoneyPhone: 'photo-1556742049-0cfed4f6a45d',

  // Auth pages
  authClassroom: 'photo-1509062522246-3755977927d7', // students in classroom, side angle
  authStudyGroup: 'photo-1529390079861-591de354faf5', // study group outdoors

  // Backgrounds / textures
  savannaPattern: 'photo-1516026672322-bc52d61a55d5', // Kenyan landscape (subtle hero backdrop)
};

export function img(key: keyof typeof BASE, opts: ImgOpts = {}): string {
  const id = BASE[key];
  const { w = 800, h, fit = 'crop', q = 75 } = opts;
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
export function imgSrcSet(key: keyof typeof BASE, baseWidth = 640): { src: string; srcSet: string } {
  return {
    src: img(key, { w: baseWidth }),
    srcSet: `${img(key, { w: baseWidth })} ${baseWidth}w, ${img(key, { w: baseWidth * 2 })} ${baseWidth * 2}w`,
  };
}
