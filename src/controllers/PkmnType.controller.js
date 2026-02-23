// Controller for Pokémon Types

const PkmnTypeService = require('../services/PkmnType.service');
const pkmnTypeService = new PkmnTypeService();

exports.getAllTypes = async (req, res) => {
    try {
        let types = await pkmnTypeService.getAllTypes();

        return res.status(200).json({
            success: true,
            data: types,
            count: types.length
        });

    }
    catch (error) {
        console.error('Error fetching Pokémon types:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};