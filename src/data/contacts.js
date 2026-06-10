export const SITE_CONTACTS = {
  phones: [
    {
      label: 'Оптом',
      display: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+998 99 798 49 88',
      href: process.env.NEXT_PUBLIC_CONTACT_PHONE_HREF || '+998997984988',
    },
    {
      label: 'Оптом',
      display: process.env.NEXT_PUBLIC_CONTACT_PHONE_2 || '+998 94 567 01 11',
      href: process.env.NEXT_PUBLIC_CONTACT_PHONE_HREF_2 || '+998945670111',
    },
  ],
  telegram: {
    username: 'nurli_zamin_uz',
    url: 'https://t.me/nurli_zamin_uz',
  },
  instagram: {
    username: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'nurli_zamin_uz',
    url: `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'nurli_zamin_uz'}`,
  },
};

/** @deprecated use SITE_CONTACTS.phones[0] */
export const phone = SITE_CONTACTS.phones[0].display;
/** @deprecated use SITE_CONTACTS.phones[0] */
export const phoneHref = SITE_CONTACTS.phones[0].href;
