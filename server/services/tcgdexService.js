import TCGdex from "@tcgdex/sdk";

const tcgdex = new TCGdex("en");

export const fetchAllCards = async () => {
  const allCards = await tcgdex.fetch("cards");
  return allCards;
};

export const fetchCard = async (id) => {
  const card = await tcgdex.fetch("cards", id);
  return card;
};
