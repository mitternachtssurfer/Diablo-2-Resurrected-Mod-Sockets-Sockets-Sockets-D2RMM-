// ================================ CONSTANTS ================================

const armorTypes = ["tors"];
const helmTypes = ["helm"];
const shieldTypes = ["shld", "pala"];
const weaponTypes = ["axe", "club", "h2h", "hamm", "knif", "mace", "mele", "miss", "pole", "scep", "spea", "staf", "swor", "wand", "weap"];

// ================================ CLASS DECLARATIONS ================================

class socketItem {
  constructor(name, socketsCondition, itemType, maxSockets, socketsType, runewordsType = false) {
    this.name = name;
    this.socketsCondition = socketsCondition;
    this.itemType = itemType;
    this.maxSockets = maxSockets;
    this.socketsType = socketsType;
    this.runewordsType = runewordsType;
    this.maxSockets1 = 1;
    this.maxSockets2 = Math.ceil(maxSockets / 2);
    this.maxSockets3 = maxSockets;
  }
  addItemRecipe(file) {
    if (this.socketsCondition) {
      file.rows.push({
        description: `Add sockets to ${this.name}`,
        enabled: 1,
        version: 100,
        numinputs: 5,
        'input 1': `${this.itemType},nos`,
        'input 2': 'tbk',
        'input 3': 'jew',
        'input 4': 'gem0',
        'input 5': 'r01',
        output: 'useitem',
        'mod 1': 'sock',
        'mod 1 min': 1,
        'mod 1 max': this.maxSockets
      });
    }
  }
  addItemToFirstEmptyItemType(row, itemType) {
    if (row.itype2 === '') {
      row.itype2 = itemType;
    } else if (row.itype3 === '') {
      row.itype3 = itemType;
    } else if (row.itype4 === '') {
      row.itype4 = itemType;
    } else if (row.itype5 === '') {
      row.itype5 = itemType;
    } else if (row.itype6 === '') {
      row.itype6 = itemType;
    }
  }
  applyItemMaxSockets(row) {
    if (this.socketsCondition && row.Code === this.itemType) {
      if (this.maxSockets > 1) {
        row.Magic = '';
      }
      row.MaxSockets1 = this.maxSockets1;
      row.MaxSockets2 = this.maxSockets2;
      row.MaxSockets3 = this.maxSockets3;
    }
  }
  applyItemRunewordType(row, runewordItemTypes, runewordRunesCount) {
    if (this.socketsCondition && this.runewordsType && this.runewordsType !== 'none' && this.maxSockets >= runewordRunesCount) {
      if (this.runewordsType === 'any') {
        this.addItemToFirstEmptyItemType(row, this.itemType)
      } else if (this.runewordsType === 'type' && runewordItemTypes.includes(this.socketsType)) {
        this.addItemToFirstEmptyItemType(row, this.itemType)
      }
    }
  }
  applyItemSockets(row) {
    if (this.socketsCondition && row.type === this.itemType) {
      row.hasinv = 1;
      row.gemsockets = this.maxSockets;
      row.gemapplytype = this.getSocketsTypeId();
    }
  }
  getSocketsTypeId() {
    switch (this.socketsType) {
      case 'weapons':
        return 0;
      case 'armors':
        return 1;
      case 'helms':
        return 1;
      case 'shields':
        return 2;
      default:
        return 0;
    }
  }
}

class itemsGroup {
  constructor(items, filePath) {
    this.items = items;
    this.filePath = filePath;
  }
  addGroupRecipes() {
    if (config.addRecipes && this.checkGroupItemsSocketsConditions) {
      const file = D2RMM.readTsv(this.filePath);

      this.items.forEach((item) => {
        item.addItemRecipe(file);
      });

      D2RMM.writeTsv(this.filePath, file);
    }
  }
  applyGroupItemsMaxSockets() {
    if (this.checkGroupItemsSocketsConditions) {
      const file = D2RMM.readTsv(this.filePath);

      file.rows.forEach((row) => {
        this.items.forEach((item) => {
          item.applyItemMaxSockets(row);
        });
      });

      D2RMM.writeTsv(this.filePath, file);
    }
  }
  applyGroupItemsSockets() {
    if (this.checkGroupItemsSocketsConditions) {
      const file = D2RMM.readTsv(this.filePath);

      file.rows.forEach((row) => {
        this.items.forEach((item) => {
          item.applyItemSockets(row);
        });
      });

      D2RMM.writeTsv(this.filePath, file);
    }
  }
  applyGroupItemsRunewordType() {
    if (this.checkGroupItemsSocketsConditions) {
      const file = D2RMM.readTsv(this.filePath);

      file.rows.forEach((row) => {
        if (row.complete !== '') {
          let runewordItemTypes = this.getRunewordItemTypes(row);
          let runewordRunesCount = this.getRunewordRunesCount(row);
          this.items.forEach((item) => {
            item.applyItemRunewordType(row, runewordItemTypes, runewordRunesCount);
          });
        }
      });

      D2RMM.writeTsv(this.filePath, file);
    }
  }
  checkGroupItemsSocketsConditions() {
    this.items.forEach((item) => {
      if (item.socketsCondition) {
        return true;
      }
    });
    return false;
  }
  getRunewordItemType(itemType) {
    if (itemType !== '') {
      if (weaponTypes.includes(itemType)) {
        return "weapons";
      } else if (shieldTypes.includes(itemType)) {
        return "shields";
      } else if (armorTypes.includes(itemType)) {
        return "armors";
      } else if (helmTypes.includes(itemType)) {
        return "helms";
      }
    }
    return "empty";
  }
  getRunewordItemTypes(row) {
    let runewordItemTypes = [];
    runewordItemTypes.push(this.getRunewordItemType(row.itype1));
    runewordItemTypes.push(this.getRunewordItemType(row.itype2));
    runewordItemTypes.push(this.getRunewordItemType(row.itype3));
    runewordItemTypes.push(this.getRunewordItemType(row.itype4));
    runewordItemTypes.push(this.getRunewordItemType(row.itype5));
    runewordItemTypes.push(this.getRunewordItemType(row.itype6));
    return runewordItemTypes;
  }
  getRunewordRunesCount(row) {
    if (row.Rune1 === '') {
      return 0;
    } else if (row.Rune2 === '') {
      return 1;
    } else if (row.Rune3 === '') {
      return 2;
    } else if (row.Rune4 === '') {
      return 3;
    } else if (row.Rune5 === '') {
      return 4;
    } else if (row.Rune6 === '') {
      return 5;
    } else {
      return 6;
    }
  }
}

// ================================ SCRIPT ================================

let amulets = new socketItem('amulets', config.amuletsSocket, 'amul', 1, config.amuletsSocketType);
let belts = new socketItem('belts', config.beltsSockets, 'belt', 2, config.beltsSocketsType, config.beltsRunewordsType);
let boots = new socketItem('boots', config.bootsSockets, 'boot', 4, config.bootsSocketsType, config.bootsRunewordsType);
let smallCharms = new socketItem('small charms', config.smallCharmsSocket, 'scha', 1, config.smallCharmsSocketType);
let largeCharms = new socketItem('large charms', config.largeCharmsSockets, 'mcha', 2, config.largeCharmsSocketsType, config.largeCharmsRunewordsType);
let grandCharms = new socketItem('grand charms', config.grandCharmsSockets, 'lcha', 3, config.grandCharmsSocketsType, config.grandCharmsRunewordsType);
let gloves = new socketItem('gloves', config.glovesSockets, 'glov', 4, config.glovesSocketsType, config.glovesRunewordsType);
let rings = new socketItem('rings', config.ringsSocket, 'ring', 1, config.ringsSocketType);

let armorItems = [belts, boots, gloves];
let miscItems = [amulets, smallCharms, largeCharms, grandCharms, rings];
let anyItems = armorItems.concat(miscItems);

let armorGroup = new itemsGroup(armorItems, 'global\\excel\\armor.txt');
armorGroup.applyGroupItemsSockets();

let miscGroup = new itemsGroup(miscItems, 'global\\excel\\misc.txt');
miscGroup.applyGroupItemsSockets();

let itemTypesGroup = new itemsGroup(anyItems, 'global\\excel\\itemtypes.txt');
itemTypesGroup.applyGroupItemsMaxSockets();

let runesGroup = new itemsGroup(anyItems, 'global\\excel\\runes.txt');
runesGroup.applyGroupItemsRunewordType();

let recipesGroup = new itemsGroup(anyItems, 'global\\excel\\cubemain.txt');
recipesGroup.addGroupRecipes();
