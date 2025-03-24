-- Create the SMS logs table to track message history
CREATE TABLE public.sms_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    message_body TEXT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add index for better query performance
CREATE INDEX idx_sms_logs_created_at ON public.sms_logs(created_at);
CREATE INDEX idx_sms_logs_phone_number ON public.sms_logs(phone_number);

-- Enable Row Level Security
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow authenticated users full access to sms_logs" 
    ON public.sms_logs FOR ALL TO authenticated USING (true);

COMMENT ON TABLE public.sms_logs IS 'Table to store SMS message logs';
COMMENT ON COLUMN public.sms_logs.id IS 'Unique identifier for the SMS log entry';
COMMENT ON COLUMN public.sms_logs.phone_number IS 'Recipient phone number';
COMMENT ON COLUMN public.sms_logs.message_body IS 'The content of the SMS message';
COMMENT ON COLUMN public.sms_logs.success IS 'Whether the SMS was sent successfully';
COMMENT ON COLUMN public.sms_logs.error_message IS 'Error message if the SMS failed to send';
COMMENT ON COLUMN public.sms_logs.created_at IS 'Timestamp when the SMS was sent'; 