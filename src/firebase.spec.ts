import { getAnalytics, isSupported } from 'firebase/analytics';
import { vi } from 'vitest';
import { firebaseApp, initializeAnalytics } from './firebase';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'test-app' })),
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  isSupported: vi.fn(),
}));

describe('Firebase Analytics initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes Analytics when supported', async () => {
    vi.mocked(isSupported).mockResolvedValue(true);

    await initializeAnalytics();

    expect(getAnalytics).toHaveBeenCalledWith(firebaseApp);
  });

  it('does not initialize Analytics when unsupported', async () => {
    vi.mocked(isSupported).mockResolvedValue(false);

    await initializeAnalytics();

    expect(getAnalytics).not.toHaveBeenCalled();
  });

  it('propagates support check errors', async () => {
    const error = new Error('Support check failed');
    vi.mocked(isSupported).mockRejectedValue(error);

    await expect(initializeAnalytics()).rejects.toThrow(error);
  });
});
