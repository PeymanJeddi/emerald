import Link from "next/link";

export default function CMSPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Content Management</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/cms/homepage" className="archival-card rounded-sm p-6 hover:border-emerald">Homepage Sections</Link>
        <Link href="/cms/about" className="archival-card rounded-sm p-6 hover:border-emerald">About Page</Link>
        <Link href="/cms/contact" className="archival-card rounded-sm p-6 hover:border-emerald">Contact Page</Link>
        <Link href="/cms/pages" className="archival-card rounded-sm p-6 hover:border-emerald">Pages</Link>
        <Link href="/cms/terms" className="archival-card rounded-sm p-6 hover:border-emerald">Terms & Conditions</Link>
        <Link href="/cms/hero-carousel" className="archival-card rounded-sm p-6 hover:border-emerald">Hero Carousel</Link>
        <Link href="/cms/testimonials" className="archival-card rounded-sm p-6 hover:border-emerald">Testimonials</Link>
        <Link href="/cms/navigation" className="archival-card rounded-sm p-6 hover:border-emerald">Navigation</Link>
        <Link href="/cms/footer" className="archival-card rounded-sm p-6 hover:border-emerald">Footer</Link>
      </div>
    </div>
  );
}
