import Client from "../models/Client.js";

export const getAllClients = async (req, res) => {
    try{
        const result = await Client.find();
        if (result.length){
            res.status(200).json({message: "Lista de Clientes encontrada.", content: result})
        } else {
            res.status(404).json({message: "Nenhum Cliente encontrado."})
        }
    }catch(error) {
        res.status(400).json({message: "Erro inesperado."})
    }
}

export const getOneClient = async (req, res) => {
    try{
        const result = await Client.findById({code: req.params.code} )
        res.status(200).json({message: "Cliente encontrado com sucesso.", content: result})
    }catch(error) {
        res.status(404).json({message: "Nenhum Cliente encontrado."})
    }
}

export const addClient = async (req, res) => {
    const { name, born ,email, purchaseCount } = req.body;
    
    console.log("Dados recebidos no register:", req.body);
    
    if (!name || !born || !email) {
        return res
        .status(400)
        .json({ error: "Preencha todos os campos obrigatórios." });
    }
    
    try {
        const clientExist = await Client.findOne({ email });
    
        if (clientExist) {
        return res.status(400).json({ error: "Este e-mail já está registrado." });
        }
    
        const newClient = await Client.create({
        name,
        born,
        email,
        purchaseCount,
        });
    
        return res
        .status(201)
        .json({ message: "Usuário registrado com sucesso.", client: newClient });
    } catch (error) {
        return res.status(500).json({
        error:
            "Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.",
        });
    }
};

export const updateClient = async (req, res) => {
    
}