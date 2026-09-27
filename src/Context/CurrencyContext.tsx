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

  const lastSyncedCurrencyRef = useRef<string | null>(null);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    if (user?.id) {
      const userCurrencyCode = user.SelectedCurrency?.trim().toUpperCase();

      const userCurrency = currencies.find(
        (currency) => currency.value === userCurrencyCode,
      );

      if (userCurrency) {
        setSelectedCurrencyState(userCurrency);

        localStorage.setItem(STORAGE_KEY, userCurrency.value);

        return;
      }

      setSelectedCurrencyState(defaultCurrency);

      localStorage.setItem(STORAGE_KEY, defaultCurrency.value);

      return;
    }

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
  }, [user?.id, user?.SelectedCurrency, currencies, defaultCurrency]);

  const setSelectedCurrency = (currency: Currency) => {
    if (!currency?.value) {
      return;
    }

    const value = currency.value.trim().toUpperCase();

    const normalizedCurrency: Currency = {
      ...currency,
      value,
      label: currency.label?.trim().toUpperCase() || value,
    };

    setSelectedCurrencyState(normalizedCurrency);

    localStorage.setItem(STORAGE_KEY, value);

    if (!user?.id) {
      return;
    }

    if (lastSyncedCurrencyRef.current === value) {
      return;
    }

    const userCurrencyCode = user.SelectedCurrency?.trim().toUpperCase();

    if (userCurrencyCode === value) {
      lastSyncedCurrencyRef.current = value;
      return;
    }

    lastSyncedCurrencyRef.current = value;

    void SlugMethods("auth/update-user-data", "PATCH", {
      SelectedCurrency: value,
    }).catch(() => {
      lastSyncedCurrencyRef.current = null;
    });
  };

  useEffect(() => {
    const targetCurrency = selectedCurrency?.value?.trim().toUpperCase();

    if (!baseCurrency || !targetCurrency) {
      setExchangeRate(1);
      return;
    }

    let cancelled = false;

    const getExchangeRate = async () => {
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

        if (!cancelled) {
          setExchangeRate(rate);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);

        if (!cancelled) {
          setExchangeRate(1);
        }
      }
    };

    void getExchangeRate();

    return () => {
      cancelled = true;
    };
  }, [baseCurrency, selectedCurrency?.value]);

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
