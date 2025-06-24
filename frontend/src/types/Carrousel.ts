export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  target?: string;
}

export interface CarouselProps {
  slides?: CarouselSlide[];
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showNavigation?: boolean;
}
