export interface Data {
  id: number;
  slug: string;
  name: string;
  status: string;
  image: string;
  biography: string;
  description: string;
  specialization: string;
  results: {
    id: number;
    path: string;
    order: number;
    description: string;
  }[];
}
