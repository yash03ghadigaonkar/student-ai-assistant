const SUPABASE_URL = "https://yshrcwmlziyqufqouiux.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_sBHacVAncIvqRBoSrt6_fA_Wm86BF_U";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);