export interface MediaItem {
  type: string
  image: string
  title: string
  subtitle: string
}

export interface DesignSettingsResponse {
  backgrounds: Backgrounds;
  carousel: Carousel;
  carouselNavbar: CarouselNavbar;
  carouselTool: CarouselTool;
  imageVideo: ImageVideo;
}

export interface Backgrounds {
  background1: MediaItem[];
  background1Setting: Setting;

  background2: MediaItem[];
  background2Setting: Setting;

  background3: MediaItem[];
  background3Setting: Setting;
}

export interface Carousel {
  carousel: MediaItem[];
  carouselSetting: Setting;
}

export interface CarouselNavbar {
  carouselNavbar: MediaItem[];
  carouselNavbarSetting: Setting;
}

export interface CarouselTool {
  carouselTool: MediaItem[];
  carouselToolSetting: Setting;
}

export interface ImageVideo {
  imageVideo: MediaItem[];
  imageVideoSetting: Setting;
}

export interface Setting {
  id: number;
  enabled: boolean;
}
