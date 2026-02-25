const PkmnType = require('../models/PkmnType.model');

class PkmnTypeService {
  constructor() {
    this.pkmnType = PkmnType;
  }

  async getAllTypes() {
    // return an array of all pokemon types
    // it'll be stringify in the controller
    return this.pkmnType.data;
  }
}

module.exports = PkmnTypeService;
