ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS page text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS field_type text NOT NULL DEFAULT 'text';

UPDATE public.site_content SET page = CASE
  WHEN group_name = 'Homepage' THEN 'Homepage'
  WHEN group_name = 'About' THEN 'About'
  WHEN group_name = 'Contact' THEN 'Contact'
  ELSE 'Site-wide' END
WHERE page = 'General';

UPDATE public.site_content SET field_type = CASE WHEN multiline THEN 'textarea' ELSE 'text' END;

INSERT INTO public.site_content (key, value, label, group_name, page, field_type, multiline, display_order) VALUES
  ('home_hero_image', '', 'Hero image', 'Hero', 'Homepage', 'image', false, 4),
  ('home_work_title', '', 'Selected work heading', 'Selected work', 'Homepage', 'text', false, 20),
  ('home_work_intro', '', 'Selected work intro', 'Selected work', 'Homepage', 'textarea', true, 21),
  ('home_flyer_eyebrow', '', 'Flyer section label', 'Flyer campaigns', 'Homepage', 'text', false, 30),
  ('home_flyer_headline', '', 'Flyer headline', 'Flyer campaigns', 'Homepage', 'text', false, 31),
  ('home_flyer_body', '', 'Flyer copy', 'Flyer campaigns', 'Homepage', 'textarea', true, 32),
  ('home_flyer_image', '', 'Flyer image', 'Flyer campaigns', 'Homepage', 'image', false, 33),
  ('home_web_eyebrow', '', 'Website section label', 'Websites & SEO', 'Homepage', 'text', false, 40),
  ('home_web_headline', '', 'Website headline', 'Websites & SEO', 'Homepage', 'text', false, 41),
  ('home_web_body', '', 'Website copy', 'Websites & SEO', 'Homepage', 'textarea', true, 42),
  ('home_web_image', '', 'Website image', 'Websites & SEO', 'Homepage', 'image', false, 43),
  ('home_nfc_eyebrow', '', 'NFC section label', 'NFC & reputation', 'Homepage', 'text', false, 50),
  ('home_nfc_headline', '', 'NFC headline', 'NFC & reputation', 'Homepage', 'text', false, 51),
  ('home_nfc_body', '', 'NFC copy', 'NFC & reputation', 'Homepage', 'textarea', true, 52),
  ('home_nfc_image', '', 'NFC image', 'NFC & reputation', 'Homepage', 'image', false, 53),
  ('home_social_eyebrow', '', 'Social section label', 'Social media', 'Homepage', 'text', false, 60),
  ('home_social_headline', '', 'Social headline', 'Social media', 'Homepage', 'text', false, 61),
  ('home_social_body', '', 'Social copy', 'Social media', 'Homepage', 'textarea', true, 62),
  ('home_social_image', '', 'Social image', 'Social media', 'Homepage', 'image', false, 63),
  ('home_design_eyebrow', '', 'Design section label', 'Graphic design', 'Homepage', 'text', false, 70),
  ('home_design_headline', '', 'Design headline', 'Graphic design', 'Homepage', 'text', false, 71),
  ('home_design_image', '', 'Design image', 'Graphic design', 'Homepage', 'image', false, 72),
  ('home_why_headline', '', 'Why AdMosaic headline', 'Why AdMosaic', 'Homepage', 'text', false, 80),
  ('home_why_body', '', 'Why AdMosaic copy', 'Why AdMosaic', 'Homepage', 'textarea', true, 81),
  ('about_image', '', 'About page image', 'About', 'About', 'image', false, 5),
  ('about_how_heading', '', 'How we work heading', 'About', 'About', 'text', false, 6),
  ('contact_headline', '', 'Contact headline', 'Contact', 'Contact', 'text', false, 1),
  ('contact_intro', '', 'Contact intro', 'Contact', 'Contact', 'textarea', true, 2),
  ('contact_instagram_handle', '', 'Instagram handle shown', 'Contact', 'Contact', 'text', false, 6)
ON CONFLICT (key) DO NOTHING;

UPDATE public.site_content SET page = 'Homepage' WHERE key LIKE 'home\_%';
UPDATE public.site_content SET page = 'About' WHERE key LIKE 'about\_%';
UPDATE public.site_content SET page = 'Contact' WHERE key LIKE 'contact\_%' OR key = 'social_instagram';
UPDATE public.site_content SET page = 'Site-wide' WHERE key LIKE 'cta\_%' OR key LIKE 'footer\_%';
UPDATE public.site_content SET group_name = 'Hero' WHERE key LIKE 'home_hero%';
UPDATE public.site_content SET group_name = 'Intro' WHERE key LIKE 'home_intro%';
UPDATE public.site_content SET group_name = 'Closing call to action' WHERE key LIKE 'cta\_%';
UPDATE public.site_content SET group_name = 'Footer' WHERE key LIKE 'footer\_%';
UPDATE public.site_content SET group_name = 'Contact' WHERE page = 'Contact';
UPDATE public.site_content SET group_name = 'About' WHERE page = 'About';