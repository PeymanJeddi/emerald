import { MarkdownContent } from "@/components/cms/MarkdownContent";
import { Container } from "@/components/ui/Container";

interface EventMarkdownSectionProps {
  id?: string;
  title: string;
  markdown: string;
  className?: string;
}

export function EventMarkdownSection({ id, title, markdown, className = "" }: EventMarkdownSectionProps) {
  if (!markdown.trim()) return null;
  return (
    <section id={id} className={`py-12 lg:py-16 ${className}`.trim()}>
      <Container>
        <h2 className="font-serif text-2xl text-emerald sm:text-3xl">{title}</h2>
        <div className="gold-divider mt-4 max-w-xs" aria-hidden />
        <div className="mt-8 max-w-3xl">
          <MarkdownContent content={markdown} />
        </div>
      </Container>
    </section>
  );
}
