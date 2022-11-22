class recipe {
  constructor(description, inputs, output, ilvl = 0, mods = []) {
    this.recipe = {};
    this.recipe['description'] = description;
    this.recipe['enabled'] = 1;
    this.recipe['version'] = 100;
    this.recipe['numinputs'] = inputs.length;
    inputs.forEach((input, index) => {
      i = index + 1;
      this.recipe['input ' + i] = input;
    });
    this.recipe['output'] = output;
    if (ilvl) {
      this.recipe['ilvl'] = ilvl;
    }
    mods.forEach((mod, index) => {
      i = index + 1;
      this.recipe['mod ' + i] = mod[0];
      this.recipe['mod ' + i + ' min'] = mod[1];
      this.recipe['mod ' + i + ' max'] = mod[2];
    });
  }
}

function writeFile(recipes) {
  const cubeMainFilePath = 'global\\excel\\cubemain.txt';
  const cubeMainFile = D2RMM.readTsv(cubeMainFilePath);

  recipes.forEach((recipe) => {
    cubeMainFile.rows.push(recipe.recipe);
  });

  D2RMM.writeTsv(cubeMainFilePath, cubeMainFile);
}

if (config.upgradeQuality) {
  writeFile([
    new recipe('Upgrade magic item from normal to non-magic exceptional', ['any,mag,bas', 'tbk', 'gem4', 'jew', 'r11'], 'usetype,exc', 45),
    new recipe('Upgrade magic item from exceptional to non-magic elite', ['any,mag,exc', 'tbk', 'gem4', 'jew', 'r11'], 'usetype,eli', 90),
    new recipe('Remove magic from magic elite item', ['any,mag,eli', 'tbk', 'gem4', 'jew', 'r11'], 'usetype,eli', 90),
    // new recipe('Remove rare from rare elite item and add sockets', ['any,rar,eli', 'tbk', 'gem4', 'jew', 'r11'], 'usetype,eli', 90),
    new recipe('Upgrade rare item to non-rare elite', ['any,rar', 'tbk', 'gem4', 'jew', 'r11'], 'usetype,eli', 90)
  ]);
}
