// Add to src/types/index.ts

export interface AdPublic {
  id:         number;
  adImageUrl: string;
  clickUrl:   string | null;
  placement:  'banner_top' | 'sidebar' | 'inline' | 'banner_bottom';
  width:      number | null;
  height:     number | null;
}

export interface AdAdmin extends AdPublic {
  title:          string;
  advertiserName: string | null;
  startDate:      string | null;
  endDate:        string | null;
  isActive:       boolean;
  displayOrder:   number;
  impressions:    number;
  clicks:         number;
  notes:          string | null;
  createdAt:      string;
}

export interface CreateAdPayload {
  title:          string;
  adImageUrl:     string;
  clickUrl?:      string;
  advertiserName?: string;
  placement:      string;
  width?:         number;
  height?:        number;
  startDate?:     string;
  endDate?:       string;
  isActive:       boolean;
  displayOrder:   number;
  notes?:         string;
}
