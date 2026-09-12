CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  label text,
  group_name text NOT NULL DEFAULT 'General',
  multiline boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site content is public" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage site content" ON public.site_content FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  number_label text NOT NULL DEFAULT '01',
  short_description text,
  full_description text,
  cover_image_url text,
  cover_image_alt text,
  featured_image_url text,
  cta_text text,
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "active services are public" ON public.services FOR SELECT TO anon, authenticated USING (active OR is_admin());
CREATE POLICY "admins manage services" ON public.services FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.services (slug, name, number_label, short_description, display_order, cta_text) VALUES
  ('social-media-marketing', 'Social Media', '01', 'Strategy, content and day-to-day management that keeps a brand consistent.', 1, 'Start a project'),
  ('web-design-seo', 'Websites & SEO', '02', 'Fast, mobile-first websites built around credibility and conversion.', 2, 'Build my website'),
  ('flyer-campaigns', 'Solo Flyer Campaigns', '03', 'One business, one dedicated print campaign, targeted to local neighbourhoods.', 3, 'Plan a campaign'),
  ('nfc-review-cards', 'NFC & Reputation', '04', 'Tap cards that take customers straight to a business''s Google profile.', 4, 'Start a project'),
  ('graphic-design', 'Graphic Design', '05', 'Flyers, cards, ads and brand assets that hold together as one identity.', 5, 'Start a project');

INSERT INTO public.site_content (key, label, group_name, multiline, display_order, value) VALUES
  ('home_hero_eyebrow', 'Homepage hero eyebrow', 'Homepage', false, 1, 'AdMosaic — Edmonton marketing agency'),
  ('home_hero_headline', 'Homepage headline', 'Homepage', true, 2, 'Marketing that makes businesses impossible to overlook.'),
  ('home_hero_subheading', 'Homepage subheading', 'Homepage', true, 3, 'AdMosaic combines digital strategy, design and local marketing to help businesses build stronger brands and reach more customers.'),
  ('home_intro_headline', 'Homepage intro headline', 'Homepage', true, 4, 'Everything your brand needs to move forward.'),
  ('home_intro_body', 'Homepage intro body', 'Homepage', true, 5, 'Businesses shouldn''t need five different companies to manage their website, social media, print marketing, design and online reputation. AdMosaic brings those pieces together under one creative partner.'),
  ('cta_headline', 'Final CTA headline', 'Calls to action', true, 6, 'Let''s make your business harder to ignore.'),
  ('cta_body', 'Final CTA copy', 'Calls to action', true, 7, 'Tell us where your business is today and where you want it to go. We''ll help determine what gets you there.'),
  ('about_headline', 'About headline', 'About', true, 8, 'Built locally. Thinking bigger.'),
  ('about_body', 'About copy', 'About', true, 9, 'AdMosaic is an Edmonton-based marketing agency built around a simple idea: small and growing businesses deserve marketing that looks as professional as the companies they''re competing against.'),
  ('contact_email', 'Contact email', 'Contact', false, 10, 'hello@admosaicmarketing.com'),
  ('contact_phone', 'Contact phone', 'Contact', false, 11, ''),
  ('contact_location', 'Location', 'Contact', false, 12, 'Edmonton, Alberta, Canada'),
  ('social_instagram', 'Instagram URL', 'Contact', false, 13, 'https://instagram.com/admosaicmarketing'),
  ('footer_text', 'Footer text', 'Footer', true, 14, 'AdMosaic Marketing — digital strategy, design and local marketing in Edmonton.');