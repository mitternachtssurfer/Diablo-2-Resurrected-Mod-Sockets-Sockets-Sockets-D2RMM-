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

if (config.runeScaling !== 100 || config.countessRunes) {
  let treasureClassexFilePath = 'global\\excel\\treasureclassex.txt';
  let treasureClassexFile = D2RMM.readTsv(treasureClassexFilePath);

    treasureClassexFile.rows.forEach((row) => {
      if (config.runeScaling !== 100) {
        for (let i = 1; i <= 10; i++) {
          if (!row['Treasure Class'].includes("Runes ") && (row['Item' + i]).includes("Runes ")) {
            row['Prob' + i] = Math.round(row['Prob' + i] * (config.runeScaling / 100));
          }
        }
      }

      setCountessAnyRunes(row);
    });
  
  D2RMM.writeTsv(treasureClassexFilePath, treasureClassexFile);
}
