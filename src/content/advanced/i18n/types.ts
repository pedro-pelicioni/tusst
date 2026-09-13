// Shape of a translated Advanced Path track — shared by every locale overlay
// (pt/es/fr curriculum.ts) and by the resolver in ./index.ts.

export interface AdvancedTrackText {
  title: string;
  description: string;
  serves: string;
  syllabus?: string[];
}
