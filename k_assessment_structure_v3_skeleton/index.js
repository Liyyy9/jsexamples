/*other references:
    https://discuss.codecademy.com/t/find-your-hat-challenge-project-javascript/462380

*/
const prompt = require("prompt-sync")({ sigint: true });

// Game elements/assets constants
const GRASS = "░";
const HOLE = "O";
const CARROT = "^";
const PLAYER = "*";

// WIN / LOSE / OUT / QUIT messages constants
const WIN = "Congrats! You found the carrot!";                                                                        // customise message when player wins
const LOSE = "Down the hole you go! Try again!";                                                                      // customise message when player lose
const OUT = "You went out of bounds! Try again!";                                                                     // customise message when player is out of bounds (lose)
const QUIT = "You quit the game. Bye Bye!"                                                                            // customise message when player quits

// MAP ROWS, COLS, PERCENTAGE
const rows = prompt("How many rows? (Hit 'ENTER' if you want the default) ", 8);                                      // by default, the game map will have 8 rows
const cols = prompt("How many columns? (Hit 'ENTER' if you want the default) ", 5);                                   // by default, the game map will have 5 cols
const percentage = .2;                                                                                                // % of holes for the map


class Field {

    // create the constructor
    constructor(field = [[]]) {
        this.field = field;
        this.gamePlay = false;
        this.rowPlayer = 0;
        this.colPlayer = 0;
    }

    static welcomeMsg(msg) {                                                                                          // static Method to show game's welcome message
        console.log(msg);
    }

    static generateField(rows, cols, percentage) {                                                                    // static method that generates and returns a 2D map
        const map = [[]];

        for (let i = 0; i < rows; i++) {                                                                              // create a map with 8 rows
            map[i] = [];
            for (let j = 0; j < cols; j++) {                                                                          // each row will have 5 cols            
                map[i][j] = Math.random() > percentage ? GRASS : HOLE;                                                // per col in each row, we generate grass(80%) / hole(20%)
            }
        }
        return map;
    }

    printField() {                                                                                                    // print the game field (used to update during gameplay)       
        this.field.forEach(element => {
            console.log(element.join(""));
        });
    }

    inBounds(row, col) {                                                                                              // reference: https://gist.github.com/JonoMacC/00bdca156fb42804717f51c3fe98cc7c
        return (
            row >= 0 &&
            row < rows &&
            col >= 0 &&
            col < cols
        );
    }

    updateGame(input) {                                                                                               // DONE: Refer to details in the method's codeblock

        const userInput = String(input).toLowerCase();

        let newRowPlayer = this.rowPlayer;
        let newColPlayer = this.colPlayer;

        /* 
        otherwise, move player on the map: this.field[rowindex][colindex] = PLAYER;
        update the display to show the user had moved to the new area on map
        ask for player's next move as well 
        */
        switch (userInput.toLowerCase()) {
            case 'u':
                newRowPlayer--;
                break;
            case 'd':
                newRowPlayer++;
                break;
            case 'l':
                newColPlayer--;
                break;
            case 'r':
                newColPlayer++;
                break;
            default:
                console.log("Invalid input!");
                break;
        }


        /*  
        DONE: if the user exits out of the field
        end the game - set the gamePlay = false;
        inform the user that he step OUT of the game
        */
        if (!this.inBounds(newRowPlayer, newColPlayer)) {
            console.log(OUT);
            this.endGame();
            return;
        }

        /*   
        DONE: if the user arrives at the carrot
        end the game - set gamePlay = false;
        inform the user that he WIN the game 
        */
        if (this.field[newRowPlayer][newColPlayer] === CARROT) {
            console.log(WIN);
            this.endGame();
        }
        /* 
        DONE: if the user arrives at the hole
        end the game - set the gamePlay = false;
        inform the user that he LOST the game
        */
        if (this.field[newRowPlayer][newColPlayer] === HOLE) {
            console.log(LOSE);
            this.endGame();
        }

        this.field[this.rowPlayer][this.colPlayer] = GRASS;                                                           // Old position becomes GRASS
        this.rowPlayer = newRowPlayer;
        this.colPlayer = newColPlayer;
        this.field[this.rowPlayer][this.colPlayer] = PLAYER;                                                          // Initialising new values for player's row and col


        /*  
        DONE: if the user ends the game                                                                               // set in line 179
        end the game - set the gamePlay = false;
        inform the user that he QUIT the game
        */
        //    if(userInput == 'q'){
        //     console.log(QUIT)
        //     this.endGame();
        //     return;
        //    }

    }

    plantCarrot() {
        // plant the carrot

        let carrotPlanted = 0;

        if (carrotPlanted == 0) {
            let carrotRow = Math.floor(Math.random() * rows);
            let carrotCol = Math.floor(Math.random() * cols);;

            if (carrotCol == 0 && carrotRow == 0) {
                carrotRow = Math.floor(Math.random() * rows);
                carrotCol = Math.floor(Math.random() * cols);
            }
            this.field[carrotRow][carrotCol] = CARROT;
        }

        /*
        Martin's Example
        const X = Math.random();
        const Y = Math.random();
        this.field[X][Y] = CARROT;
         */
    }

    startGame() {
        this.gamePlay = true;                                                                                         // set this.gamePlay = true to keep the game running

        this.field[this.rowPlayer][this.colPlayer] = PLAYER;
        this.plantCarrot();

        while (this.gamePlay) {

            this.printField();

            let flagInvalid = false;                                                                                  // flag to check if any invalid input in entered
            console.log("(u)p, (d)own, (l)eft, (r)ight or (q)uit");
            const input = prompt("Which way: ");

            switch (input.toLowerCase()) {
                case 'u':
                    console.log("Up");
                    this.updateGame(input);
                    break;
                case 'd':
                    console.log("Down");

                    this.updateGame(input);
                    break;
                case 'l':
                    console.log("Left");
                    this.updateGame(input);
                    break;
                case 'r':
                    console.log("Right");
                    this.updateGame(input);
                    break;
                case 'q':
                    console.log(QUIT)
                    this.endGame();
                    break;
                default:
                    console.log("Invalid input!")
                    flagInvalid = !flagInvalid;
                    break;
            }

            // (commented out as it was interfering with the functionality)
            // if (!flagInvalid) {                                                                                        // only if flagInvalid is false, the update game 
            //     this.updateGame(input);                                              
            // }
        }
    }

    endGame() {
        this.gamePlay = false;                                                                                            // set property gamePlay to false
        process.exit();                                                                                                   // end the Node app
    }

    quitGame() {
        console.log(QUIT);
        this.endGame();
    }

}

// Instantiate a new instance of Field Class
const createField = Field.generateField(rows, cols, percentage);                                                          // call Field's class static method to generate 2D field
const gameField = new Field(createField);


Field.welcomeMsg("Welcome to Find Your Carrot!\n**************************************************\n");
gameField.startGame();