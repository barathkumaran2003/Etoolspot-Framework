import { generateId } from "./utils";

// --- TYPES ---
export type Role = 'ADMIN' | 'USER';
export type Plan = 'FREE' | 'PRO' | 'PREMIUM';

export interface User {
  id: string;
  username: string;
  email: string;
  mobile: string;
  password?: string;
  role: Role;
  subscription: Plan;
  profilePhoto?: string;
  createdAt: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  category: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Settings {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
}

// --- CONSTANTS ---
const DELAY_MS = 400; // Simulate network latency

// --- SEED DATA ---
const DEFAULT_TOOLS: Tool[] = [
  { id: generateId(), name: "Resume Builder", description: "Build professional resumes with AI assistance", icon: "FileText", url: "https://example.com/resume", category: "Productivity", isPremium: false, isActive: true, createdAt: new Date().toISOString() },
  { id: generateId(), name: "QR Code Generator", description: "Generate dynamic QR codes for any URL", icon: "QrCode", url: "https://example.com/qr", category: "Utilities", isPremium: false, isActive: true, createdAt: new Date().toISOString() },
  { id: generateId(), name: "Barcode Generator", description: "Create industry-standard barcodes instantly", icon: "Barcode", url: "https://example.com/barcode", category: "Utilities", isPremium: true, isActive: true, createdAt: new Date().toISOString() },
  { id: generateId(), name: "Image to Text", description: "Extract text from any image using advanced OCR", icon: "ScanText", url: "https://example.com/ocr", category: "AI Tools", isPremium: true, isActive: true, createdAt: new Date().toISOString() },
  { id: generateId(), name: "EXE/APK Converter", description: "Convert packages securely in the cloud", icon: "Package", url: "https://example.com/converter", category: "Developer", isPremium: true, isActive: true, createdAt: new Date().toISOString() },
];

const DEFAULT_SETTINGS: Settings = {
  siteName: "Etoolspot",
  primaryColor: "180 100% 50%",
  secondaryColor: "280 100% 65%"
};

// --- HELPERS ---
const simulateDelay = () => new Promise(res => setTimeout(res, DELAY_MS));

function getStorage<T>(key: string, fallback: T): T {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : fallback;
}

function setStorage<T>(key: string, val: T) {
  localStorage.setItem(key, JSON.stringify(val));
}

// --- INITIALIZATION ---
export function initializeStorage() {
  const users = getStorage<User[]>('etoolspot_users', []);
  if (users.length === 0) {
    users.push({
      id: generateId(),
      username: "Admin Barath",
      email: "barathkumaran2003@gmail.com",
      mobile: "9999999999",
      password: "Barath@1234",
      role: 'ADMIN',
      subscription: 'PREMIUM',
      createdAt: new Date().toISOString()
    });
    setStorage('etoolspot_users', users);
  }

  const tools = getStorage<Tool[]>('etoolspot_tools', []);
  if (tools.length === 0) {
    setStorage('etoolspot_tools', DEFAULT_TOOLS);
  }

  const settings = getStorage<Settings>('etoolspot_settings', DEFAULT_SETTINGS);
  setStorage('etoolspot_settings', settings);
}

// --- API FUNCTIONS ---
export const api = {
  // Auth & Users
  getCurrentUser: async (): Promise<User | null> => {
    // No delay — localStorage is synchronous, instant response
    return getStorage<User | null>('etoolspot_currentUser', null);
  },
  
  login: async (credentials: { email: string; password?: string; isGoogle?: boolean }): Promise<User> => {
    await simulateDelay();
    const users = getStorage<User[]>('etoolspot_users', []);
    
    if (credentials.isGoogle) {
      // Mock Google Login - create if doesn't exist
      let user = users.find(u => u.email === credentials.email);
      if (!user) {
        user = {
          id: generateId(),
          username: credentials.email.split('@')[0],
          email: credentials.email,
          mobile: "0000000000",
          role: 'USER',
          subscription: 'FREE',
          createdAt: new Date().toISOString()
        };
        users.push(user);
        setStorage('etoolspot_users', users);
      }
      setStorage('etoolspot_currentUser', user);
      return user;
    }

    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) throw new Error("Invalid email or password");
    
    setStorage('etoolspot_currentUser', user);
    return user;
  },

  signup: async (data: Partial<User>): Promise<User> => {
    await simulateDelay();
    const users = getStorage<User[]>('etoolspot_users', []);
    if (users.find(u => u.email === data.email)) {
      throw new Error("Email already registered");
    }
    const newUser: User = {
      id: generateId(),
      username: data.username!,
      email: data.email!,
      mobile: data.mobile!,
      password: data.password!,
      role: 'USER',
      subscription: 'FREE',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setStorage('etoolspot_users', users);
    setStorage('etoolspot_currentUser', newUser);
    return newUser;
  },

  logout: async (): Promise<void> => {
    await simulateDelay();
    localStorage.removeItem('etoolspot_currentUser');
  },

  getUsers: async (): Promise<User[]> => {
    await simulateDelay();
    return getStorage<User[]>('etoolspot_users', []);
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    await simulateDelay();
    const users = getStorage<User[]>('etoolspot_users', []);
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("User not found");
    
    users[idx] = { ...users[idx], ...updates };
    setStorage('etoolspot_users', users);

    // Update current user if it's the same person
    const currentUser = getStorage<User | null>('etoolspot_currentUser', null);
    if (currentUser?.id === id) {
      setStorage('etoolspot_currentUser', users[idx]);
    }
    
    return users[idx];
  },

  // Tools
  getTools: async (): Promise<Tool[]> => {
    await simulateDelay();
    return getStorage<Tool[]>('etoolspot_tools', []);
  },

  saveTool: async (tool: Partial<Tool>): Promise<Tool> => {
    await simulateDelay();
    const tools = getStorage<Tool[]>('etoolspot_tools', []);
    
    if (tool.id) {
      const idx = tools.findIndex(t => t.id === tool.id);
      if (idx > -1) {
        tools[idx] = { ...tools[idx], ...tool };
        setStorage('etoolspot_tools', tools);
        return tools[idx];
      }
    }

    const newTool: Tool = {
      ...(tool as Tool),
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    tools.push(newTool);
    setStorage('etoolspot_tools', tools);
    return newTool;
  },

  deleteTool: async (id: string): Promise<void> => {
    await simulateDelay();
    let tools = getStorage<Tool[]>('etoolspot_tools', []);
    tools = tools.filter(t => t.id !== id);
    setStorage('etoolspot_tools', tools);
  },

  // Settings
  getSettings: async (): Promise<Settings> => {
    await simulateDelay();
    return getStorage<Settings>('etoolspot_settings', DEFAULT_SETTINGS);
  },

  saveSettings: async (settings: Settings): Promise<Settings> => {
    await simulateDelay();
    setStorage('etoolspot_settings', settings);
    return settings;
  }
};
