import express from 'express';
import cors from 'cors';
import TCGdex from '@tcgdex/sdk';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Card from './object.js';

dotenv.config(); 

const app = express();
const portApi = process.env.PORT || 5000;
const tcgdex = new TCGdex('en');

app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Rota GET para obter todas as cartas
app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find({}, '-__v'); // Omitir o campo __v
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota GET para obter uma carta pelo ID
app.get('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id, '-__v'); // Omitir o campo __v

    if (!card) {
      return res.status(404).json({ error: 'Carta não encontrada' });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error('Erro ao buscar carta:', error.message);
    res.status(500).json({ error: 'Erro ao buscar a carta.' });
  }
});

// Rota POST para adicionar uma carta ao banco de dados
app.post('/add-card', async (req, res) => {
  try {
    const { id, name, image, rarity, category, stock, price } = req.body;
    
    if (!id || !name || !image || !rarity || !category || stock === undefined || price === undefined) {
      return res.status(400).json({ error: 'Todos os campos são necessários: id, nome, imagem, raridade, categoria, estoque e preço.' });
    }

    const imageUrl = image.endsWith('/high.png') ? image : `${image}/high.png`;

    // Verificar se a carta já existe
    const existingCard = await Card.findOne({ id });
    if (existingCard) {
      return res.status(400).json({ error: 'Carta com este ID já existe.' });
    }

    const newCard = new Card({
      id,
      name,
      image: imageUrl,
      rarity,
      category,
      stock,
      price
    });

    await newCard.save();
    res.status(201).json({ message: 'Carta adicionada com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar carta:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar a carta.' });
  }
});


// Rota PUT para atualizar o preço e o estoque de uma carta pelo ID
app.put('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock } = req.body;

    if (price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Os campos preço e estoque são obrigatórios' });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { price, stock },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ error: 'Carta não encontrada' });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota DELETE para excluir uma carta pelo ID
app.delete('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ error: 'Carta não encontrada' });
    }

    res.status(200).json({ message: 'Carta excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota GET para buscar cartas da API TCGdex pelo nome
app.get('/fetch-cards', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Nome da carta é necessário.' });
  }

  try {
    const allCards = await tcgdex.fetch('cards');
    
    if (!Array.isArray(allCards)) {
      throw new Error('Dados inválidos recebidos da API.');
    }

    const cards = allCards.filter(card => card.name && card.name.toLowerCase().includes(name.toLowerCase()));

    if (cards.length === 0) {
      return res.status(404).json({ error: 'Nenhuma carta encontrada com esse nome.' });
    }

    res.status(200).json(cards);
  } catch (error) {
    console.error('Erro ao buscar cartas:', error.message);
    res.status(500).json({ error: 'Erro ao buscar as cartas.' });
  }
});

// Rota GET para obter uma carta pelo ID da API TCGdex
app.get('/fetch-card/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const card = await tcgdex.fetch('cards', id);

    if (!card) {
      return res.status(404).json({ error: 'Carta não encontrada.' });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error('Erro ao buscar carta:', error.message);
    res.status(500).json({ error: 'Erro ao buscar a carta.' });
  }
});

app.listen(portApi, () => {
  console.log(`API Server rodando na porta ${portApi}`);
});
