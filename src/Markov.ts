import { randomChoice } from "./Choice.js";

export default class Markov<T>{
    public data : Map<T,T[]>
    repeat : number;
    
    constructor(){
        this.data = new Map<T, T[]>();
        this.repeat = 0;
    }

    addStates(states : T[]){
        let index = 0;
        // iterar por todos os estados dados
        for (const state of states){
            // pegar o id do proximo estado
            const nextState = states[index+ 1];
            
            // se este estado não está em data
            if (!this.data.get(state)){
                // adicione o estado e o possivel proximo estado
                if (nextState){
                    this.data.set(state, [nextState]);
                }
                else{
                    this.data.set(state, []);
                }
            } else {
                // adicione o possivel proximo estado
                if (nextState){
                    const dataState = this.data.get(state);
                    if (dataState){
                      this.data.set(
                        state, dataState.concat(nextState)
                      );
                    }
                }
            }
            index++;
        }
    }

    walk(currentState : T | undefined = undefined, exclude : T[] = []){
        if ( !currentState){
            // pegar um estado aleatório inicial
            currentState = randomChoice<T>(
                Array.from(this.data.keys())
                );
            
                
            let to_exclude = exclude.includes(currentState)

            while (to_exclude){
                to_exclude = exclude.includes(currentState)

                currentState = randomChoice<T>(
                    Array.from(this.data.keys())
                );
            }

            return currentState;
        }
    
        // escolher o proximo baseado nas possibilidades
        const possibilites = this.data.get(currentState);
        if ( possibilites){
            const next = randomChoice(possibilites);

            if (next === currentState){
                this.repeat ++;
            }
            else{
                this.repeat = 0;
            }

            return next;
        }
    
        return undefined;
    }
    
    generate(start : T | null = null, max  = 10, exclude_start=[], max_repeat_states=1){
        let lastState : T | null = null;
        const generatedStates : T[] = [];
       
        for (let x = 0; x < max; x++){
            let currentState : T | null = null;
            if (lastState){
                currentState = this.walk(lastState)
            }
            else{
                currentState = this.walk(null, exclude_start);
            }

            if (currentState == null){
                // chegamos ao fim
                return generatedStates;
            }
            else{
                generatedStates.push(currentState);
            }

            lastState = currentState;
        }
        return generatedStates;
    }
}