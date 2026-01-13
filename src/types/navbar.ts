export interface NavbarData {
  carousel: Carousel[]
  procedures: Record<string, Procedure[]>
  topProcedure: Procedure[]
}

export interface Carousel {
  path: string;
  title: string;
  subtitle: string;
}

export interface Procedure {
  id: number
  image: string
  slug: string
  title: string
  category: string
}
