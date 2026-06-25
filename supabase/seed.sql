-- Lumen — seed data. Run after schema.sql.
-- Images are Unsplash URLs; replace with your own asset host in production.

insert into categories (name, slug, description) values
  ('Workspace', 'workspace', 'Desk and studio essentials'),
  ('Audio', 'audio', 'Sound, crafted'),
  ('Lighting', 'lighting', 'Ambient and task lighting'),
  ('Accessories', 'accessories', 'The finishing details')
on conflict (slug) do nothing;

insert into products (name, slug, description, price, compare_at_price, image_url, category_id, stock, featured, rating, review_count)
select v.name, v.slug, v.description, v.price, v.compare_at_price, v.image_url,
       (select id from categories where slug = v.cat), v.stock, v.featured, v.rating, v.review_count
from (values
  ('Aperture Desk Lamp','aperture-desk-lamp','A minimalist aluminium task lamp with stepless dimming.',18900,22900,'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&h=900&q=80','lighting',24,true,4.8,42),
  ('Monarch Headphones','monarch-headphones','Over-ear wireless headphones with adaptive noise cancellation.',32900,null,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&h=900&q=80','audio',15,true,4.9,88),
  ('Linnea Oak Desk','linnea-oak-desk','Solid white-oak writing desk with a cable-managed spine.',64900,74900,'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&h=900&q=80','workspace',8,true,4.7,19),
  ('Pebble Wireless Mouse','pebble-wireless-mouse','Ergonomic, silent-click wireless mouse with a 90-day battery.',7900,null,'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&h=900&q=80','accessories',60,false,4.5,51),
  ('Aria Mechanical Keyboard','aria-mechanical-keyboard','A 75% hot-swap mechanical keyboard with PBT keycaps.',21900,24900,'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&h=900&q=80','workspace',31,true,4.8,64),
  ('Halo Floor Light','halo-floor-light','A dimmable LED floor lamp with an opal diffuser.',27900,null,'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=900&h=900&q=80','lighting',12,false,4.6,23),
  ('Cirrus Bookshelf Speakers','cirrus-bookshelf-speakers','A pair of two-way bookshelf speakers, matched set.',44900,49900,'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&h=900&q=80','audio',9,true,4.9,37),
  ('Field Leather Organizer','field-leather-organizer','A full-grain leather desk organizer that patinas beautifully.',9900,null,'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=900&h=900&q=80','accessories',40,false,4.4,28)
) as v(name,slug,description,price,compare_at_price,image_url,cat,stock,featured,rating,review_count)
on conflict (slug) do nothing;

insert into projects (title, slug, client, category, summary, cover_url, year, services, featured) values
  ('Northwind — Brand & Commerce','northwind','Northwind Coffee','Branding','A full rebrand and storefront that lifted online revenue 64% in a quarter.','https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=1200&h=800&q=80',2026,'["Brand Identity","E-commerce","Photography"]',true),
  ('Vela — Fintech Product Design','vela','Vela','Product','A mobile-first banking experience used by 200k+ customers.','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=800&q=80',2025,'["UX Research","Product Design","Webflow"]',true),
  ('Atlas Outdoors — Campaign','atlas-outdoors','Atlas','Campaign','An integrated launch campaign reaching 4M people.','https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&h=800&q=80',2025,'["Art Direction","Film","Paid Media"]',true),
  ('Mori — SaaS Marketing Site','mori','Mori Labs','Web','A high-converting marketing site and design system in six weeks.','https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&h=800&q=80',2026,'["Web Design","Next.js","SEO"]',false)
on conflict (slug) do nothing;

insert into team_members (name, role, bio, avatar_url, socials, sort_order) values
  ('Amara Okafor','Founder & Creative Director','Two decades shaping brands for startups and Fortune 500s.','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80','{"x":"#","linkedin":"#"}',1),
  ('Daniel Cho','Head of Engineering','Full-stack lead who ships fast without breaking things.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80','{"x":"#","github":"#"}',2),
  ('Sofia Marenco','Design Lead','Obsessed with the details users never notice but always feel.','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80','{"linkedin":"#"}',3),
  ('Marcus Bell','Strategy Director','Turns business problems into creative briefs.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80','{"x":"#"}',4)
on conflict do nothing;

insert into service_packages (name, tagline, price, billing, features, popular, sort_order) values
  ('Launch','For startups finding their voice',750000,'project','["Brand identity & logo","Messaging & positioning","Landing page design + build","2 rounds of revisions","4-week delivery"]',false,1),
  ('Growth','Our most popular engagement',1800000,'project','["Everything in Launch","Full marketing website","Design system & components","E-commerce storefront","SEO & analytics setup","8-week delivery"]',true,2),
  ('Partner','An embedded team, monthly',0,'custom','["Dedicated design + dev pod","Ongoing product work","Quarterly strategy","Priority support","Flexible scope"]',false,3)
on conflict do nothing;

insert into blog_posts (title, slug, excerpt, content, cover_url, author, tag, read_minutes, published_at) values
  ('Why your storefront speed is a brand decision','storefront-speed-brand','Performance is how customers feel your brand before they read a word.','Performance isn''t an engineering nicety — it''s how customers feel your brand before they read a word.','https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=700&q=80','Daniel Cho','Engineering',6,'2026-05-12'),
  ('The brief is the product','the-brief-is-the-product','The quality of creative work is capped by the quality of the brief.','A good brief is a forcing function for clarity.','https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=1200&h=700&q=80','Marcus Bell','Strategy',4,'2026-04-28'),
  ('Designing a checkout people actually finish','checkout-people-finish','Cart abandonment is mostly a design problem.','Most drop-off happens for boring reasons: surprise costs and slow forms.','https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&h=700&q=80','Sofia Marenco','Design',5,'2026-04-09')
on conflict (slug) do nothing;
