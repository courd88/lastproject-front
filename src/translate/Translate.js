// Imports the Google Cloud client library
// const { Translate } = require('@google-cloud/translate').v2;

// // Creates a client
// const translate = new Translate();

// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// const text = 'Hello, world!';
// const target = 'ko';

// async function translateText() {
//   // Translates the text into the target language. "text" can be a string for
//   // translating a single piece of text, or an array of strings for translating
//   // multiple texts.
//   let [translations] = await translate.translate(text, target);
//   translations = Array.isArray(translations) ? translations : [translations];
//   console.log('Translations:');
//   translations.forEach((translation, i) => {
//     console.log(`${text[i]} => (${target}) ${translation}`);
//   });
// }

// // translateText();

// // Imports the Google Cloud client library
// const {Translate} = require('@google-cloud/translate').v2;

// async function listLanguages() {
//   // Lists available translation language with their names in English (the default).
//   const [languages] = await translate.getLanguages();

//   console.log('Languages:');
//   languages.forEach(language => console.log(language));
// }

// listLanguages();