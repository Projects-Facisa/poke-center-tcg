import express from 'express';
import {
    createPromotion, deletePromotionById,
    getAllPromotions,
    getPromotionById,
    updatePromotion
} from '../controllers/promotionController.js';

const router = express.Router();

router.route("/")
    .post(createPromotion)
    .get(getAllPromotions)

router.route("/:id")
    .get(getPromotionById)
    .put(updatePromotion)
    .delete(deletePromotionById)

export default router;