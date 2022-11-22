const amazonBows = [config.amazonBows, ['Stag Bow', 'am1'], ['Reflex Bow', 'am2']];
const amazonJavalins = [config.amazonJavalins, ['Maiden Javelin', 'am5']];
const amazonSpears = [config.amazonSpears, ['Maiden Spear', 'am3'], ['Maiden Pike', 'am4']];
const babarianHelms = [config.babarianHelms, ['Jawbone Cap', 'ba1'], ['Fanged Helm', 'ba2'], ['Horned Helm', 'ba3'], ['Assault Helmet', 'ba4'], ['Avenger Guard', 'ba5']];
const druidPelts = [config.druidPelts, ['Wolf Head', 'dr1'], ['Hawk Helm', 'dr2'], ['Antlers', 'dr3'], ['Falcon Mask', 'dr4'], ['Spirit Mask', 'dr5']];
const necromancerShrunkenHeads = [config.necromancerShrunkenHeads, ['Preserved Head', 'ne1'], ['Zombie Head', 'ne2'], ['Unraveller Head', 'ne3'], ['Gargoyle Head', 'ne4'], ['Demon Head', 'ne5']];
const paladinShields = [config.paladinShields, ['Targe', 'pa1'], ['Rondache', 'pa2'], ['Heraldic Shield', 'pa3'], ['Aerin Shield', 'pa4'], ['Crown Shield', 'pa5']];
const scepters = [config.scepters, ['Scepter', 'scp'], ['Grand Scepter', 'gsc'], ['War Scepter', 'wsp']];
const sorceressOrbs = [config.sorceressOrbs, ['Eagle Orb', 'ob1'], ['Sacred Globe', 'ob2'], ['Smoked Sphere', 'ob3'], ['Clasped Orb', 'ob4'], ['Jareds Stone', 'ob5']];
const staves = [config.staves, ['Short Staff', 'sst'], ['Long Staff', 'lst'], ['Gnarled Staff', 'cst'], ['Battle Staff', 'bst'], ['War Staff', 'wst']];
const wands = [config.wands, ['Wand', 'wnd'], ['Yew Wand', 'ywn'], ['Bone Wand', 'bwn'], ['Grim Wand', 'gwn']];

const addGamble = [amazonBows, amazonJavalins, amazonSpears, babarianHelms, druidPelts, necromancerShrunkenHeads, paladinShields, scepters, sorceressOrbs, staves, wands];

function checkConfigConditions(itemsGroup) {
  for (let i = 0; i < itemsGroup.length; i++) {
    if (itemsGroup[i][0]) {
       return true;
    }
  }

  return false;
}

function pushItems(file, items) {
  if (items[0]) {
    for (let i = 1; i < items.length; i++) {
      file.rows.push({
        name: items[i][0],
        'code\r': items[i][1]
      });
    }
  }
}

if (checkConfigConditions(addGamble)) {
  let gambleFilePath = 'global\\excel\\gamble.txt';
  let gambleFile = D2RMM.readTsv(gambleFilePath);

  addGamble.forEach((items) => {
    pushItems(gambleFile, items)
  });

  D2RMM.writeTsv(gambleFilePath, gambleFile);
}
