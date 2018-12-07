var Enemy = function(y) {

    /*
    *   Load image for enemies
    *   Set initial location outside of screen to the left
    *   Set random speed between 150 - 300
    */

    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = y;
    this.speed = 150 + Math.floor(Math.random() *150);

};

// Making sure the game runs the same speed everywhere
Enemy.prototype.update = function(dt) {

    this.x += this.speed * dt;

/*
*   When the bug reaches outside of the screen it is reset to the left side to cross again with a new random speed.
*/

    if (this.x > 500) {
        this.x = -100;
        this.speed = 150 + Math.floor(Math.random() *150);
    }
/*
*   while crossing check for collisions
*/
    this.checkCollision();

};

/*
*   When the bug's reaching the players x position and until it is leaving the player's x posiion. Collision is detected
*   Message is diplayed both in console and on the page.
*   Reset player to original position.
*/
Enemy.prototype.checkCollision = function(){
    if (this.x + 100 >= player['x'] + player['padding'] &&
        this.x < player['x'] + player['padding'] + 68  &&
        this.y == player['y']) {
            console.log('KaBoom-Collision!');
            document.getElementById('result').innerHTML = 'KaBoom-Collision! Try again!';
            player.reset();
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*
*   Initialze variables
*       -Load character
*       -Set inital position
*       -Save character spacing within it's image
*       -Step counter
*/

class Player {
    constructor(){
        this.sprite = 'images/char-boy.png';
        this.x = 200;
        this.y = 396;
        this.width = 67;
        this.padding = 31;
        this.steps = 0;
    }

// Reset player's position to the starting point

    reset(){
        this.x = 200;
        this.y = 396;
    }

    update(dt){
        // I left this method here but it's not needed as I implemented colision detection as a method of Enemy.
    }

    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(pressed){

// Set min and max positions so player can't leave the canvas.

        let maxY = 396;
        let minY = 60;
        let maxX = 400;
        let minX = 0;

// Start timer when the first key is pressed

        if(gameTime == undefined) {
            gameTime = new Timer;
            gameTime.start();
        }

/*
*   When getting keyboards input check if it's an allowed key otherwise wait for input.
*   If Valid input received, set x and y positions to move player to the right location.
*/

        switch(pressed) {
            case 'up':
                if(this.y == minY){
                    this.y -= 70;
                    this.steps++;

/*
*   If the water is reached. Game completed message diplayed.
*   Message displayed with time and steps
*   Reset charachter to starting position.
*   Reset step counter and time.
*/

                    document.getElementById('result').innerHTML = 'You have completed the game in ' + gameTime.finish() + ' with ' + this.steps + ' steps';
                    console.log('You have completed the game in ' + gameTime.finish() + ' with ' + this.steps + ' steps');
                    setTimeout(function(){player.reset()},500);
                    this.steps = 0;
                    gameTime = undefined;
                };
                if(this.y > minY){
                    this.y -= 84;
                    this.steps++;
                    console.log('Step ' + this.steps + ' Moving up!');
                };
                break;

            case 'right':
                if(this.x < maxX && this.y >= minY){
                    this.x += 100;
                    this.steps++;
                    console.log('Step ' + this.steps + ' Moving right!');
                };
                break;

            case 'down':
                if(this.y < maxY && this.y >= minY){
                    this.y += 84;
                    this.steps++;
                    console.log('Step ' + this.steps + ' Moving down!');
                };
                break;

            case 'left':
                if(this.x > minX && this.y >= minY){
                    this.x -= 100;
                    this.steps++;
                    console.log('Step ' + this.steps + ' Moving left!');
                };
                break;

            default:
                console.log('Waiting for allowed input. Please use arrow keys.');
        }
    };
}

/*
*   Create Player object & gameTime variable
*   Setting enemies at specific Y axis
*   Create new enemy instances then pass them to allEnemies as an array
*/

let player = new Player();
let gameTime = undefined;
enemiesAt = [60, 144, 144, 228];

let allEnemies = enemiesAt.map(y => new Enemy(y));


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Timer that measures the time between the first step and when the game is completed.

class Timer {
    constructor(){
        this.time = undefined;
    }

    start(){
        this.time = new Date();
    }

    finish(){
        let finish = new Date();
        let total = finish - this.time;
        total = new Date(total);

// Get human readable time format

        let mins = total.getMinutes();
        let secs =total.getSeconds();
        let ms = total.getMilliseconds();

// Make them double digits

        mins = (mins < 10 ? '0' + mins : mins);
        secs = (secs < 10 ? '0' + secs : secs);
        ms = (ms < 10 ? '0'+ ms : ms);

        return (mins + 'm : ' + secs + 's : ' + ms + 'ms');
    }
}