import Card from '../models/Card.js'; 

export const getDashboardData = async (req, res) => {
  try {
    // Usando agregação para contar total e contagens por raridade
    const [result] = await Card.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          common: [{ $match: { rarity: 'Common' } }, { $count: "count" }],
          uncommon: [{ $match: { rarity: 'Uncommon' } }, { $count: "count" }],
          rare: [{ $match: { rarity: 'Rare' } }, { $count: "count" }],
          ultraRare: [{ $match: { rarity: 'Ultra Rare' } }, { $count: "count" }],
          others: [
            { 
              $match: { 
                rarity: { $nin: ['Common', 'Uncommon', 'Rare', 'Ultra Rare'] } 
              } 
            },
            { $count: "count" }
          ],
        }
      }
    ]);

    // Extraindo os contadores do resultado
    const totalCount = result.total.length > 0 ? result.total[0].count : 0;
    const commonCount = result.common.length > 0 ? result.common[0].count : 0;
    const uncommonCount = result.uncommon.length > 0 ? result.uncommon[0].count : 0;
    const rareCount = result.rare.length > 0 ? result.rare[0].count : 0;
    const ultraRareCount = result.ultraRare.length > 0 ? result.ultraRare[0].count : 0;
    const othersCount = result.others.length > 0 ? result.others[0].count : 0;

    // Retornando os dados
    res.json({
      total: totalCount,
      common: commonCount,
      uncommon: uncommonCount,
      rare: rareCount,
      ultraRare: ultraRareCount,
      others: othersCount,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
};
