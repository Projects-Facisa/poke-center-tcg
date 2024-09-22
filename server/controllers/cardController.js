import Card from "../models/Card.js";
import * as tcgdexService from "../services/tcgdexService.js";

export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.find({}, "-__v");
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id, "-__v");

    if (!card) {
      return res.status(404).json({ error: "Carta não encontrada" });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error("Erro ao buscar carta:", error.message);
    res.status(500).json({ error: "Erro ao buscar a carta." });
  }
};

export const getCardByName = async (req, res) => {
  try {
    const { name } = req.params;
    const cards = await Card.find({name: { $regex: name, $options: 'i' }})
    res.status(200).json(cards);
  }
  catch (error) {
    console.error("Erro ao buscar carta:", error.message);
    res.status(500).json({ error: "Erro ao buscar a carta." });
  }
}

export const addCard = async (req, res) => {
  try {
    const { id, name, image, rarity, category, stock, price, purchaseDate } =
      req.body;

    if (
      !id ||
      !name ||
      !image ||
      !rarity ||
      !category ||
      stock === undefined ||
      price === undefined ||
      !purchaseDate
    ) {
      return res.status(400).json({
        error:
          "Todos os campos são necessários: id, nome, imagem, raridade, categoria, estoque, preço e data de compra.",
      });
    }

    const imageUrl = image.endsWith("/high.png") ? image : `${image}/high.png`;

    const existingCard = await Card.findOne({ id });
    if (existingCard) {
      return res.status(400).json({ error: "Carta com este ID já existe." });
    }

    const newCard = new Card({
      id,
      name,
      image: imageUrl,
      rarity,
      category,
      stock,
      price,
      purchaseDate: new Date(),
    });

    await newCard.save();
    res.status(201).json({ message: "Carta adicionada com sucesso." });
  } catch (error) {
    console.error("Erro ao adicionar carta:", error.message);
    res.status(500).json({ error: "Erro ao adicionar a carta." });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock } = req.body;

    if (price === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ error: "Os campos preço e estoque são obrigatórios" });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { price, stock },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: "Carta não encontrada" });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ error: "Carta não encontrada" });
    }

    res.status(200).json({ message: "Carta excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
