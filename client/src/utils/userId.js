// Standalone user ID utility - no dependencies
const STORAGE_KEY = 'faltu_uid';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getAnonymousUserId() {
  if (typeof window === 'undefined') return '';
  
  let uid = localStorage.getItem(STORAGE_KEY);
  if (!uid) {
    uid = generateUUID();
    localStorage.setItem(STORAGE_KEY, uid);
  }
  return uid;
}

