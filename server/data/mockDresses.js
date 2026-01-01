// Mock data for demonstration purposes when MongoDB is not available
const mockDresses = [
  {
    _id: '1',
    name: 'Elegant Evening Gown',
    description: 'Stunning evening gown with delicate beadwork and flowing silk fabric. Perfect for galas and formal dinners. This exquisite piece features intricate hand-sewn crystal beading that catches the light beautifully, creating a mesmerizing effect. The flowing silk fabric drapes elegantly, creating a silhouette that flatters every body type.',
    price: 299,
    category: 'evening',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    color: ['Navy Blue', 'Burgundy', 'Emerald Green'],
    images: [
      { url: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1c8?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown - Front View', isMain: true },
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown - Side View', isMain: false },
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown - Back View', isMain: false },
      { url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop', alt: 'Elegant Evening Gown - Detail View', isMain: false }
    ],
    material: '100% Silk with crystal beadwork',
    careInstructions: 'Dry clean only. Handle with care. Store on padded hanger to maintain shape.',
    availability: 'in-stock',
    stockQuantity: 5,
    featured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    name: 'Romantic Wedding Dress',
    description: 'Beautiful lace wedding dress with elegant train and intricate detailing. This stunning wedding gown features delicate French lace with intricate floral patterns that create a romantic and timeless look. The elegant train flows beautifully behind you as you walk down the aisle, creating a dramatic and unforgettable entrance.',
    price: 599,
    category: 'wedding',
    size: ['XS', 'S', 'M', 'L'],
    color: ['Ivory', 'White', 'Champagne'],
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop', alt: 'Romantic Wedding Dress', isMain: true },
      { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', alt: 'Wedding Dress Detail', isMain: false },
      { url: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=600&h=800&fit=crop', alt: 'Wedding Dress Train', isMain: false }
    ],
    material: 'Lace and Tulle with pearl accents',
    careInstructions: 'Professional cleaning recommended. Store in breathable garment bag.',
    availability: 'in-stock',
    stockQuantity: 3,
    featured: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: '3',
    name: 'Chic Cocktail Dress',
    description: 'Perfect for cocktail parties and special occasions with modern design. This sophisticated cocktail dress combines contemporary style with classic elegance. The modern cut flatters your figure while the subtle sequin details catch the light beautifully, making you the center of attention at any event.',
    price: 199,
    category: 'cocktail',
    size: ['S', 'M', 'L', 'XL'],
    color: ['Black', 'Gold', 'Silver', 'Red'],
    images: [
      { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop', alt: 'Chic Cocktail Dress', isMain: true }
    ],
    material: 'Polyester Blend with sequin details',
    careInstructions: 'Machine wash cold, hang to dry. Do not bleach.',
    availability: 'limited',
    stockQuantity: 2,
    featured: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '4',
    name: 'Summer Floral Dress',
    description: 'Light and breezy summer dress with beautiful floral patterns. This charming summer dress features vibrant floral prints that capture the essence of summer. The lightweight fabric keeps you cool and comfortable even on the warmest days, while the flattering cut ensures you look effortlessly stylish.',
    price: 149,
    category: 'casual',
    size: ['XS', 'S', 'M', 'L'],
    color: ['Pink', 'Blue', 'Yellow'],
    images: [
      { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop', alt: 'Summer Floral Dress', isMain: true }
    ],
    material: 'Cotton Blend',
    careInstructions: 'Machine wash cold, tumble dry low. Iron on low heat if needed.',
    availability: 'in-stock',
    stockQuantity: 8,
    featured: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    _id: '5',
    name: 'Business Professional Dress',
    description: 'Elegant business dress perfect for meetings and professional settings. This sophisticated business dress combines professional polish with feminine style. The tailored cut creates a sharp, confident silhouette that commands respect in any boardroom while maintaining comfort throughout your busy workday.',
    price: 179,
    category: 'business',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    color: ['Navy', 'Black', 'Gray'],
    images: [
      { url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop', alt: 'Business Professional Dress', isMain: true }
    ],
    material: 'Wool Blend',
    careInstructions: 'Dry clean recommended. Hang on proper hanger to maintain shape.',
    availability: 'in-stock',
    stockQuantity: 6,
    featured: false,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    _id: '6',
    name: 'Vintage Inspired Dress',
    description: 'Beautiful vintage-inspired design with modern comfort and style. This stunning vintage-inspired dress captures the elegance of a bygone era while incorporating modern comfort and wearability. The rich colors and classic patterns create a timeless look that never goes out of style.',
    price: 229,
    category: 'vintage',
    size: ['S', 'M', 'L'],
    color: ['Burgundy', 'Forest Green', 'Navy'],
    images: [
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop', alt: 'Vintage Inspired Dress', isMain: true }
    ],
    material: 'Rayon Blend',
    careInstructions: 'Hand wash cold, lay flat to dry. Do not wring or twist.',
    availability: 'limited',
    stockQuantity: 4,
    featured: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  }
];

module.exports = mockDresses;