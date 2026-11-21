/**
 * Subtle tactile haptic feedback for mobile touches
 */
export function useHaptic() {
  const trigger = (type = 'light') => {
    if (typeof window === 'undefined' || !window.navigator?.vibrate) return;
    try {
      if (type === 'light') {
        window.navigator.vibrate(10);
      } else if (type === 'medium') {
        window.navigator.vibrate(25);
      } else if (type === 'success') {
        window.navigator.vibrate([15, 50, 20]);
      }
    } catch {
      // Ignore vibration errors on unsupported devices
    }
  };

  return { trigger };
}
