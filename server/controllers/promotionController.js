import Promotion from '../models/Promotion.js';
import User from '../models/User.js';
import Card from '../models/Card.js';

export const getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({}).populate('Card', ["name", "image"]).populate('User', "name");
        return res.status(200).json(promotions);
    } catch (e) {
        return res.status(500).json({mensage: "erro ao buscar as promos",error: e});
    }
}

export const getPromotionById = async (req, res) => {
    try {
        const {id} = req.params;
        const promotion = await Promotion.findById(id).populate('Card', "name").populate('User', "name");
        return res.status(200).json(promotion)
    } catch (e) {
        return res.status(500).json({error: e});
    }
}

export const getPromotionByUserId = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) {
            const promotions = await Promotion.find()
            return res.status(200).json(promotions);
        } else {
            const promotions = await Promotion.find({User: id})
            return res.status(200).json(promotions);
        }
    } catch (e) {
        return res.status(500).json({error: e});
    }
}

export const createPromotion = async (req, res) => {
    try {
        const {cardId, userId, price, expireAt} = req.body;

        if (!cardId || !price || !expireAt) {
            return res.status(400).json({error: 'Undefined Parameters'});
        }

        if (new Date(expireAt).getTime() <= new Date(Date.now()).getTime()) {
            return res.status(400).json({error: 'Expire date is previous today'});
        }

        const existCard = await Card.findById(cardId)

        if (!existCard) {
            return res.status(400).json({error: 'Card Not Found'});
        }

        if (userId) {
            const existUser = await User.findById(userId)
            if (!existUser) {
                return res.status(400).json({error: 'User Not Found'});
            }
        }

        if (price < 0 || price >= existCard.price) {
            return res.status(400).json({error: 'Price invalid'});
        }

        const newPromotion = new Promotion({Card: cardId, User: userId, price, expireAt});

        await newPromotion.save();
        return res.status(201).json({mensage: "nova promoção registrada", newPromotion: newPromotion});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

export const updatePromotion = async (req, res) => {
    try {
        const {id} = req.params;
        const {cardId, userId, price, expireAt} = req.body;

        if (!cardId || !price || !expireAt) {
            return res.status(400).json({error: 'Undefined Parameters'});
        }

        if (new Date(expireAt).getTime() <= new Date(Date.now()).getTime()) {
            return res.status(400).json({error: 'Expire date is previous today'});
        }

        const existCard = await Card.findById(cardId)

        if (!existCard) {
            return res.status(400).json({error: 'Card Not Found'});
        }

        if (userId) {
            const existUser = await User.findById(userId)
            if (!existUser) {
                return res.status(400).json({error: 'Card Not Found'});
            }
        }

        if (price < 0 || price >= existCard.price) {
            return res.status(400).json({error: 'Price invalid'});
        }

        const updatePromotion = await Promotion.findByIdAndUpdate(id, {
            Card: cardId,
            User: userId,
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
        const result = await Promotion.findByIdAndDelete(id)
        return res.status(200).json({result})
    }
    catch (error) {
        return res.status(400).json({DeletedPromotion: error.message});
    }
}