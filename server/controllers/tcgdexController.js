import * as tcgdexService from "../services/tcgdexService.js";

export const fetchCardsByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Nome da carta é necessário." });
  }

  try {
    const allCards = await tcgdexService.fetchAllCards();

    if (!Array.isArray(allCards)) {
      throw new Error("Dados inválidos recebidos da API.");
    }

    const cards = allCards.filter(
      (card) =>
        card.name && card.name.toLowerCase().includes(name.toLowerCase())
    );

    if (cards.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhuma carta encontrada com esse nome." });
    }

    res.status(200).json(cards);
  } catch (error) {
    console.error("Erro ao buscar cartas:", error.message);
    res.status(500).json({ error: "Erro ao buscar as cartas." });
  }
};

export const fetchCardById = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await tcgdexService.fetchCard(id);

    if (!card) {
      return res.status(404).json({ error: "Carta não encontrada." });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error("Erro ao buscar carta:", error.message);
    res.status(500).json({ error: "Erro ao buscar a carta." });
  }
};