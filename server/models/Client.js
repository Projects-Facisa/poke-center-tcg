import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const clientSchema = new mongoose.Schema(
    {
        name: { 
            type: String,
            required: true,
        },
        born: {
            type: Date,
            required:true,
        },
        email: {
            type: String,
            required: [true, "Email é obrigatório"],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Formato de email inválido"],
        },
        purchaseCount: {
            type: Number,
        }
    }
)

clientSchema.plugin(AutoIncrement, {inc_field: 'code'});

const Client = mongoose.model('Client', clientSchema);

export default Client;