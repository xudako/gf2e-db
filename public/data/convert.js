const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = 'characters.csv';
const outputFilePath = 'characters.json';

csv()
  .fromFile(csvFilePath)
  .then((jsonArray) => {
    // Transform skinID into arrays
    const transformed = jsonArray.map((character) => ({
      ...character,
      skinID: character.skinID
        ? character.skinID.split(',') // Split skinID string into an array
        : undefined, // Leave undefined if skinID is empty
      internalName: character.internalName
        ? character.internalName
        : undefined,
    }));

    // Write JSON to a file
    fs.writeFileSync(outputFilePath, JSON.stringify(transformed, null, 4));
    console.log('CSV converted to JSON');
  })
  .catch((err) => {
    console.error('Error converting CSV to JSON:', err);
  });