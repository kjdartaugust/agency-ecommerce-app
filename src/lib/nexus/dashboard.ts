// Mock analytics for the seller / buyer / admin dashboards.

export const earningsSeries = [
  { month: "Jan", earnings: 4200, orders: 18 },
  { month: "Feb", earnings: 5100, orders: 22 },
  { month: "Mar", earnings: 4800, orders: 20 },
  { month: "Apr", earnings: 6300, orders: 27 },
  { month: "May", earnings: 7900, orders: 33 },
  { month: "Jun", earnings: 9400, orders: 41 },
];

export const sellerActiveOrders = [
  { id: "ORD-7782", buyer: "James W.", service: "Premium brand identity", tier: "Premium", due: "2 days", price: 54000, status: "In progress" },
  { id: "ORD-7779", buyer: "Lena M.", service: "Logo & guidelines", tier: "Standard", due: "Tomorrow", price: 26400, status: "In progress" },
  { id: "ORD-7771", buyer: "Carlos R.", service: "Brand refresh", tier: "Basic", due: "4 days", price: 12000, status: "Awaiting brief" },
  { id: "ORD-7765", buyer: "Aisha K.", service: "Social media kit", tier: "Standard", due: "Delivered", price: 18000, status: "Delivered" },
];

export const payoutHistory = [
  { id: "PO-3391", date: "2026-06-01", amount: 8420, method: "Bank transfer", status: "Paid" },
  { id: "PO-3372", date: "2026-05-01", amount: 6980, method: "Bank transfer", status: "Paid" },
  { id: "PO-3350", date: "2026-04-01", amount: 7510, method: "PayPal", status: "Paid" },
  { id: "PO-3408", date: "2026-06-20", amount: 3240, method: "Bank transfer", status: "Pending" },
];

export const trafficSeries = [
  { day: "Mon", views: 320 },
  { day: "Tue", views: 410 },
  { day: "Wed", views: 380 },
  { day: "Thu", views: 520 },
  { day: "Fri", views: 610 },
  { day: "Sat", views: 480 },
  { day: "Sun", views: 540 },
];

// Buyer dashboard
export const buyerOrders = [
  { id: "ORD-9921", item: "Premium brand identity design", seller: "Amara Okafor", type: "Service", price: 54000, status: "In progress", step: 2, eta: "In 2 days" },
  { id: "ORD-9904", item: "Aria Mechanical Keyboard", seller: "Daniel Cho", type: "Product", price: 21900, status: "Shipped", step: 2, eta: "Arriving Fri" },
  { id: "ORD-9888", item: "SEO audit & optimization", seller: "Marcus Bell", type: "Service", price: 15000, status: "Completed", step: 3, eta: "Delivered" },
  { id: "ORD-9871", item: "Monarch Headphones", seller: "Sofia Marenco", type: "Product", price: 32900, status: "Completed", step: 3, eta: "Delivered" },
];

export const buyerMessages = [
  { id: "m1", from: "Amara Okafor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", preview: "Just shared the first logo concepts — let me know your thoughts!", time: "2h", unread: true },
  { id: "m2", from: "Daniel Cho", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80", preview: "Your order has shipped with tracking #NX2291.", time: "1d", unread: false },
  { id: "m3", from: "Marcus Bell", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", preview: "Thanks for the 5-star review! 🙏", time: "3d", unread: false },
];

// Admin
export const adminRevenueSeries = [
  { month: "Jan", revenue: 184000, services: 110000, products: 74000 },
  { month: "Feb", revenue: 212000, services: 128000, products: 84000 },
  { month: "Mar", revenue: 198000, services: 121000, products: 77000 },
  { month: "Apr", revenue: 256000, services: 159000, products: 97000 },
  { month: "May", revenue: 301000, services: 188000, products: 113000 },
  { month: "Jun", revenue: 342000, services: 214000, products: 128000 },
];

export const adminUsers = [
  { id: "u1", name: "Amara Okafor", role: "Seller", joined: "2019", status: "Active", flagged: false },
  { id: "u2", name: "Daniel Cho", role: "Seller", joined: "2020", status: "Active", flagged: false },
  { id: "u3", name: "James Wilson", role: "Buyer", joined: "2024", status: "Active", flagged: false },
  { id: "u4", name: "Spam Account", role: "Seller", joined: "2026", status: "Suspended", flagged: true },
  { id: "u5", name: "Priya Sharma", role: "Seller", joined: "2022", status: "Active", flagged: false },
];

export const flaggedListings = [
  { id: "f1", title: "Cheap followers — guaranteed!", seller: "GrowthHacker99", reason: "Prohibited service", reports: 12 },
  { id: "f2", title: "Copy of premium brand kit", seller: "DesignCopy", reason: "Copyright claim", reports: 5 },
  { id: "f3", title: "Unrealistic delivery promise", seller: "FastDev247", reason: "Misleading", reports: 3 },
];
