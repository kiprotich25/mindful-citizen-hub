
-- Enable Row Level Security on existing tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user progress tracking table
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  module_id UUID REFERENCES public.modules NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for modules (public read access)
CREATE POLICY "Anyone can view modules" ON public.modules
  FOR SELECT USING (true);

-- RLS Policies for quizzes (public read access)
CREATE POLICY "Anyone can view quizzes" ON public.quizzes
  FOR SELECT USING (true);

-- RLS Policies for institutions (public read access)
CREATE POLICY "Anyone can view institutions" ON public.institutions
  FOR SELECT USING (true);

-- RLS Policies for moods (users can only see their own)
CREATE POLICY "Users can view own moods" ON public.moods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own moods" ON public.moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own moods" ON public.moods
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data for modules
INSERT INTO public.modules (title, content, category, level) VALUES
('Understanding Your Rights', 'Learn about fundamental civic rights and freedoms in a democratic society.', 'civic', 'beginner'),
('Voting and Elections', 'Comprehensive guide to the electoral process and your voting rights.', 'civic', 'intermediate'),
('Mental Health Awareness', 'Understanding mental health, recognizing signs, and seeking help.', 'mental', 'beginner'),
('Stress Management', 'Practical techniques for managing stress and anxiety in daily life.', 'mental', 'intermediate'),
('Drug Prevention Basics', 'Understanding the risks and making informed decisions about substance use.', 'drugs', 'beginner'),
('Addiction Recovery Resources', 'Support systems and resources for addiction recovery.', 'drugs', 'advanced');

-- Insert sample data for institutions
INSERT INTO public.institutions (name, location, services, phone, email, paid) VALUES
('Community Health Center', 'Downtown', 'Mental health counseling, addiction support', '555-0123', 'info@chc.org', false),
('Legal Aid Society', 'Main Street', 'Free legal consultation, civic rights support', '555-0456', 'help@legalsociety.org', false),
('Wellness Institute', 'North Side', 'Premium mental health services, therapy', '555-0789', 'contact@wellness.com', true),
('Recovery Center', 'South District', 'Addiction treatment, rehabilitation programs', '555-0321', 'support@recoverycenter.org', false);

-- Insert sample quizzes
INSERT INTO public.quizzes (question, options, correct_answer, module_id) 
SELECT 
  'What is the most fundamental right in a democracy?',
  '["Right to vote", "Right to property", "Right to work", "Right to travel"]'::jsonb,
  'Right to vote',
  id
FROM public.modules WHERE title = 'Understanding Your Rights'
LIMIT 1;
