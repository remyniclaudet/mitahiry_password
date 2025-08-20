import { createClient } from "@supabase/supabase-js";

// Remplace par tes infos Supabase
const SUPABASE_URL = "https://zmidwokqawanpawpxxxc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptaWR3b2txYXdhbnBhd3B4eHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2Njk0OTIsImV4cCI6MjA3MTI0NTQ5Mn0.TI4qxj1Gk2VY3E5yur-jiwjiyRiENqtkQpnwkUJiJ-U";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
