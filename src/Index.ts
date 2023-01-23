// Load a base
import Character from "./Character.js"
import NameGenerator from "./NameGenerator.js";
import CharacterBase from "./CharacterBase.js"
import { CharacterDescription } from "./Description.js";
import { CharacterData } from "./Character.js";
import util from "util"

const nameGenerator = new NameGenerator("./data/character/names/FantasyNames.txt")

const base = new CharacterBase("./data/character/bases/contemporany.json", {
    nameGenerators : {
        neuter : nameGenerator
    }
});

const character = new Character(base);
const description = new CharacterDescription(character);

const result = character.edit({
    editType : "regenerate"
});


console.log(util.inspect(result, false, null));