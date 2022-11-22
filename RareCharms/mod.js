const charmsItemCodes = ['scha', 'mcha', 'lcha'];

let itemTypesFilePath = 'global\\excel\\itemtypes.txt';
let itemTypesFile = D2RMM.readTsv(itemTypesFilePath);

itemTypesFile.rows.forEach((row) => {
  if (charmsItemCodes.includes(row.Code)) {
    row.Rare = 1;
  }
});

D2RMM.writeTsv(itemTypesFilePath, itemTypesFile);
