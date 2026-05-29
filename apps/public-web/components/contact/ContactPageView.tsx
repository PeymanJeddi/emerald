import { ApplyNowSection } from "@/components/home/ApplyNowSection";
import { ContactDepartments } from "@/components/contact/ContactDepartments";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactFormSection } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactIntro } from "@/components/contact/ContactIntro";
import { ContactMethodsGrid } from "@/components/contact/ContactMethodsGrid";
import { ContactOffice } from "@/components/contact/ContactOffice";
import { ContactPartnerships } from "@/components/contact/ContactPartnerships";
import { ContactPriorityNotice } from "@/components/contact/ContactPriorityNotice";
import { ContactSocial } from "@/components/contact/ContactSocial";
import type { ContactContent } from "@/lib/contact-api";
import { PORTAL_REGISTER_URL } from "@/lib/portal-urls";

interface ContactPageViewProps {
  content: ContactContent;
}

export function ContactPageView({ content }: ContactPageViewProps) {
  return (
    <>
      <ContactHero hero={content.hero} />
      <ContactIntro title={content.introduction.title} body={content.introduction.body} />
      <ContactMethodsGrid
        sectionTitle={content.contact_methods.section_title}
        cards={content.contact_methods.cards ?? []}
      />
      <ContactFormSection
        form={{
          title: content.form.title,
          subtitle: content.form.subtitle,
          support_note: content.form.support_note,
          privacyUrl: content.form.privacy_url,
        }}
      />
      <ContactDepartments
        sectionTitle={content.departments.section_title}
        items={content.departments.items ?? []}
      />
      <ContactOffice office={content.office} />
      <ContactFAQ sectionTitle={content.faq.section_title} items={content.faq.items ?? []} />
      <ContactPartnerships data={content.partnerships} />
      <ContactSocial sectionTitle={content.social.section_title} links={content.social.links ?? []} />
      <ContactPriorityNotice title={content.priority_notice.title} body={content.priority_notice.body} />
      <ApplyNowSection
        title={content.cta.title}
        subtitle={content.cta.subtitle}
        primaryLabel={content.cta.primary_label ?? "Explore Events"}
        primaryUrl={content.cta.primary_url ?? "/events"}
        secondaryLabel={content.cta.secondary_label}
        secondaryUrl={content.cta.secondary_url ?? PORTAL_REGISTER_URL}
      />
    </>
  );
}
