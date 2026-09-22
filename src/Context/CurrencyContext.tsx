"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SlugMethods from "@/actions/SlugMethods";
import { useUser } from "@/Context/userContext";

type Currency = {
  value: string;
  label: string;
  symbol?: string;
  flag?: string;
};
type CurrencyUser = {
  id?: string | number | null;
  SelectedCurrency?: string | null;
};

type SiteSettingsContextType = {
  siteSettings: any;
  currencies: Currency[];
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  exchangeRate: number;
};

const DEFAULT_CURRENCY: Currency = {
  value: "USD",
  label: "USD",
  symbol: "$",
  flag: "/assets/usa.png",
};

const STORAGE_KEY = "selected_currency";

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(
  undefined,
);

export function SiteSettingsProvider({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings: any;
}) {
  const { user } = useUser() as {
    user: CurrencyUser | null | undefined;
  };

  const currencies = useMemo<Currency[]>(() => {
    const currencySettings = siteSettings?.currency;

    if (!currencySettings) {
      return [DEFAULT_CURRENCY];
    }

    const baseCurrency = currencySettings.baseCurrency?.trim().toUpperCase();

    const configuredCurrencies = currencySettings.currencies || [];

    const enabledCurrencies = configuredCurrencies
      .filter((currency: any) => currency?.enabled !== false)
      .map(
        (currency: any): Currency => ({
          value: currency.code?.trim().toUpperCase() || "",
          label: currency.code?.trim().toUpperCase() || "",
          symbol: currency.symbol,
          flag:
            currency.ImageSource === "Url"
              ? currency.imageUrl
              : typeof currency.image === "object"
                ? currency.image?.url
                : undefined,
        }),
      )
      .filter((currency: Currency) => currency.value);

    enabledCurrencies.sort((a: Currency, b: Currency) => {
      if (a.value === baseCurrency) return -1;
      if (b.value === baseCurrency) return 1;
      return 0;
    });

    return enabledCurrencies.length ? enabledCurrencies : [DEFAULT_CURRENCY];
  }, [siteSettings]);

  const baseCurrency =
    siteSettings?.currency?.baseCurrency?.trim().toUpperCase() ||
    DEFAULT_CURRENCY.value;

  const defaultCurrency =
    currencies.find((currency) => currency.value === baseCurrency) ||
    currencies[0] ||
    DEFAULT_CURRENCY;

  const [selectedCurrency, setSelectedCurrencyState] =
    useState<Currency>(defaultCurrency);

  const [exchangeRate, setExchangeRate] = useState(1);

  const initializedRef = useRef(false);
  const wasGuestRef = useRef(false);
  const lastSyncedCurrencyRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUserId = user?.id || null;

    if (!initializedRef.current) {
      initializedRef.current = true;

      if (currentUserId) {
        wasGuestRef.current = false;

        const userCurrencyCode = user?.SelectedCurrency?.trim().toUpperCase();

        const userCurrencyObject = currencies.find(
          (currency) => currency.value === userCurrencyCode,
        );

        if (userCurrencyObject) {
          setSelectedCurrencyState(userCurrencyObject);

          localStorage.setItem(STORAGE_KEY, userCurrencyObject.value);

          return;
        }

        setSelectedCurrencyState(defaultCurrency);

        localStorage.setItem(STORAGE_KEY, defaultCurrency.value);

        return;
      }

      wasGuestRef.current = true;

      const savedCurrency = localStorage.getItem(STORAGE_KEY);

      if (savedCurrency) {
        const savedCurrencyCode = savedCurrency.trim().toUpperCase();

        const savedCurrencyObject = currencies.find(
          (currency) => currency.value === savedCurrencyCode,
        );

        if (savedCurrencyObject) {
          setSelectedCurrencyState(savedCurrencyObject);

          return;
        }

        localStorage.removeItem(STORAGE_KEY);
      }

      setSelectedCurrencyState(defaultCurrency);

      localStorage.setItem(STORAGE_KEY, defaultCurrency.value);

      return;
    }

    if (wasGuestRef.current && currentUserId) {
      wasGuestRef.current = false;
      return;
    }

    if (!currentUserId) {
      wasGuestRef.current = true;
    }
  }, [user?.id, user?.SelectedCurrency, currencies, defaultCurrency]);

  const setSelectedCurrency = (currency: Currency) => {
    if (!currency?.value) {
      return;
    }

    const normalizedCurrency = {
      ...currency,
      value: currency.value.trim().toUpperCase(),
      label:
        currency.label?.trim().toUpperCase() ||
        currency.value.trim().toUpperCase(),
    };

    setSelectedCurrencyState(normalizedCurrency);

    localStorage.setItem(STORAGE_KEY, normalizedCurrency.value);
  };

  useEffect(() => {
    const targetCurrency = selectedCurrency?.value?.trim().toUpperCase();

    if (!baseCurrency || !targetCurrency) {
      setExchangeRate(1);
      return;
    }

    let cancelled = false;

    const handleCurrencyChange = async () => {
      try {
        let rate = 1;

        if (baseCurrency !== targetCurrency) {
          const response = await fetch(
            `/api/currency/rate?base=${baseCurrency}&target=${targetCurrency}`,
          );

          if (!response.ok) {
            throw new Error("Failed to fetch exchange rate.");
          }

          const data = await response.json();

          rate = Number(data?.rate);

          if (!Number.isFinite(rate) || rate <= 0) {
            throw new Error("Invalid exchange rate.");
          }
        }

        if (cancelled) {
          return;
        }

        setExchangeRate(rate);

        const userCurrencyCode = user?.SelectedCurrency?.trim().toUpperCase();

        if (!user?.id || targetCurrency === userCurrencyCode) {
          return;
        }

        if (lastSyncedCurrencyRef.current === targetCurrency) {
          return;
        }

        lastSyncedCurrencyRef.current = targetCurrency;

        void SlugMethods("auth/update-user-data", "PATCH", {
          SelectedCurrency: targetCurrency,
        }).catch(() => {
          lastSyncedCurrencyRef.current = null;
        });
      } catch (error) {
        console.error("Failed to initialize currency:", error);

        if (!cancelled) {
          setExchangeRate(1);
        }
      }
    };

    void handleCurrencyChange();

    return () => {
      cancelled = true;
    };
  }, [baseCurrency, selectedCurrency?.value, user?.id, user?.SelectedCurrency]);

  return (
    <SiteSettingsContext.Provider
      value={{
        siteSettings,
        currencies,
        selectedCurrency,
        setSelectedCurrency,
        exchangeRate,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);

  if (!context) {
    throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  }

  return context;
}
