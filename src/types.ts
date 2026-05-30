export type PhotoStyle = 'rustic' | 'modern' | 'top-down';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
}

export interface GeneratedPhoto {
  id: string;
  menuItemName: string;
  url: string;
  style: PhotoStyle;
}

export interface GeneratePhotosRequest {
  menuText: string;
  style: PhotoStyle;
}

export interface GeneratePhotosResponse {
  photos: GeneratedPhoto[];
}
