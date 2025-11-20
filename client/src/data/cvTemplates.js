// client/src/data/cvTemplates.js

// IMPORTANT : on garde des id du type "template-1", "template-2", etc.
// → Ça reste compatible avec tout ce qui attend déjà ce format côté backend.

export const cvTemplates = [
  {
    id: 'template-1',
    name: 'Classique',
    description: 'CV simple, sobre et professionnel. Convient à la plupart des candidatures.',
    preview: '/previews/cv-classique.png',
    category: 'Polyvalent',
  },
  {
    id: 'template-2',
    name: 'Moderne',
    description: 'Design plus dynamique avec une mise en page structurée.',
    preview: '/previews/cv-moderne.png',
    category: 'Profils récents / junior',
  },
  {
    id: 'template-3',
    name: 'Élégant',
    description: 'Mise en page raffinée pour les candidatures importantes.',
    preview: '/previews/cv-elegant.png',
    category: 'Premium',
  },
  {
    id: 'template-4',
    name: 'Compact',
    description: 'CV sur une page, condensé, idéal pour les débutants.',
    preview: '/previews/cv-compact.png',
    category: '1 page',
  },
  {
    id: 'template-5',
    name: 'Impact',
    description: 'Titre bien visible et sections très lisibles.',
    preview: '/previews/cv-impact.png',
    category: 'Commercial / Vente',
  },
  {
    id: 'template-6',
    name: 'Tech',
    description: 'Pensé pour les profils IT / ingénieurs, très clair.',
    preview: '/previews/cv-tech.png',
    category: 'Tech / Ingénierie',
  },
];
