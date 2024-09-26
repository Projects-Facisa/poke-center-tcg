import Promotion from '../models/Promotion.js';
import Card from '../models/Card.js';
import Client from '../models/Client.js';

export const getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({}).populate('Card', ["name", "image", "stock"]).populate('Client', "name");

        // Filtra as promoções que não têm Card ou cujo stock é 0
        const promotionsToDelete = promotions.filter(promotion => {
            const card = promotion.Card;
            return !card || (card.stock === 0);
        });

        // Deleta as promoções filtradas
        if (promotionsToDelete.length > 0) {
            await Promotion.deleteMany({ _id: { $in: promotionsToDelete.map(p => p._id) } });
        }

        // Retorna as promoções restantes
        const remainingPromotions = await Promotion.find({}).populate('Card', ["name", "image"]).populate('Client', "name");
        return res.status(200).json(remainingPromotions);
    } catch (e) {
        return res.status(500).json({mensage: "erro ao buscar as promos",error: e});
    }
}

export const getPromotionById = async (req, res) => {
    try {
        const {id} = req.params;
        const promotion = await Promotion.findById(id).populate('Card', "name").populate('Client', "name");
        return res.status(200).json(promotion)
    } catch (e) {
        return res.status(500).json({error: e});
    }
}

export const getPromotionByClientId = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            const promotions = await Promotion.find()
            return res.status(200).json(promotions);
        } else {
            const promotions = await Promotion.find({Client: id})
            return res.status(200).json(promotions);
        }
    } catch (e) {
        return res.status(500).json({error: e});
    }
}

export const createPromotion = async (req, res) => {
    try {
        const {cardId, clientId, price, expireAt} = req.body;

        if (!cardId || !price || !expireAt) {
            return res.status(400).json({error: 'Undefined Parameters'});
        }

        if (new Date(expireAt).getTime() <= new Date(Date.now()).getTime()) {
            return res.status(400).json({error: 'Expire date is previous today'});
        }

        const existPromotion = await Promotion.findOne({Card: cardId})
        if (existPromotion) {
            return res.status(400).json({error: 'Já existe promoção com essa carta'});
        }

        const existCard = await Card.findById(cardId)

        if (!existCard || existCard <= 0) {
            return res.status(400).json({error: 'Card Not Found or not in stock'});
        }

        if (clientId) {
            const existClient = await Client.findById(clientId)
            if (!existClient) {
                return res.status(400).json({error: 'Client Not Found'});
            }
        }

        if (price < 0 || price >= existCard.price) {
            return res.status(400).json({error: 'Price invalid'});
        }

        const newPromotion = new Promotion({Card: cardId, Client: clientId, price, expireAt});

        await newPromotion.save();
        return res.status(201).json({mensage: "nova promoção registrada", newPromotion: newPromotion});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const updatePromotion = async (req, res) => {
    try {
        const {id} = req.params;
        const {cardId, clientId, price, expireAt} = req.body;

        if (!cardId || !price || !expireAt) {
            return res.status(400).json({error: 'Undefined Parameters'});
        }

        if (new Date(expireAt).getTime() <= new Date(Date.now()).getTime()) {
            return res.status(400).json({error: 'Expire date is previous today'});
        }

        const existPromotion = await Promotion.findOne({Card: cardId})
        if (!existPromotion) {
            return res.status(400).json({error: 'Card Not Found'});
        }
        else if (existPromotion.id !== id){
            return res.status(400).json({error: 'Já existe promoção com essa carta'})
        }

        const existCard = await Card.findById(cardId)

        if (!existCard) {
            return res.status(400).json({error: 'Card Not Found'});
        }

        if (clientId) {
            const existClient = await Client.findById(clientId)
            if (!existClient) {
                return res.status(400).json({error: 'Client Not Found'});
            }
        }

        if (price < 0 || price >= existCard.price) {
            return res.status(400).json({error: 'Price invalid'});
        }

        const updatePromotion = await Promotion.findByIdAndUpdate(id, {
            Card: cardId,
            Client: clientId,
            price: price,
            expireAt: expireAt
        })
        return res.status(200).json({updatePromotion: updatePromotion});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const deletePromotionById = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await Promotion.deleteOne({_id: id})
        return res.status(200).json({result})
    }
    catch (error) {
        return res.status(400).json({DeletedPromotion: error.message});
    }
}