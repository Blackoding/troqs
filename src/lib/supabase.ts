import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yytuikkqxtsnocjjmwtl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dHVpa2txeHRzbm9jamptd3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1Nzc4ODAsImV4cCI6MjA3MjE1Mzg4MH0.Ng74mU2MSEddo8QOjhvDYlnRO_h1jxcmXR-FoKDvM1E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para operações com service role (usar apenas no servidor)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dHVpa2txeHRzbm9jamptd3RsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU3Nzg4MCwiZXhwIjoyMDcyMTUzODgwfQ._SKBUQfo70SPGROknA-eDCVoIFoPuiNoyPEe5QXwE98'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
