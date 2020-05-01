type Episode = {
  name: string;
  season: number;
  number: number;
  summary: string;
  image: {
    medium: string;
  };
};

interface Window {
  getAllEpisodes: () => Array<Episode>;
}
