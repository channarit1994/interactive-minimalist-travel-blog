export const metadata = {
  title: "About — Taiwan Stories",
  description: "A minimalist travel journal about discovering Taiwan one story at a time.",
};

export default function AboutPage() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-light tracking-tight text-[#2C302E] mb-12">
        About
      </h1>

      <div className="flex flex-col gap-6 text-base text-[#2C302E]/70 leading-8">
        <p>
          Taiwan Stories is a personal travel journal documenting slow,
          deliberate wandering across the island — from the mountain gorges
          of the east coast to the ancient temples of Tainan, from Taipei&apos;s
          dawn markets to the lantern-lit stairways of Jiufen.
        </p>
        <p>
          The format is intentionally minimal: clean typography, wide
          margins, no advertisements, no recommended products. Just the
          stories, the places, and the photographs.
        </p>
        <p>
          The interactive map is the centrepiece — every article is anchored
          to a precise location. Click a city, find a story. Zoom in, read
          slowly, get a little lost.
        </p>
      </div>

      <div className="mt-16 pt-8 border-t border-[#2C302E]/10">
        <p className="text-xs text-[#2C302E]/30 tracking-wide">
          Built with Next.js · Framer Motion · Strapi CMS
        </p>
      </div>
    </section>
  );
}
