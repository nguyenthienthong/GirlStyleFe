import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'data/data.json');

// In-memory state cache
let memoryStore: any = null;

function loadStore() {
  if (!memoryStore) {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        memoryStore = JSON.parse(raw);
      } else {
        memoryStore = {};
      }
    } catch (e) {
      console.error('[DataStore Load Error]', e);
      memoryStore = {};
    }
  }

  // Ensure arrays exist
  memoryStore.products = memoryStore.products || [];
  memoryStore.orders = memoryStore.orders || [];
  memoryStore.vouchers = memoryStore.vouchers || [];
  memoryStore.banners = memoryStore.banners || [];
  memoryStore.lookbooks = memoryStore.lookbooks || [];
  memoryStore.feedbacks = memoryStore.feedbacks || [];
  memoryStore.users = memoryStore.users || [];
  memoryStore.logs = memoryStore.logs || [];
  memoryStore.facebookPosts = memoryStore.facebookPosts || [];
  memoryStore.config = memoryStore.config || {
    kiotvietConfig: { enabled: true, clientId: 'KIOT_GIRLSTYLE_APP_99', retailer: 'girlstyle', branchId: 'BRANCH_HN_01' },
    vietqrConfig: { bankId: 'MBBank', accountNo: '0988889999', accountName: 'GIRLSTYLE FASHION STORE' }
  };

  return memoryStore;
}

export function saveStore() {
  if (!memoryStore) return;
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('[DataStore Save Error]', e);
  }
}

export function getStore() {
  return loadStore();
}

export function updateStore(mutator: (store: any) => void) {
  const store = loadStore();
  mutator(store);
  saveStore();
  return store;
}
