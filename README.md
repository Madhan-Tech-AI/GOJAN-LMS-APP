install dependencies:
     npm add expo-av@latest
     npm add @react-native-picker/picker@latest
"# GO-LMS-APP" 

Environment variables (Supabase):
  Create a .env file in the project root with:
    EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

Usage example:
  import { getPublicAssetUrl } from './lib/supabase';
  const videoUrl = getPublicAssetUrl('lectures/lecture1.mp4');
  const pdfUrl = getPublicAssetUrl('lectures/notes.pdf');