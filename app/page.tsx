import TitleScreen from './titleScreen';
import { supabase } from '../lib/init';
import { lookupTheme } from './actions';

async function getData(): Promise<string[]> {
  const response = await supabase
    .from('v_selected_categories')
    .select('category')
    .limit(8);

  return response.data?.map((row) => row.category as string) ?? [];
}

export default async function Home() {
  const categories = await getData();
  const theme = await lookupTheme();

  return <TitleScreen categories={categories} theme={theme} />;
}
