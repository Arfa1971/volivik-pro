import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tqrbvdgndgxevvzqcbjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxcmJ2ZGduZGd4ZXZ2enFjYmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDY1NDYsImV4cCI6MjA1MzM4MjU0Nn0.kGDoBtDfW_7kSr7eIJ7LmszbzEZ0yclVI5JegIzO__U';

export const supabase = createClient(supabaseUrl, supabaseKey);
