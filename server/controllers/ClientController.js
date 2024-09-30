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
    try {
        const { id } = req.params;
        const { name, born, purchaseCount } = req.body;

        if (name === undefined && born === undefined && purchaseCount === undefined) {
            return res.status(400).json({ error: "Pelo menos um dos campos Nome, Data de Nascimento ou Compras é obrigatório" });
        }

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (born !== undefined) updateData.born = born;
        
        if (purchaseCount !== undefined) {
            updateData.purchaseCount = purchaseCount;
        }

        const updatedClient = await Client.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedClient = await Client.findByIdAndDelete(id);
  
      if (!deletedClient) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
  
      res.status(200).json({ message: "Cliente excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };