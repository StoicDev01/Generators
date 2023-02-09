import { readFileSync } from "fs";
import Markov  from "./Markov.js"
import { LoadText } from "./Utils.js";


export default class NameGenerator implements LoadText{
    path : string;
    markov : Markov<string>;

    static syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
    exclude_start  : Array<string>;
    max_repeat_syllables : number;

    constructor(path:  string | undefined = undefined, exclude_start=[], max_repeat_syllables=0){
        this.markov = new Markov<string>();
        this.path = "";
        this.exclude_start = exclude_start;
        this.max_repeat_syllables= max_repeat_syllables;

        if (path){
            this.loadPath(path);
        }
    }

    loadPath(path : string){
        const trainningText = readFileSync(path, "utf8");
        const trainningData = this.prepareData(trainningText);
        this.markov.addStates(
            trainningData
        );
    }

    loadText(text: string){
        const trainningData = this.prepareData(text);
        this.markov.addStates(
            trainningData
        );
    }

    syllableSplitter(sentence : string){
        const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
        return sentence.match(syllableRegex);
    }
    
    prepareData(trainningText : string){
        const data: string[]= [];
        const sentences = trainningText.split("\n");
    
        for (const sentence of sentences){
            const syllables = this.syllableSplitter(sentence);
    
            if (syllables){
                for (const syllable of syllables){
                    data.push(syllable);
                }
                data.push("\n");
            }
        }
    
        return data;
    }
    
    generate(max : number){
        let generated = this.markov.generate(null, max, this.exclude_start);
        let str  : string;

        if (!generated){
            generated = []
        }

        str = generated.join("");
        str = str.trim();
        return str.split("\n");
    }
}
