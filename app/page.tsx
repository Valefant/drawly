import TitleScreen from './titleScreen';

async function getData(): Promise<string[]> {
  return [];
}

export default async function Home() {
  const categories = await getData();

  return <TitleScreen categories={categories} />;
}
