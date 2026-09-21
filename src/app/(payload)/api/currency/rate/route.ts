import { NextResponse } from "next/server";
import { getExchangeRate } from "@/lib/currency/getExchangeRate";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const baseCurrency = searchParams.get("base");
    const targetCurrency = searchParams.get("target");

    if (!baseCurrency || !targetCurrency) {
      return NextResponse.json(
        {
          message: "Base and target currencies are required.",
        },
        {
          status: 400,
        },
      );
    }

    const rate = await getExchangeRate(baseCurrency, targetCurrency);

    return NextResponse.json({
      baseCurrency: baseCurrency.toUpperCase(),
      currency: targetCurrency.toUpperCase(),
      rate,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to retrieve exchange rate.",
      },
      {
        status: 500,
      },
    );
  }
}
