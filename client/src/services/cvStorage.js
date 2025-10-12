// client/src/services/cvStorage.js
const KEY = 'africacv_resume_id';

export const cvStorage = {
  getResumeId() {
    try {
      return localStorage.getItem(KEY);
    } catch {
      return null;
    }
  },
  setResumeId(id) {
    try {
      if (id) localStorage.setItem(KEY, String(id));
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }
};
