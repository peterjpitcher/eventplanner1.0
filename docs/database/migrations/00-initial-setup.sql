-- Initial database schema for Event Management System
-- This script should be run in the Supabase SQL Editor

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table to extend auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up RLS policy for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  notes TEXT,
  sms_opt_in BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Set up RLS policy for customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read customers
CREATE POLICY "Authenticated users can view customers" ON public.customers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert customers
CREATE POLICY "Authenticated users can create customers" ON public.customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update customers
CREATE POLICY "Authenticated users can update customers" ON public.customers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only admins and the creator can delete customers
CREATE POLICY "Users can delete customers they created" ON public.customers
  FOR DELETE USING (auth.uid() = created_by);

-- Create event_types table
CREATE TABLE IF NOT EXISTS public.event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up RLS policy for event_types
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read event types
CREATE POLICY "Authenticated users can view event types" ON public.event_types
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can create event types
CREATE POLICY "Authenticated users can create event types" ON public.event_types
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update event types
CREATE POLICY "Authenticated users can update event types" ON public.event_types
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create initial event types
INSERT INTO public.event_types (name, description, color)
VALUES 
  ('Live Music', 'Live band or musician performances', '#3B82F6'),
  ('Quiz Night', 'Trivia and quiz competitions', '#10B981'),
  ('Special Offer', 'Happy hours and special promotions', '#F59E0B'),
  ('Sports Viewing', 'Live sports broadcasts', '#EF4444'),
  ('Private Party', 'Reserved events and private functions', '#8B5CF6')
ON CONFLICT (name) DO NOTHING;

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type_id UUID REFERENCES public.event_types(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity INTEGER,
  location TEXT,
  image_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurring_pattern JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Set up RLS policy for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read events
CREATE POLICY "Authenticated users can view events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert events
CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update events
CREATE POLICY "Authenticated users can update events" ON public.events
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only creators can delete events
CREATE POLICY "Users can delete events they created" ON public.events
  FOR DELETE USING (auth.uid() = created_by);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id),
  customer_id UUID REFERENCES public.customers(id),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlisted')),
  number_of_people INTEGER NOT NULL DEFAULT 1,
  special_requests TEXT,
  payment_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Set up RLS policy for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read bookings
CREATE POLICY "Authenticated users can view bookings" ON public.bookings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert bookings
CREATE POLICY "Authenticated users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update bookings
CREATE POLICY "Authenticated users can update bookings" ON public.bookings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only creators can delete bookings
CREATE POLICY "Users can delete bookings they created" ON public.bookings
  FOR DELETE USING (auth.uid() = created_by);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id),
  booking_id UUID REFERENCES public.bookings(id),
  event_id UUID REFERENCES public.events(id),
  type TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  sent_at TIMESTAMP WITH TIME ZONE,
  external_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up RLS policy for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read notifications
CREATE POLICY "Authenticated users can view notifications" ON public.notifications
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can create notifications
CREATE POLICY "Authenticated users can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Set up functions and triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_customers_modtime
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_event_types_modtime
BEFORE UPDATE ON public.event_types
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_events_modtime
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_bookings_modtime
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Set up trigger to create profile on user sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auth.users to create profile
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE handle_new_user(); 