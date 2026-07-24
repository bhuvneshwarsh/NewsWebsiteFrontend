// Add to your existing src/types/index.ts

export interface EditorProfile {
  id:           number;
  fullName:     string;
  title:        string;
  imageUrl:     string | null;
  shortBio:     string;
  fullBio:      string;
  experience:   string | null;
  education:    string | null;
  awards:       string | null;
  email:        string | null;
  phone:        string | null;
  twitterUrl:   string | null;
  facebookUrl:  string | null;
  linkedInUrl:  string | null;
  displayOrder: number;
}

export interface CreateEditorPayload {
  fullName:     string;
  title:        string;
  imageUrl?:    string;
  shortBio:     string;
  fullBio:      string;
  experience?:  string;
  education?:   string;
  awards?:      string;
  email?:       string;
  phone?:       string;
  twitterUrl?:  string;
  facebookUrl?: string;
  linkedInUrl?: string;
  isActive:     boolean;
  displayOrder: number;
}
