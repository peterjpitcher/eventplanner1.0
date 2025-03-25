-- Seed data for development/testing purposes

-- Sample customers
INSERT INTO public.customers (first_name, last_name, email, phone, address, notes, sms_opt_in)
VALUES 
  ('John', 'Doe', 'john.doe@example.com', '1234567890', '123 Main St, Anytown', 'Regular customer', true),
  ('Jane', 'Smith', 'jane.smith@example.com', '2345678901', '456 Oak Ave, Othertown', 'VIP customer', true),
  ('Robert', 'Johnson', 'robert.johnson@example.com', '3456789012', '789 Pine Rd, Somewhere', 'Prefers window seating', false),
  ('Lisa', 'Williams', 'lisa.williams@example.com', '4567890123', '321 Elm St, Nowhere', 'Allergic to nuts', true),
  ('Michael', 'Brown', 'michael.brown@example.com', '5678901234', '654 Maple Dr, Anywhere', 'Birthday on October 15', true)
ON CONFLICT DO NOTHING;

-- Sample events (with dates relative to current date)
INSERT INTO public.events (
  title, 
  description, 
  event_type_id, 
  start_time, 
  end_time, 
  capacity, 
  location, 
  status
)
VALUES 
  (
    'Live Music with The Local Band', 
    'Join us for a night of great music with local favorite The Local Band.', 
    (SELECT id FROM public.event_types WHERE name = 'Live Music' LIMIT 1), 
    now() + interval '7 days' + interval '19 hours', 
    now() + interval '7 days' + interval '22 hours', 
    50, 
    'Main Stage', 
    'published'
  ),
  (
    'Weekly Quiz Night', 
    'Test your knowledge and win prizes at our popular weekly quiz.', 
    (SELECT id FROM public.event_types WHERE name = 'Quiz Night' LIMIT 1), 
    now() + interval '3 days' + interval '20 hours', 
    now() + interval '3 days' + interval '22 hours', 
    40, 
    'Main Bar Area', 
    'published'
  ),
  (
    'Happy Hour Special', 
    '2-for-1 on all drinks from 5-7pm.', 
    (SELECT id FROM public.event_types WHERE name = 'Special Offer' LIMIT 1), 
    now() + interval '1 day' + interval '17 hours', 
    now() + interval '1 day' + interval '19 hours', 
    NULL, 
    'All Areas', 
    'published'
  ),
  (
    'Premier League Match Screening', 
    'Watch the big game on our large screens with special game day menu.', 
    (SELECT id FROM public.event_types WHERE name = 'Sports Viewing' LIMIT 1), 
    now() + interval '10 days' + interval '15 hours', 
    now() + interval '10 days' + interval '17 hours', 
    60, 
    'Sports Bar', 
    'published'
  ),
  (
    'Corporate Networking Event', 
    'Private event for local business networking.', 
    (SELECT id FROM public.event_types WHERE name = 'Private Party' LIMIT 1), 
    now() + interval '14 days' + interval '18 hours', 
    now() + interval '14 days' + interval '21 hours', 
    30, 
    'Function Room', 
    'draft'
  )
ON CONFLICT DO NOTHING;

-- Sample bookings
INSERT INTO public.bookings (
  event_id, 
  customer_id, 
  status, 
  number_of_people, 
  special_requests
)
SELECT 
  e.id, 
  c.id, 
  'confirmed', 
  FLOOR(RANDOM() * 5) + 1, 
  CASE 
    WHEN RANDOM() > 0.7 THEN 'Please reserve a table near the stage' 
    WHEN RANDOM() > 0.4 THEN 'Celebrating a birthday' 
    ELSE NULL 
  END
FROM public.events e
CROSS JOIN public.customers c
WHERE e.status = 'published'
LIMIT 10
ON CONFLICT DO NOTHING; 