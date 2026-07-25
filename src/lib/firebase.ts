import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp 
} from "firebase/firestore";

// Read from process.env or fallback to direct applet config credentials
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBtNwMbBhIDubq4oPF-2TbSEpF0LvDDX28",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "gen-lang-client-0307757877.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0307757877",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "gen-lang-client-0307757877.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "976522357782",
  appId: process.env.FIREBASE_APP_ID || "1:976522357782:web:0db30d8eda2db2830bd937"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use the specific firestore database ID assigned to our workspace with force long-polling enabled for robust connection in iframe
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, "ai-studio-ee7f2225-48bb-4063-a9b5-226ac3b245fa");

export interface MenuItem {
  id?: string;
  name: string;
  category: "soda" | "milkSoda";
  priceRegular?: number; // Optional since milk soda doesn't have regular
  priceMedium: number;
  priceLarge: number;
  description: string;
  imageUrl: string;
}

export interface OrderItem {
  name: string;
  size: "Regular" | "Medium" | "Large";
  price: number;
  quantity: number;
}

export interface Order {
  id?: string;
  createdAt?: any;
  orderId: string;
  items: OrderItem[];
  total: number;
  pickupTime: string;
  status: string;
  uid: string | null;
}

export interface AiRecommendation {
  id?: string;
  createdAt?: any;
  craving: string;
  budgetTier: "Regular" | "Medium" | "Large";
  primaryDrink: string;
  backupDrink: string;
}

// Full menu item list to seed
const INITIAL_MENU: Omit<MenuItem, "id">[] = [
  // Sodas (Regular: 60, Medium: 80, Large: 100) - exceptions specified
  {
    name: "Lemon Masala",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Classic fizzy lemonade with an authentic, tangy blend of dry roasted spices and black salt.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Mint Margrita",
    category: "soda",
    priceRegular: 80,
    priceMedium: 100,
    priceLarge: 120,
    description: "Refreshing crushed fresh mint leaves blended with sweet citrus juices and ice-cold soda.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Blue Berry",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Sweet and wild blueberry fusion syrup over ice with standard bubbling club soda.",
    imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Imli Alu Bukhara",
    category: "soda",
    priceRegular: 80,
    priceMedium: 100,
    priceLarge: 120,
    description: "Traditional sweet and sour combination of dark tamarind and dried red plums with bubbly soda.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Strawberry",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Ripe summer strawberries muddled with simple syrup and charged with sparkling water.",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Alu Bukhara",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Delectable fresh red plum nectar syrup with clean, crisp sparkling club soda.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Pine Apple",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Golden pineapple syrup with a perfect balance of tartness and sugary carbonation.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Lychee",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Exotic floral lychee fruit juice layered with sweet soda over clear ice rocks.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Green Apple",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Super crisp and mouth-puckering sour green apple juice blended with heavy fizzy soda.",
    imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Mix Berry",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "An intense trio of raspberries, blackberries, and strawberries with fizzy carbonation.",
    imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Bubble Gum",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Fun, whimsical pink bubblegum flavored soda that tastes like your favorite childhood treat.",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Black Berry",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Bold and earthy blackberries, sweetened and poured over sparkling ice-cold soda.",
    imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Blue Lagon",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Vibrant blue curacao orange extract with a lime splash and clean lemon-lime soda.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Bubble Tea",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Delightful cooling bubble tea extract served over chewable tapioca boba and soda.",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Coctail",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "A signature blend of tropical fruit juices, purees, and sparkling club soda.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Mango Juice",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Pure rich mango pulp sweetened and given a heavy sparkling carbonation hit.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Peach",
    category: "soda",
    priceRegular: 60,
    priceMedium: 80,
    priceLarge: 100,
    description: "Juicy sweet Georgia peach puree layered with heavy fizz sparkling water.",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400"
  },
  // Milk Sodas (Medium: 100, Large: 120)
  {
    name: "Ice Cream Soda",
    category: "milkSoda",
    priceMedium: 100,
    priceLarge: 120,
    description: "Creamy whole milk and sweet syrup, charged with heavy soda and topped with vanilla ice cream.",
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Chocolate Soda",
    category: "milkSoda",
    priceMedium: 100,
    priceLarge: 120,
    description: "Decadent chocolate syrup layered with ice cold milk and hit with bubbly soda.",
    imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400"
  }
];

// Seed function to insert items if menuItems is empty
export async function seedMenuItemsIfNeeded(): Promise<MenuItem[]> {
  try {
    const menuCol = collection(db, "menuItems");
    const snapshot = await getDocs(menuCol);
    if (snapshot.empty) {
      console.log("Seeding menuItems collection...");
      const seeded: MenuItem[] = [];
      for (const item of INITIAL_MENU) {
        const docRef = await addDoc(menuCol, item);
        seeded.push({ id: docRef.id, ...item });
      }
      return seeded;
    } else {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
    }
  } catch (err) {
    console.error("Error seeding menu items: ", err);
    // Return hardcoded fallback in case of Firestore connection or permission issues
    return INITIAL_MENU.map((item, idx) => ({ id: `fallback-${idx}`, ...item }));
  }
}

// Fetch all menu items
export async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const menuCol = collection(db, "menuItems");
    const snapshot = await getDocs(menuCol);
    if (snapshot.empty) {
      return await seedMenuItemsIfNeeded();
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch (err) {
    console.error("Error fetching menu items: ", err);
    return INITIAL_MENU.map((item, idx) => ({ id: `fallback-${idx}`, ...item }));
  }
}

// Write an Order to Firestore
export async function createOrder(order: Omit<Order, "id">): Promise<string> {
  try {
    const ordersCol = collection(db, "orders");
    const docRef = await addDoc(ordersCol, {
      ...order,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (err) {
    console.error("Error creating order in Firestore: ", err);
    throw err;
  }
}

// Fetch orders by UID
export async function fetchUserOrders(uid: string): Promise<Order[]> {
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, where("uid", "==", uid), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Order;
    });
  } catch (err) {
    console.error("Error fetching user orders: ", err);
    return [];
  }
}

// Log AI Recommendation
export async function createAiRecommendation(rec: Omit<AiRecommendation, "id">): Promise<string> {
  try {
    const recsCol = collection(db, "aiRecommendations");
    const docRef = await addDoc(recsCol, {
      ...rec,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (err) {
    console.error("Error logging AI recommendation: ", err);
    // Return a dummy ID so that recommendation flow works even if write fails
    return "local-rec-" + Math.random().toString(36).substring(2, 9);
  }
}

// Fetch Popular Right Now based on live aiRecommendations collection
export interface PopularDrink {
  name: string;
  count: number;
}

export async function fetchPopularDrinks(limitCount = 3): Promise<PopularDrink[]> {
  try {
    const recsCol = collection(db, "aiRecommendations");
    const snapshot = await getDocs(recsCol);
    
    const countMap: Record<string, number> = {};
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const primary = data.primaryDrink;
      if (primary) {
        countMap[primary] = (countMap[primary] || 0) + 1;
      }
    });

    const sorted = Object.entries(countMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    if (sorted.length > 0) {
      return sorted.slice(0, limitCount);
    }
    
    // Fallback popular drinks if no recommendations exist yet
    return [
      { name: "Lemon Masala", count: 12 },
      { name: "Mint Margrita", count: 10 },
      { name: "Ice Cream Soda", count: 8 }
    ];
  } catch (err) {
    console.error("Error calculating popular drinks: ", err);
    return [
      { name: "Lemon Masala", count: 12 },
      { name: "Mint Margrita", count: 10 },
      { name: "Ice Cream Soda", count: 8 }
    ];
  }
}
