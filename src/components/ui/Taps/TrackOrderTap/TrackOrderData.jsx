import React from "react";

const TrackOrderData = ({ locale, order, cards }) => {
  if (!order) return null;

  return (
    <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-linear-to-r from-[#2A1810] via-[#1F120B] to-[#120A06] p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#C07A3B]/10 blur-2xl pointer-events-none" />

          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {card.title}
          </span>

          {card.type === "money" ? (
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white">
                {card.value}
              </span>

              <span className="text-xs text-[#D8A46B] font-medium">
                {card.suffix}
              </span>
            </div>
          ) : (
            <div className="mt-4">
              <span className="text-lg md:text-xl font-bold text-gray-200 block">
                {card.value}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackOrderData;
