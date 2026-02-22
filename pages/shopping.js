import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Shopping() {
  const [shopping, setShopping] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('to-buy');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadMockShopping();
  }, [filter, category, sortBy]);

  const loadMockShopping = () => {
    // Mock Shopping data
    // BUSY Shopping/Watch List - 50+ realistic items with real URLs
    const mockItems = [
  // TECH PRODUCTS
  {
    id: 1,
    title: "Sony WH-1000XM5 Wireless Headphones",
    url: "https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b",
    description: "Industry-leading noise cancellation, 30-hour battery",
    category: "Tech",
    status: "to-buy",
    price: "$399.99",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&q=80",
    tags: ["Audio", "Wireless"],
    created_at: "2026-02-22T10:30:00Z"
  },
  {
    id: 2,
    title: "iPad Pro 13-inch M4",
    url: "https://www.apple.com/shop/buy-ipad/ipad-pro",
    description: "M4 chip, ProMotion display, 120Hz refresh",
    category: "Tech",
    status: "to-buy",
    price: "$1,299",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop&q=80",
    tags: ["Apple", "Tablet"],
    created_at: "2026-02-20T09:15:00Z"
  },
  {
    id: 3,
    title: "DJI Mini 4 Pro Drone",
    url: "https://store.dji.com/product/dji-mini-4-pro",
    description: "4K HDR video, 45min flight time",
    category: "Tech",
    status: "to-buy",
    price: "$759",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop&q=80",
    tags: ["Drone", "Photography"],
    created_at: "2026-02-14T15:20:00Z"
  },
  {
    id: 4,
    title: "Apple Vision Pro",
    url: "https://www.apple.com/apple-vision-pro/",
    description: "Spatial computing headset",
    category: "Tech",
    status: "to-buy",
    price: "$3,499",
    image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&h=600&fit=crop&q=80",
    tags: ["AR/VR", "Apple"],
    created_at: "2026-02-11T14:30:00Z"
  },
  {
    id: 5,
    title: "MacBook Pro 16-inch M3 Max",
    url: "https://www.apple.com/shop/buy-mac/macbook-pro",
    description: "M3 Max chip, 128GB RAM, 8TB SSD",
    category: "Tech",
    status: "to-buy",
    price: "$7,199",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&q=80",
    tags: ["Apple", "Laptop", "Pro"],
    created_at: "2026-02-10T11:20:00Z"
  },
  {
    id: 6,
    title: "Samsung 65\" OLED 4K TV",
    url: "https://www.samsung.com/us/televisions-home-theater/tvs/oled-tvs/",
    description: "S95C OLED, Neural Quantum Processor",
    category: "Tech",
    status: "to-buy",
    price: "$2,597",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop&q=80",
    tags: ["TV", "OLED", "4K"],
    created_at: "2026-02-09T14:00:00Z"
  },
  {
    id: 7,
    title: "iPhone 16 Pro Max",
    url: "https://www.apple.com/shop/buy-iphone/iphone-16-pro",
    description: "A18 Pro chip, titanium, 1TB",
    category: "Tech",
    status: "to-buy",
    price: "$1,599",
    image: "https://images.unsplash.com/photo-1592286927505-4f432eb5f5a4?w=600&h=600&fit=crop&q=80",
    tags: ["Apple", "Phone"],
    created_at: "2026-02-08T10:45:00Z"
  },
  {
    id: 8,
    title: "Shokz OpenRun Pro",
    url: "https://shokz.com/products/openrun-pro",
    description: "Bone conduction, 10 hours battery",
    category: "Tech",
    status: "archived",
    price: "$179.95",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80",
    tags: ["Audio", "Running"],
    created_at: "2026-02-08T09:00:00Z"
  },
  {
    id: 9,
    title: "PlayStation 5 Pro",
    url: "https://www.playstation.com/en-us/ps5/",
    description: "8K gaming, ray tracing, 2TB SSD",
    category: "Tech",
    status: "to-buy",
    price: "$699",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&q=80",
    tags: ["Gaming", "Console"],
    created_at: "2026-02-07T16:30:00Z"
  },
  {
    id: 10,
    title: "Canon EOS R5 Mark II",
    url: "https://www.usa.canon.com/shop/p/eos-r5-mark-ii",
    description: "45MP full-frame mirrorless",
    category: "Tech",
    status: "to-buy",
    price: "$4,299",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&q=80",
    tags: ["Camera", "Photography"],
    created_at: "2026-02-06T12:00:00Z"
  },
  {
    id: 11,
    title: "Sonos Arc Ultra Soundbar",
    url: "https://www.sonos.com/shop/arc",
    description: "Dolby Atmos, spatial audio",
    category: "Tech",
    status: "to-buy",
    price: "$999",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80",
    tags: ["Audio", "Home Theater"],
    created_at: "2026-02-05T10:20:00Z"
  },
  {
    id: 12,
    title: "Logitech MX Master 4S",
    url: "https://www.logitech.com/en-us/products/mice/mx-master-4s.html",
    description: "Wireless mouse, 8K sensor",
    category: "Tech",
    status: "to-buy",
    price: "$99.99",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop&q=80",
    tags: ["Accessories", "Productivity"],
    created_at: "2026-02-04T14:15:00Z"
  },

  // TV SHOWS
  {
    id: 13,
    title: "The Last of Us Season 2",
    url: "https://www.hbo.com/the-last-of-us",
    description: "HBO's post-apocalyptic masterpiece",
    category: "TV Shows",
    status: "watching",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=900&fit=crop&q=80",
    tags: ["Drama", "Sci-Fi", "HBO"],
    rating: "9.2/10",
    created_at: "2026-02-21T14:20:00Z"
  },
  {
    id: 14,
    title: "Stranger Things Final Season",
    url: "https://www.netflix.com/title/80057281",
    description: "Hawkins crew's final battle",
    category: "TV Shows",
    status: "watching",
    image: "https://images.unsplash.com/photo-1574267432644-f610dd23e520?w=600&h=900&fit=crop&q=80",
    tags: ["Netflix", "Horror"],
    rating: "8.7/10",
    created_at: "2026-02-15T11:00:00Z"
  },
  {
    id: 15,
    title: "The Bear Season 3",
    url: "https://www.hulu.com/series/the-bear",
    description: "Emmy-winning culinary drama",
    category: "TV Shows",
    status: "watching",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=900&fit=crop&q=80",
    tags: ["Drama", "Hulu"],
    rating: "9.1/10",
    created_at: "2026-02-12T11:20:00Z"
  },
  {
    id: 16,
    title: "Severance Season 2",
    url: "https://tv.apple.com/show/severance",
    description: "Mind-bending workplace thriller",
    category: "TV Shows",
    status: "watching",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=900&fit=crop&q=80",
    tags: ["Sci-Fi", "Apple TV+"],
    rating: "8.9/10",
    created_at: "2026-02-10T09:30:00Z"
  },
  {
    id: 17,
    title: "House of the Dragon Season 3",
    url: "https://www.hbo.com/house-of-the-dragon",
    description: "Targaryen civil war continues",
    category: "TV Shows",
    status: "watching",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=900&fit=crop&q=80",
    tags: ["Fantasy", "HBO"],
    rating: "8.5/10",
    created_at: "2026-02-08T15:00:00Z"
  },
  {
    id: 18,
    title: "The Mandalorian Season 4",
    url: "https://www.disneyplus.com/series/the-mandalorian",
    description: "Din Djarin's latest adventure",
    category: "TV Shows",
    status: "watching",
    image: "https://images.unsplash.com/photo-1579566346927-c68383817a25?w=600&h=900&fit=crop&q=80",
    tags: ["Star Wars", "Disney+"],
    rating: "8.6/10",
    created_at: "2026-02-07T12:45:00Z"
  },
  {
    id: 19,
    title: "Wednesday Season 2",
    url: "https://www.netflix.com/title/81231974",
    description: "Addams Family spinoff returns",
    category: "TV Shows",
    status: "to-buy",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&h=900&fit=crop&q=80",
    tags: ["Comedy", "Netflix"],
    rating: "8.1/10",
    created_at: "2026-02-06T10:00:00Z"
  },
  {
    id: 20,
    title: "Fallout Season 2",
    url: "https://www.amazon.com/Fallout-Season-1/dp/B0CW91BKR5",
    description: "Post-nuclear wasteland saga",
    category: "TV Shows",
    status: "watching",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=900&fit=crop&q=80",
    tags: ["Sci-Fi", "Prime Video"],
    rating: "8.4/10",
    created_at: "2026-02-05T14:30:00Z"
  },

  // MOVIES
  {
    id: 21,
    title: "Dune: Part Three",
    url: "https://www.warnerbros.com/movies/dune-part-three",
    description: "Epic trilogy conclusion",
    category: "Movies",
    status: "watching",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop&q=80",
    tags: ["Sci-Fi", "Epic"],
    rating: "Coming 2027",
    created_at: "2026-02-19T16:45:00Z"
  },
  {
    id: 22,
    title: "Oppenheimer 4K Blu-ray",
    url: "https://www.universalpictures.com/movies/oppenheimer",
    description: "Nolan's masterpiece on 4K",
    category: "Movies",
    status: "to-buy",
    price: "$34.99",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=900&fit=crop&q=80",
    tags: ["Drama", "IMAX"],
    created_at: "2026-02-10T10:15:00Z"
  },
  {
    id: 23,
    title: "Deadpool 3",
    url: "https://www.marvel.com/movies/deadpool-3",
    description: "MCU meets Deadpool & Wolverine",
    category: "Movies",
    status: "watching",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0b23?w=600&h=900&fit=crop&q=80",
    tags: ["Action", "Marvel"],
    rating: "Coming 2024",
    created_at: "2026-02-09T11:00:00Z"
  },
  {
    id: 24,
    title: "Mission: Impossible 8",
    url: "https://www.paramountpictures.com/movies/mission-impossible-8",
    description: "Tom Cruise's final mission",
    category: "Movies",
    status: "watching",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=900&fit=crop&q=80",
    tags: ["Action", "Thriller"],
    rating: "Coming 2025",
    created_at: "2026-02-08T13:30:00Z"
  },
  {
    id: 25,
    title: "The Batman Part II",
    url: "https://www.warnerbros.com/movies/batman-part-ii",
    description: "Matt Reeves continues dark saga",
    category: "Movies",
    status: "watching",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&h=900&fit=crop&q=80",
    tags: ["DC", "Action"],
    rating: "Coming 2026",
    created_at: "2026-02-07T10:20:00Z"
  },
  {
    id: 26,
    title: "Interstellar 4K",
    url: "https://www.paramountmovies.com/movies/interstellar",
    description: "Nolan's space epic remastered",
    category: "Movies",
    status: "to-buy",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=900&fit=crop&q=80",
    tags: ["Sci-Fi", "4K"],
    created_at: "2026-02-06T12:45:00Z"
  },

  // FURNITURE
  {
    id: 27,
    title: "Herman Miller Aeron Chair",
    url: "https://www.hermanmiller.com/products/seating/office-chairs/aeron-chairs/",
    description: "Ergonomic mesh office chair",
    category: "Furniture",
    status: "to-buy",
    price: "$1,595",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=600&fit=crop&q=80",
    tags: ["Office", "Ergonomic"],
    created_at: "2026-02-18T12:30:00Z"
  },
  {
    id: 28,
    title: "Uplift V2 Standing Desk",
    url: "https://www.upliftdesk.com/uplift-v2-standing-desk-v2-or-v2-commercial/",
    description: "Electric height adjustable, 80x30",
    category: "Furniture",
    status: "to-buy",
    price: "$799",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=600&fit=crop&q=80",
    tags: ["Office", "Standing Desk"],
    created_at: "2026-02-17T11:00:00Z"
  },
  {
    id: 29,
    title: "Secretlab Titan Evo 2024",
    url: "https://secretlab.co/products/titan-evo-2024-series",
    description: "Premium gaming chair",
    category: "Furniture",
    status: "to-buy",
    price: "$574",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&h=600&fit=crop&q=80",
    tags: ["Gaming", "Chair"],
    created_at: "2026-02-16T14:20:00Z"
  },
  {
    id: 30,
    title: "IKEA ALEX Drawer Unit",
    url: "https://www.ikea.com/us/en/p/alex-drawer-unit-white-10192824/",
    description: "White 9-drawer storage",
    category: "Furniture",
    status: "to-buy",
    price: "$139",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop&q=80",
    tags: ["Storage", "Office"],
    created_at: "2026-02-15T09:45:00Z"
  },

  // COURSES/EDUCATION
  {
    id: 31,
    title: "MasterClass All-Access Pass",
    url: "https://www.masterclass.com/",
    description: "200+ world-class instructors",
    category: "Courses",
    status: "to-buy",
    price: "$180/year",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&h=600&fit=crop&q=80",
    tags: ["Learning", "Education"],
    created_at: "2026-02-13T09:45:00Z"
  },
  {
    id: 32,
    title: "Udemy - Complete Python Bootcamp",
    url: "https://www.udemy.com/course/complete-python-bootcamp/",
    description: "Learn Python programming",
    category: "Courses",
    status: "to-buy",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=600&fit=crop&q=80",
    tags: ["Programming", "Python"],
    created_at: "2026-02-12T15:30:00Z"
  },
  {
    id: 33,
    title: "Coursera - Machine Learning Specialization",
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
    description: "Andrew Ng's ML course",
    category: "Courses",
    status: "to-buy",
    price: "$49/month",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=600&fit=crop&q=80",
    tags: ["AI", "Machine Learning"],
    created_at: "2026-02-11T10:00:00Z"
  },
  {
    id: 34,
    title: "LinkedIn Learning Premium",
    url: "https://www.linkedin.com/learning/",
    description: "Business and tech skills",
    category: "Courses",
    status: "archived",
    price: "$39.99/month",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=600&fit=crop&q=80",
    tags: ["Business", "Professional"],
    created_at: "2026-02-09T12:15:00Z"
  },

  // BOOKS
  {
    id: 35,
    title: "Atomic Habits - James Clear",
    url: "https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299",
    description: "Build better habits",
    category: "Books",
    status: "to-buy",
    price: "$16.99",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=900&fit=crop&q=80",
    tags: ["Self-Help", "Productivity"],
    created_at: "2026-02-08T11:30:00Z"
  },
  {
    id: 36,
    title: "The Subtle Art of Not Giving a F*ck",
    url: "https://www.amazon.com/Subtle-Art-Not-Giving-Counterintuitive/dp/0062457713",
    description: "Mark Manson's philosophy",
    category: "Books",
    status: "to-buy",
    price: "$14.99",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=900&fit=crop&q=80",
    tags: ["Self-Help", "Philosophy"],
    created_at: "2026-02-07T09:00:00Z"
  },
  {
    id: 37,
    title: "Can't Hurt Me - David Goggins",
    url: "https://www.amazon.com/Cant-Hurt-Me-Master-Your/dp/1544512287",
    description: "Master your mind",
    category: "Books",
    status: "archived",
    price: "$17.99",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=900&fit=crop&q=80",
    tags: ["Motivation", "Biography"],
    created_at: "2026-02-06T14:45:00Z"
  },
  {
    id: 38,
    title: "$100M Offers - Alex Hormozi",
    url: "https://www.acquisition.com/offers",
    description: "How to make irresistible offers",
    category: "Books",
    status: "to-buy",
    price: "$19.99",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=900&fit=crop&q=80",
    tags: ["Business", "Marketing"],
    created_at: "2026-02-05T10:30:00Z"
  },

  // SUBSCRIPTIONS/SERVICES
  {
    id: 39,
    title: "Adobe Creative Cloud",
    url: "https://www.adobe.com/creativecloud.html",
    description: "Full suite - Photoshop, Premiere, etc",
    category: "Software",
    status: "to-buy",
    price: "$59.99/month",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=600&fit=crop&q=80",
    tags: ["Design", "Video", "Creative"],
    created_at: "2026-02-04T11:20:00Z"
  },
  {
    id: 40,
    title: "Notion Pro Plan",
    url: "https://www.notion.so/product",
    description: "Unlimited team members",
    category: "Software",
    status: "to-buy",
    price: "$8/month",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=600&fit=crop&q=80",
    tags: ["Productivity", "Organization"],
    created_at: "2026-02-03T15:00:00Z"
  },
  {
    id: 41,
    title: "ChatGPT Plus",
    url: "https://openai.com/chatgpt/pricing",
    description: "GPT-4, faster responses",
    category: "Software",
    status: "archived",
    price: "$20/month",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=600&fit=crop&q=80",
    tags: ["AI", "Productivity"],
    created_at: "2026-02-02T09:30:00Z"
  },
  {
    id: 42,
    title: "Spotify Premium Family",
    url: "https://www.spotify.com/premium/",
    description: "6 accounts, ad-free",
    category: "Software",
    status: "watching",
    price: "$16.99/month",
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=600&fit=crop&q=80",
    tags: ["Music", "Streaming"],
    created_at: "2026-02-01T12:00:00Z"
  },

  // MISC PRODUCTS
  {
    id: 43,
    title: "Ember Temperature Control Mug",
    url: "https://ember.com/products/ember-mug-2",
    description: "Keeps coffee at perfect temp",
    category: "Gadgets",
    status: "to-buy",
    price: "$129.95",
    image: "https://images.unsplash.com/photo-1514828995144-b4dde7327163?w=600&h=600&fit=crop&q=80",
    tags: ["Coffee", "Smart Home"],
    created_at: "2026-01-31T10:45:00Z"
  },
  {
    id: 44,
    title: "Yeti Rambler 30oz Tumbler",
    url: "https://www.yeti.com/drinkware/tumblers/rambler-30-oz-tumbler.html",
    description: "Insulated stainless steel",
    category: "Gadgets",
    status: "to-buy",
    price: "$38",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&q=80",
    tags: ["Outdoors", "Drinkware"],
    created_at: "2026-01-30T14:20:00Z"
  },
  {
    id: 45,
    title: "Anker PowerCore 20K",
    url: "https://www.anker.com/products/a1271",
    description: "20,000mAh portable charger",
    category: "Gadgets",
    status: "to-buy",
    price: "$59.99",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop&q=80",
    tags: ["Battery", "Travel"],
    created_at: "2026-01-29T11:00:00Z"
  },
  {
    id: 46,
    title: "Peak Design Everyday Backpack",
    url: "https://www.peakdesign.com/products/everyday-backpack",
    description: "30L camera & laptop bag",
    category: "Accessories",
    status: "to-buy",
    price: "$289.95",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80",
    tags: ["Photography", "Travel"],
    created_at: "2026-01-28T09:30:00Z"
  },
  {
    id: 47,
    title: "Elgato Stream Deck Plus",
    url: "https://www.elgato.com/stream-deck-plus",
    description: "15 keys + 4 dials for streaming",
    category: "Streaming",
    status: "to-buy",
    price: "$199.99",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=600&fit=crop&q=80",
    tags: ["Streaming", "Productivity"],
    created_at: "2026-01-27T13:15:00Z"
  },
  {
    id: 48,
    title: "Blue Yeti X Microphone",
    url: "https://www.bluemic.com/en-us/products/yeti-x/",
    description: "Professional USB mic",
    category: "Streaming",
    status: "to-buy",
    price: "$169.99",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&h=600&fit=crop&q=80",
    tags: ["Audio", "Streaming"],
    created_at: "2026-01-26T10:00:00Z"
  },
  {
    id: 49,
    title: "Logitech C920 Webcam",
    url: "https://www.logitech.com/en-us/products/webcams/c920-pro-hd-webcam.960-000764.html",
    description: "1080p HD video calling",
    category: "Streaming",
    status: "archived",
    price: "$79.99",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=600&fit=crop&q=80",
    tags: ["Video", "Webcam"],
    created_at: "2026-01-25T14:45:00Z"
  },
  {
    id: 50,
    title: "Keychron Q1 Pro Mechanical Keyboard",
    url: "https://www.keychron.com/products/keychron-q1-pro-qmk-via-wireless-custom-mechanical-keyboard",
    description: "Wireless, hot-swappable, QMK/VIA",
    category: "Accessories",
    status: "to-buy",
    price: "$209",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&q=80",
    tags: ["Keyboard", "Mechanical"],
    created_at: "2026-01-24T11:30:00Z"
  }
];

    // Filter by status
    let filtered = mockItems.filter(b => b.status === filter);

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(b => b.category === category);
    }

    // Sort
    if (sortBy === 'date_desc') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'date_asc') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Calculate stats
    const statsCalc = {
      'to-buy': mockItems.filter(b => b.status === 'to-buy').length,
      watching: mockItems.filter(b => b.status === 'watching').length,
      archived: mockItems.filter(b => b.status === 'archived').length,
    };

    // Calculate categories
    const categoryMap = {};
    mockItems.forEach(b => {
      if (!categoryMap[b.category]) {
        categoryMap[b.category] = 0;
      }
      categoryMap[b.category]++;
    });

    const categoriesCalc = Object.keys(categoryMap).map(name => ({
      name,
      count: categoryMap[name]
    }));

    setShopping(filtered);
    setStats(statsCalc);
    setCategories(categoriesCalc);
    setLoading(false);
  };

  const filteredShopping = shopping.filter(item => 
    searchTerm === '' || 
    (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
        <NavigationSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Loading Shopping...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
      <NavigationSidebar />
      
      <main style={{ flex: 1, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0D1423', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Hamburger Menu - Top Right */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              position: 'fixed',
              top: '16px',
              right: '16px',
              zIndex: 1001,
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Publications Menu Dropdown */}
          {mobileMenuOpen && (
            <>
              <div
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 999
                }}
              />
              <div style={{
                position: 'fixed',
                top: '72px',
                right: '16px',
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '8px',
                zIndex: 1000,
                minWidth: '200px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ padding: '8px 12px', color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                  Boards
                </div>
                <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🎬</span>
                  <span style={{ fontSize: '14px' }}>Video Board</span>
                </a>
                <a href="/articles" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📰</span>
                  <span style={{ fontSize: '14px' }}>Article Board</span>
                </a>
                <a href="/ideas" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>💡</span>
                  <span style={{ fontSize: '14px' }}>Idea Board</span>
                </a>
                <a href="/bookmarks" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📑</span>
                  <span style={{ fontSize: '14px' }}>Bookmarks</span>
                </a>
                <a href="/shopping" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)' }}>
                  <span style={{ fontSize: '20px' }}>🛒</span>
                  <span style={{ fontSize: '14px' }}>Shopping/Watch</span>
                </a>
                <a href="/projects" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📂</span>
                  <span style={{ fontSize: '14px' }}>Projects</span>
                </a>
                <div style={{ height: '1px', background: '#374151', margin: '8px 0' }} />
                <a href="https://dashboard-gilt-one-zc4y5uu95v.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🎛️</span>
                  <span style={{ fontSize: '14px' }}>Command Center</span>
                </a>
                <a href="https://kanban-rho-ivory.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>👥</span>
                  <span style={{ fontSize: '14px' }}>Team Board</span>
                </a>
                <a href="/openclaw" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  <span style={{ fontSize: '14px' }}>OpenClaw Board</span>
                </a>
              </div>
            </>
          )}
          
          {/* Header */}
          <div style={{ marginBottom: '24px', animation: 'fadeIn 0.6s ease-out' }}>
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              background: 'linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa, #22d3ee)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '4px',
              animation: 'gradientShift 3s ease infinite'
            }}>
              📑 Shopping
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Track things to buy or watch</p>
          </div>
          
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @media (max-width: 768px) {
              main {
                padding: 16px !important;
                padding-top: 64px !important;
              }
              h1 {
                font-size: 24px !important;
              }
            }
          `}</style>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <StatCard 
              icon="📖" 
              count={stats['to-buy'] || 0} 
              label="To Buy"
              active={filter === 'to-buy'}
              onClick={() => setFilter('to-buy')}
              delay={0}
            />
            <StatCard 
              icon="⭐" 
              count={stats.Watching || 0} 
              label="Watching"
              active={filter === 'watching'}
              onClick={() => setFilter('watching')}
              delay={0.1}
            />
            <StatCard 
              icon="📦" 
              count={stats.archived || 0} 
              label="Archived"
              active={filter === 'archived'}
              onClick={() => setFilter('archived')}
              delay={0.2}
            />
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCategory('all')}
                style={{
                  padding: '8px 16px',
                  background: category === 'all' ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  style={{
                    padding: '8px 16px',
                    background: category === cat.name ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          )}

          {/* Search and Sort */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search Shopping..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 16px',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 16px',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Shopping Section */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            animation: 'scaleIn 0.4s ease-out 0.4s both'
          }}>
            {filteredShopping.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
                {searchTerm ? `No items matching "${searchTerm}"` : `No ${filter} items`}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filteredShopping.map((item) => (
                  <ShoppingCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px', textAlign: 'right', color: '#9ca3af', fontSize: '14px' }}>
            {filteredShopping.length} {filteredShopping.length === 1 ? 'item' : 'items'}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, count, label, active, onClick, delay = 0 }) {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '16px',
        background: active ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: `1px solid ${active ? '#8b5cf6' : 'rgba(75, 85, 99, 0.5)'}`,
        transform: active ? 'scale(1.05)' : 'none',
        animation: `slideUp 0.5s ease-out ${delay}s both`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '28px' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: active ? '#fff' : '#06b6d4', lineHeight: 1, marginBottom: '4px' }}>
            {count}
          </div>
          <div style={{ fontSize: '12px', color: active ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingCard({ item }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      style={{
        background: 'rgba(31, 41, 55, 0.7)',
        borderRadius: '12px',
        border: `1px solid ${isHovered ? 'rgba(139, 92, 246, 0.5)' : 'rgba(75, 85, 99, 0.5)'}`,
        padding: '16px',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0 8px 16px rgba(139, 92, 246, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-4px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.image && (
        <img 
          src={item.image} 
          alt={item.title}
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover', 
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        />
      )}
      
      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          color: isHovered ? '#60a5fa' : '#fff', 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '8px', 
          display: 'block',
          textDecoration: 'none',
          lineHeight: 1.4,
          transition: 'color 0.2s'
        }}
      >
        {item.title}
      </a>
      
      <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px', lineHeight: 1.5 }}>
        {item.description}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {item.price && (
          <span style={{ 
            padding: '4px 8px', 
            background: '#059669', 
            borderRadius: '6px', 
            fontSize: '12px',
            fontWeight: '600',
            color: '#fff'
          }}>
            {item.price}
          </span>
        )}
        <span style={{ 
          padding: '4px 8px', 
          background: '#1f2937', 
          borderRadius: '6px', 
          fontSize: '11px',
          color: '#9ca3af'
        }}>
          {item.category}
        </span>
        <span style={{ 
          padding: '4px 8px', 
          background: '#1f2937', 
          borderRadius: '6px', 
          fontSize: '11px',
          color: '#9ca3af'
        }}>
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {item.tags.map(tag => (
          <span 
            key={tag}
            style={{
              padding: '2px 8px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#a78bfa'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
