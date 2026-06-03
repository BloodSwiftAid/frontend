import { renderHook, act } from '@testing-library/react';
import { useIsVerified } from './useIsVerified';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('useIsVerified', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return false by default when localStorage is empty', () => {
    const { result } = renderHook(() => useIsVerified());
    expect(result.current).toBe(false);
  });

  it('should return true if facility_verified is true', () => {
    localStorage.setItem('facility_verified', 'true');
    const { result } = renderHook(() => useIsVerified());
    expect(result.current).toBe(true);
  });

  it('should return true if role is INTERNAL_ADMIN', () => {
    localStorage.setItem('role', 'INTERNAL_ADMIN');
    const { result } = renderHook(() => useIsVerified());
    expect(result.current).toBe(true);
  });

  it('should update value when storage event is fired', () => {
    const { result } = renderHook(() => useIsVerified());
    expect(result.current).toBe(false);

    act(() => {
      localStorage.setItem('facility_verified', 'true');
      window.dispatchEvent(new Event('storage'));
    });

    expect(result.current).toBe(true);
  });
});
