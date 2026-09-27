export type ProductCategory = "Resin" | "Crochet";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  price: string;
  customisable: boolean;
  options: string[];
  featured: boolean;
};

export const WHATSAPP_NUMBER = "";
export const INSTAGRAM_URL = "https://www.instagram.com/";
export const CONTACT_EMAIL = "";
export const BRAND_NAME = "MUSE / MAKE";

const resinImage = "/manus-storage/resin-collection_5b8bc6eb.jpg";
const crochetImage = "/manus-storage/crochet-collection_0361937f.jpg";
const detailImage = "/manus-storage/detail-still-life_a95c93c7.jpg";

// Sample catalogue data is intentionally easy to replace with the client's final products.
export const products: Product[] = [
  {
    id: "pressed-petal-tray",
    name: "Pressed petal tray",
    category: "Resin",
    description: "A small clear tray with room for petals, pigment and your own little story.",
    image: resinImage,
    price: "Custom quote",
    customisable: true,
    options: ["Colour palette", "Botanical inclusions", "Name or date"],
    featured: true,
  },
  {
    id: "sunset-coaster-set",
    name: "Sunset coaster set",
    category: "Resin",
    description: "Warm marbled coasters made to bring a soft glow to your everyday table.",
    image: resinImage,
    price: "Custom quote",
    customisable: true,
    options: ["Set size", "Colour palette", "Gold or silver detail"],
    featured: true,
  },
  {
    id: "tiny-keepsake",
    name: "Tiny keepsake",
    category: "Resin",
    description: "A pocket-sized piece for initials, a date, a flower or a tiny reminder.",
    image: detailImage,
    price: "Custom quote",
    customisable: true,
    options: ["Shape", "Text or initials", "Inclusions"],
    featured: true,
  },
  {
    id: "crochet-bloom",
    name: "Crochet bloom",
    category: "Crochet",
    description: "A soft little bloom for gifting, styling a shelf or keeping close.",
    image: crochetImage,
    price: "Custom quote",
    customisable: true,
    options: ["Yarn colour", "Size", "Stem or clip"],
    featured: true,
  },
  {
    id: "everyday-pouch",
    name: "Everyday pouch",
    category: "Crochet",
    description: "A simple textured pouch with a gentle rhythm of handmade stitches.",
    image: crochetImage,
    price: "Custom quote",
    customisable: true,
    options: ["Yarn colour", "Size", "Button detail"],
    featured: true,
  },
  {
    id: "soft-bow",
    name: "Soft bow",
    category: "Crochet",
    description: "A small, cheerful accent made slowly and finished with a tidy little loop.",
    image: detailImage,
    price: "Custom quote",
    customisable: true,
    options: ["Colour", "Clip or tie", "Pair or single"],
    featured: true,
  },
  {
    id: "memory-tile",
    name: "Memory tile",
    category: "Resin",
    description: "A meaningful tile for a word, date, palette or tiny memento.",
    image: resinImage,
    price: "Custom quote",
    customisable: true,
    options: ["Text", "Palette", "Hardware"],
    featured: false,
  },
  {
    id: "mini-flower-garland",
    name: "Mini flower garland",
    category: "Crochet",
    description: "A playful string of soft flowers for a nook, gift wrap or tiny celebration.",
    image: crochetImage,
    price: "Custom quote",
    customisable: true,
    options: ["Length", "Colour story", "Flower mix"],
    featured: false,
  },
];

export function buildWhatsAppUrl(message: string) {
  if (!WHATSAPP_NUMBER) return "";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
