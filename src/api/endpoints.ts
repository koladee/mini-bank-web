export const endpoints = {
  auth: {
    register: '/auth/register',
    login:    '/auth/login',
    me:       '/auth/me',
  },
  accounts: {
    list:    '/accounts',
    balance: (id: string) => `/accounts/${id}/balance`,
  },
  tx: {
    list:    (type?: string, page=1, limit=10) =>
              `/transactions${type ? `?type=${type}&` : '?'}page=${page}&limit=${limit}`,
    transfer: '/transactions/transfer',
    exchange: '/transactions/exchange',
  },
  admin: {
    reconcile: '/reconciliation/verify',
  },
  users: { list: (q?: string, limit=20) => `/users${q ? `?q=${encodeURIComponent(q)}&` : '?'}limit=${limit}` },
  meta: { rates: '/meta/rates' },
} as const;
