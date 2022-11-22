const countessAnyRune = [
  { 
    'treasureClass': 'Countess Rune',
    'newRunes': 'Runes 7'
  },
  { 
    'treasureClass': 'Countess Rune (N)',
    'newRunes': 'Runes 12'
  },
  { 
    'treasureClass': 'Countess Rune (H)',
    'newRunes': 'Runes 17'
  }
];

function setCountessAnyRunes(row) {
  if (config.countessAnyRune) {
    countessAnyRune.forEach((countessAnyRuneItem) => {
      if (row['Treasure Class'] === countessAnyRuneItem['treasureClass']) {
        row.Item1 = countessAnyRuneItem['newRunes'];
        return;
      }
    });
  }
}

function setRuneDropScaling(row) {
  if (config.runeScaling !== 100) {
    if (!row['Treasure Class'].includes("Runes ")) {
      for (let i = 1; i <= 10; i++) {
        if (row['Item' + i].includes("Runes ")) {
          row['Prob' + i] = Math.round(row['Prob' + i] * (config.runeScaling / 100));
        }
      }
    }
  }
}

function setRuneDropLikelihood(row) {
  if (config.runeLikelihood) {
    if (row['Treasure Class'].includes("Runes ")) {
      var prob = false;
      for (let i = 1; i <= 10; i++) {
        if (!row['Item' + i].includes("Runes ") && row['Item' + i] !== "") {
          row['Prob' + i] = 1;
          if (prob) {
            prob = Math.min(prob, row['Item' + i].replace(/\D/g,'') - 1);
          } else {
            prob = row['Item' + i].replace(/\D/g,'') - 1;
          }
        } else if (row['Item' + i].includes("Runes ")) {
          if (prob) {
            row['Prob' + i] = prob;
          }
        }
      }
    }
  }
}

if (config.runeScaling !== 100 || config.countessRunes) {
  let treasureClassexFilePath = 'global\\excel\\treasureclassex.txt';
  let treasureClassexFile = D2RMM.readTsv(treasureClassexFilePath);

    treasureClassexFile.rows.forEach((row) => {
      setRuneDropScaling(row);
      setRuneDropLikelihood(row);
      setCountessAnyRunes(row);
    });
  
  D2RMM.writeTsv(treasureClassexFilePath, treasureClassexFile);
}
