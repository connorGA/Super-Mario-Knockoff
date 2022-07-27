console.log('hello');

window.addEventListener('load', function(){                         //wrap whole game in this so JS waits for all assets like sprite sheets and images to load before it executes code
    const canvas = document.getElementById('canvas1');              //assign canvas a variable and grab it off our page
    const ctx = canvas.getContext('2d');                            //ctx = "context". instance of built-in canvas 2D api that holds all drawing methods and properties we will need to animate the game
    canvas.width = 800;
    canvas.height = 720;                                            //canvas.width and canvas.height are adjusting the canvas box to the desired size

    class InputHandler {                                            //InputHandler class will apply eventListeners to keyboard events and hold array of all currently active keys
        constructor(){
            this.keys = [];                                         //this.keys property is set equal to empty array. Keys will be added and removed from array as they are pressed and released to keep track of multiple key presses
            window.addEventListener('keydown', e => {               //place eventListener directly in constructor. This way when we create an instance of inputHandler class later, all eventlisteners will be automatically applied.
                // console.log(e.key);                              //call back function on eventListener has access to this built in(keydown) event object; (e) = assigned variable name for event
                if ((   e.key === 'ArrowDown' ||                    
                        e.key === 'ArrowUp' ||
                        e.key === 'ArrowLeft' ||                    //these four checking to see if e.key input is one of our four specified directions
                        e.key === 'ArrowRight')
                
                    && this.keys.indexOf(e.key) === -1){            //this says if one of the above inputs is applied AND this input is not yet in our this.keys array, then push it into the array
                    this.keys.push(e.key);                          //if above e.key value is equal to one of our directions(Down,Up,Left,Right), this will push the value into our this.keys array
                }
            });

            window.addEventListener('keyup', e => {                 //"keyup" event is used to deal with the event that keys are released
                // console.log(e.key);
                if (    e.key === 'ArrowDown' || 
                        e.key === 'ArrowUp' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight'){
                    this.keys.splice(this.keys.indexOf(e.key), 1); // this says that if key that was released was one of four above e.key inputs, find index of that key inside our this.keys array and use splice to remove (1) element from that array, hence the 1 at the end of parentheses
                }
                                                                    // both of our "keydown" & "keyup" eventlisteners work together to add and remove key inputs from our this.keys array as they are pressed and released
            });
        }
    }

    class Player {                                                  //Player class will define properties of player object. It will draw it, animate it, and update its position based on user input
        constructor(gameWidth, gameHeight){                         //player object needs to be aware of game boundaries so pass in gameWidth and gameHeight as arguments
            this.gameWidth = gameWidth;                             //then game.Width & game.Height converted to class properties
            this.gameHeight = gameHeight;
            this.width = 220;                                       //this.width & this.height dictate the size of the frame that holds our player sprite
            this.height = 300;
            this.x = 0;                                             // this.x cord moves player on horizontal axis and this.y moves player on vertical axis
            this.y = this.gameHeight - this.height;                 //this makes sure our player stands at the bottom of our specified game area
            this.image = document.getElementById('playerImage');    // grabbing our player sprite sheet and bringing it into the project
            this.frameX = 0;
            this.frameY = 0;                                        //changing this.frameX & this.frameY allows us to navigate to differe
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;

        }
        draw(context){                                                                            //takes context as an argument to specify which canvas we want to draw on
            context.fillStyle = 'White';                                                          //this is so we can see rectangle for now. Makes it easier to play around with sizing and stuff
            context.fillRect(this.x, this.y, this.width, this.height);                            //call built in fillRect method to create a rectangle that will represent our player
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,    //built in drawImage method used to draw player image. Pass it this.image from above that we used to grab our sprite sheet. 
                this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input){                                                                            //this update method is so we can move player around based on our user inputs
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
                this.vy -= 32;
            } else {
                this.speed = 0;
            }
            // horizontal movement 
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
            //vertical movement
            this.y += this.vy;
            if (!this.onGround()){
                this.vy += this.weight;
                this.frameY = 0;
                this.frameX = 1.683;
            } else {
                this.vy = 0;
                this.frameY = 0;
                this.frameX = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Background {                                                                                          //Background class will handle endleslly scrolling backgrounds
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 1500;
            this.height = 815;
            this.speed = 10;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this. height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this. height);
        }
        update(){
            this.x -= this.speed;
            if(this.x < 0 - this.width) this.x = 0;
        }
    }

    class Enemy {                                                                //Enemy class will generate enemies
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('enemyImage');
            this.x = 0;
            this.y = 0;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y);
        }
    }

    function handleEnemies() {                                                  //function is responsible for adding, animating, and removing enemies from the game
    
    }

    function displayStatusText() {                                              //utility function that handles things like score and "gameover" message

    }

        
    const input = new InputHandler();                                           //instance of InputHandler class that will run all code inside constructor, so at this point the eventListener "keydown" is applied
    const player = new Player(canvas.width, canvas.height);                     //instance of Player class. Our constuctor expects a gameWidth and gameHeight as arguments, so we will pass it the canvas.width and canvas.height we specified at the top. This keeps our player inside our canvas boundaries
    const background = new Background(canvas.width, canvas.height);
    const enemy1 = new Enemy(canvas.width, canvas.height);
    

    function animate(){                                                        // will run 60 x per second updating and drawing our game over and over 
        ctx.clearRect(0,0,canvas.width, canvas.height);                        //To show only current animation frame. This built in method will delete whole canvas between each animation loop. This prevents the canvas from leaving a trail, instead showing only current frame
        background.draw(ctx);
        background.update();
        player.draw(ctx);                                                      // this displays player by calling our "draw" method we wrote above. It expects "context" as an argument, so we pass it our "ctx" from the top 
        player.update(input);                                                  // call our update method 
        enemy1.draw(ctx);
       
        requestAnimationFrame(animate);                                        //built in method to make everything in our animate function loop. Pass in "animate", the name of its parent function, to make endless animation loop
    }
    animate();                                                                  //call animate function to start endless loop

});
