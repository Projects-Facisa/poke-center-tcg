import Card from "../models/Card.js";

export const getAllCards = async (req, res) => {
  try {
    const cards = await Card.aggregate([
      {
        $lookup: {
          from: 'promotions', // Nome da coleção de promoções
          localField: '_id', // Campo na coleção de cartões
          foreignField: 'Card', // Campo na coleção de promoções
          as: 'promotions' // Nome do campo onde as promoções correspondentes serão armazenadas
        }
      },
      {
        $project: {
          newPrice: { $arrayElemAt: ['$promotions.price', 0] },
          id: 1,
          name: 1,
          image: 1,
          rarity: 1,
          category: 1,
          stock: 1,
          price: 1,
          purchaseDate: 1,
          // Adicione outros campos conforme necessário
        }
      }
    ]);

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
    const cards = await Card.find({ name: { $regex: name, $options: "i" } });
    res.status(200).json(cards);
  }
  catch (error) {
    console.error("Erro ao buscar carta:", error.message);
    res.status(500).json({ error: "Erro ao buscar a carta." });
  }
};

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
