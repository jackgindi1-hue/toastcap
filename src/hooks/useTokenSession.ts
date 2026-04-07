'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const TOKEN_STORAGE_KEY = 'tc_session_token';
const LEAD_STORAGE_KEY = 'tc_session_lead';

export type TokenState = 'loading' | 'valid' | 'invalid';

export interface LeadData {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  email?: string;
}

export interface UseTokenSessionResult {
  tokenState: TokenState;
  token: string | null;
  leadData: LeadData | null;
  clearSession: () => void;
}

/**
 * Hook for managing token-based sessions.
 *
 * Flow:
 * 1. Check URL for token param
 * 2. If URL has token, validate it and store in sessionStorage
 * 3. If URL doesn't have token, check sessionStorage
 * 4. If sessionStorage has token, validate it
 * 5. If valid, return valid state and lead data
 * 6. If invalid, clear sessionStorage and return invalid state
 *
 * @param page - The page type for validation ('quote', 'upload', 'dlvc', 'homepage')
 */
export function useTokenSession(page: 'quote' | 'upload' | 'dlvc' | 'homepage' = 'homepage'): UseTokenSessionResult {
  const searchParams = useSearchParams();
  const urlToken = searchParams.get('token');

  const [tokenState, setTokenState] = useState<TokenState>('loading');
  const [token, setToken] = useState<string | null>(null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);

  const clearSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(LEAD_STORAGE_KEY);
    }
    setToken(null);
    setLeadData(null);
    setTokenState('invalid');
  }, []);

  useEffect(() => {
    async function validateAndStoreToken(tokenToValidate: string, source: 'url' | 'session') {
      try {
        // For homepage, we use 'quote' validation since 'active' status is what we want
        const validationPage = page === 'homepage' ? 'quote' : page;
        const response = await fetch(`/api/tokens/validate?token=${tokenToValidate}&page=${validationPage}`);
        const data = await response.json();

        if (data.valid) {
          // Store token and lead data in sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenToValidate);
            if (data.lead) {
              sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data.lead));
            }
          }

          setToken(tokenToValidate);
          setTokenState('valid');

          if (data.lead) {
            setLeadData({
              firstName: data.lead.firstName,
              lastName: data.lead.lastName,
              businessName: data.lead.businessName,
              email: data.lead.email,
            });
          }
        } else {
          // Token is invalid - clear any stored session
          clearSession();
        }
      } catch (error) {
        console.error('Token validation error:', error);
        clearSession();
      }
    }

    // Priority: URL token > sessionStorage token
    if (urlToken) {
      // Token in URL - validate and store
      validateAndStoreToken(urlToken, 'url');
    } else if (typeof window !== 'undefined') {
      // No URL token - check sessionStorage
      const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
      const storedLead = sessionStorage.getItem(LEAD_STORAGE_KEY);

      if (storedToken) {
        // Have stored token - validate it's still valid
        validateAndStoreToken(storedToken, 'session');

        // Also restore lead data immediately for faster UX
        if (storedLead) {
          try {
            setLeadData(JSON.parse(storedLead));
          } catch (e) {
            // Invalid JSON, ignore
          }
        }
      } else {
        // No token anywhere - invalid
        setTokenState('invalid');
      }
    } else {
      // SSR - wait for client
      setTokenState('loading');
    }
  }, [urlToken, page, clearSession]);

  return {
    tokenState,
    token,
    leadData,
    clearSession,
  };
}

/**
 * Helper to get the current session token (for use in link hrefs)
 * Returns the token from sessionStorage or null
 */
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

/**
 * Helper to build a URL with the session token
 */
export function buildTokenUrl(path: string): string {
  const token = getSessionToken();
  if (!token) return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}token=${token}`;
}
