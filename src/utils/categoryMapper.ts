// Category mapping based on keywords
const CATEGORY_KEYWORDS = {
  'Comida': [
    'supermercado', 'mercado', 'restaurante', 'comida', 'cena', 'almuerzo', 
    'desayuno', 'pizza', 'hamburgues', 'café', 'bar', 'cocina', 'grocery',
    'food', 'restaurant', 'cafe', 'bar', 'kitchen', 'eating'
  ],
  'Transporte': [
    'gasolina', 'combustible', 'uber', 'taxi', 'metro', 'autobús', 'bus',
    'tren', 'avión', 'parking', 'estacionamiento', 'peaje', 'transport',
    'gas', 'fuel', 'parking', 'toll', 'train', 'plane'
  ],
  'Entretenimiento': [
    'cine', 'teatro', 'concierto', 'juego', 'streaming', 'netflix', 'spotify',
    'entretenimiento', 'diversión', 'ocio', 'movie', 'concert', 'game',
    'entertainment', 'fun', 'leisure'
  ],
  'Salud': [
    'farmacia', 'médico', 'doctor', 'hospital', 'dentista', 'medicina',
    'salud', 'seguro', 'pharmacy', 'medical', 'health', 'doctor', 'dentist',
    'medicine', 'insurance'
  ],
  'Servicios': [
    'luz', 'agua', 'gas', 'internet', 'teléfono', 'electricidad', 'servicio',
    'utilidad', 'electricity', 'water', 'utility', 'service', 'phone',
    'internet'
  ],
  'Compras': [
    'tienda', 'ropa', 'zapatos', 'amazon', 'shopping', 'compra', 'store',
    'clothes', 'shoes', 'purchase', 'buy'
  ]
};

export function categorizeExpense(description: string): string {
  const normalizedDesc = description.toLowerCase().trim();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => normalizedDesc.includes(keyword))) {
      return category;
    }
  }
  
  return 'Otros';
}

export function addCategoryKeyword(category: string, keyword: string): void {
  if (!CATEGORY_KEYWORDS[category]) {
    CATEGORY_KEYWORDS[category] = [];
  }
  
  if (!CATEGORY_KEYWORDS[category].includes(keyword.toLowerCase())) {
    CATEGORY_KEYWORDS[category].push(keyword.toLowerCase());
  }
}

export function getCategories(): string[] {
  return Object.keys(CATEGORY_KEYWORDS);
}

export function getCategoryKeywords(category: string): string[] {
  return CATEGORY_KEYWORDS[category] || [];
}