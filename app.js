
window.addEventListener('load', function start(){                         //wrap whole game in this so JS waits for all assets like sprite sheets and images to load before it executes code
    const canvas = document.getElementById('canvas1');              //assign canvas a variable and grab it off our page
    const ctx = canvas.getContext('2d');                            //ctx = "context". instance of built-in canvas 2D api that holds all drawing methods and properties we will need to animate the game
    canvas.width = 1400;
    canvas.height = 720;                                            //canvas.width and canvas.height are adjusting the canvas box to the desired size
    let enemies = [];                                               //since we want multiple enemies on screen at the same time, we will create an enemies variable and set it equal to an empty array, so that later we can pass enemies into array
    let score = 0;                                                  //score is tied to collision detection. Score++ everytime enemy is killed
    let dragonBallCounter = 0;
    let gameOver = false;                                           //for when mario hits goomba while on ground(aka dies)
    let dragonBalls = [];
    
   
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
            this.width = 170;                                       //this.width & this.height dictate the size of the frame that holds our player sprite
            this.height = 300;
            this.x = 0;                                             // this.x cord moves player on horizontal axis and this.y moves player on vertical axis. Setting to 0 starts player on furthest left edge
            this.y = this.gameHeight - this.height;                 //this makes sure our player stands at the bottom of our specified game area
            this.image = document.getElementById('playerImage');    // grabbing our player sprite sheet and bringing it into the project
            this.frameX = 0;
            this.frameY = 0;                                        //changing this.frameX & this.frameY allows us to navigate to different frames in our sprite sheet
            this.maxFrame = 1.2;
            this.fps = 20;                                          //to time frame rate with delta time we will need 3 helper properties. (1)fps will effect how fast we swap between individual animation frames in our sprite sheet
            this.frameTimer = 0;                                    //(2)will count from 0 to frameInterval over and over 
            this.frameInterval = 1000/this.fps;                     //(3)will define the value we are counting towards, its the value of how many ms each frame lasts
            this.speed = 0;                                         //affects player movement on x axis(horizontal); higher value = higher speed. Negative values move character backwards
            this.vy = 0;                                            //this.vy(velocity) pertains to vertical movement aka jumping
            this.weight = 1;                                        //need this.weight to prevent player from jumping and flying off the top of the screen. Basically functions as our gravity. Set it = to 1, because we are going to gradually add weight to this.vy so player begins to drop

        }
        draw(context){                                                                            //takes context as an argument to specify which canvas we want to draw on
            context.strokeStyle = 'transparent'
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);  //this line as well as lines above and below created circular hitboxes within our rectangular hitboxes
            context.stroke();
            context.fillStyle = 'transparent';                                                          //this is so we can see rectangle for now. Makes it easier to play around with sizing and stuff. Set to "transperent" when you want to remove white box
            context.fillRect(this.x, this.y, this.width, this.height);                            //call built in fillRect method to create a rectangle that will represent our player
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,    //built in drawImage method used to draw player image. Pass it this.image from above that we used to grab our sprite sheet. 
                this.width, this.height, this.x, this.y, this.width, this.height);                //[1] pass in this.image to insert grabbed sprite sheet from above [2 & 3 & 4 & 5]these determined the rectangle we wanted to crop out from our source spritesheet. The frameX and frameY select which frame in sprite sheet we want and the this.width & this.height place it in our canvas correctly  [6 & 7 & 8 & 9]All of these dictated where on our destination canvas our sprite would go...this.x and this.y adjusted sprite sheet linearly, placing one in box, but still including others. (8 & 9)this.width & this.height helped compress sprite sheet into our box, but mashed together
        }
        update(input, deltaTime, enemies, dragonBalls){                                                                            //this update method is so we can move player around based on our user inputs, thus it expects "input" as an argument
            //collision detection for enemies
            enemies.forEach(enemy => {                                                            //need to run for every enemy in enemies array so passed enemies above as argument and ran forEach
                const dx = enemy.x - this.x;                                                      
                const dy = enemy.y - this.y;                                                     //we need to find sum of radius of both circles in order to detect when they intrude on one another 
                const distance = Math.sqrt(dx * dx + dy * dy);                                   //use Pythagorean theorum to calculate hypotenus(distance) between centerpoint of both circles
                if (distance < enemy.width/2 + this.width/2 && this.vy > 0) {                    //first part of statement(before &&) measures distance between enemy circles and concludes if they are intersecting. Second part only allows mario to kill goomba if he is falling(aka jummping on head)
                    enemy.markedForDeletion = true;                        
                    score++;
                    
                } else if(distance < enemy.width/2 + this.width/2 && this.vy === 0){
                    gameOver = true;
                }
                //superSaiyan invincibility 
                 if (dragonBallCounter > 1 && dragonBallCounter % 7 === 0 && distance < enemy.width/2 + this.width/2){
                    enemy.markedForDeletion = true;
                    gameOver = false;
                    score++;
                    
                   
                }
            });
            //
            dragonBalls.forEach(ball => {                                                            //need to run for every enemy in enemies array so passed enemies above as argument and ran forEach
                const dx2 = ball.x - this.x;                                                      
                const dy2 = ball.y - this.y;                                                     //we need to find sum of radius of both circles in order to detect when they intrude on one another 
                const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);                                   //use Pythagorean theorum to calculate hypotenus(distance) between centerpoint of both circles
                if (distance2 < ball.width/2 + this.width/2) {                    //first part of statement(before &&) measures distance between enemy circles and concludes if they are intersecting. Second part only allows mario to kill goomba if he is falling(aka jummping on head)
                    ball.markedForDeletion = true;                        
                    dragonBallCounter++;  
                } 
            });
            
            
            
            
            //Sprite Animation
            if (this.frameTimer > this.frameInterval){                                           //starts our count
                if (this.frameX >= this.maxFrame) this.frameX = 0.275;                           //begins our animation at this.frameX(our standing mario sprite) and cycles through the sprite sheet up to the frameMax(our running mario). Basically the itteration is just switching back and forth between two sprites, but at speed it gives the appearance of mario running in motion
                else this.frameX = 1.2;
                this.frameTimer = 0;                                                             //set back to zero so count can begin again from starting position
            } else {
                this.frameTimer += deltaTime                                                     //else, keep increasing frameTimer by deltaTime
            }
            //CONTROLS
            if (input.keys.indexOf('ArrowRight') > -1) {                                          //setting input.keys to > -1 basically makes sure that the input exists in our this.keys array
                this.speed = 8;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -8;
            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {                   // adding "&& this.onGround" prevents player from double jumping. Can now only jump if standing on ground. Keep in mind, velocity begins negative as it initially goes up, reducing from our set -32 until it reaches 0 at the peak, and then as it falls that value continues to count from zero up into positive integers. When we hit floor, line 80 sets vy back to 0
                this.vy -= 28;
            } else {
                this.speed = 0;                                                                  //setting this.speed back to zero after all of these inputs tells player to stop moving once key inputs are no longer pressed, rather than having player continually moving in a direciton forever
            }
            // horizontal movement 
            this.x += this.speed;                                                                  //we are adding this.speed to this.x at all times to control horizontal movement. When this.speed is positive, player will move right. When this.speed is negative, player will move left. > number = higher speed
            if (this.x < 0) this.x = 0;                                                         //creating horizontal boundaries, this line doesnt allow player to move past left boundary
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width //line says if players horizontal coordinate is more than gameWidth minus players width(meaning right edge of player rectangle) is touching right edge of canvas area, dont allow it to move past this point
            //vertical movement
            this.y += this.vy;                                                                  //adding velocity to players vertical coordinate
            if (!this.onGround()){                                                              //if this.onGround is false, meaning player is in air, then...(see below line)
                this.vy += this.weight;                                                         //will take velocity and start gradually adding weight as long as player is in air, thus reducing velocity and bringing back down
                this.frameY = 0;
                this.frameX = 2.2;                                                            //this.frameY and this.frameX allow me to switch to different frame in my sprite sheet when player is in air(added jumping mario frame)
            } else {
                this.vy = 0;                                                                    //if player is not in air, and is back on ground, reset our velocity to 0
                // this.frameY = 0;
                // this.frameX = 0.2;                                                           //took out this line because it bypasses our sprite animation above and makes Mario just stand still when on ground
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height  //was having issue of player falling through floor, so this creates a vertical boundary to prevent that
       
       
            //superSaiyan movement
            if (dragonBallCounter > 1 && dragonBallCounter % 7 === 0) {
                
                if (input.keys.indexOf('ArrowRight') > -1) {                                          //setting input.keys to > -1 basically makes sure that the input exists in our this.keys array
                    this.speed = 20;
                } else if (input.keys.indexOf('ArrowLeft') > -1) {
                    this.speed = -20;
                } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {                   // adding "&& this.onGround" prevents player from double jumping. Can now only jump if standing on ground. Keep in mind, velocity begins negative as it initially goes up, reducing from our set -32 until it reaches 0 at the peak, and then as it falls that value continues to count from zero up into positive integers. When we hit floor, line 80 sets vy back to 0
                    this.vy -= 30;
                } else {
                    this.speed = 0;                                                                  //setting this.speed back to zero after all of these inputs tells player to stop moving once key inputs are no longer pressed, rather than having player continually moving in a direciton forever
                }
                // horizontal movement 
                this.x += this.speed;                                                                  //we are adding this.speed to this.x at all times to control horizontal movement. When this.speed is positive, player will move right. When this.speed is negative, player will move left. > number = higher speed
                if (this.x < 0) this.x = 0;                                                         //creating horizontal boundaries, this line doesnt allow player to move past left boundary
                else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width //line says if players horizontal coordinate is more than gameWidth minus players width(meaning right edge of player rectangle) is touching right edge of canvas area, dont allow it to move past this point
                //vertical movement
                this.y += this.vy;                                                                  //adding velocity to players vertical coordinate
                if (!this.onGround()){                                                              //if this.onGround is false, meaning player is in air, then...(see below line)
                    this.vy += this.weight;                                                         //will take velocity and start gradually adding weight as long as player is in air, thus reducing velocity and bringing back down
                    this.frameY = 0;
                    this.frameX = 2.2;                                                            //this.frameY and this.frameX allow me to switch to different frame in my sprite sheet when player is in air(added jumping mario frame)
                } else {
                    this.vy = 0;                                                                    //if player is not in air, and is back on ground, reset our velocity to 0
                    // this.frameY = 0;
                    // this.frameX = 0.2;                                                           //took out this line because it bypasses our sprite animation above and makes Mario just stand still when on ground
                }
                if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height  //was having issue of player falling through floor, so this creates a vertical boundary to prevent that
           

            }
        }
        onGround(){
            return this.y >= this.gameHeight - this.height;                                     //utility method to check if player is in air or standing on ground. If statement evaluates to true, we know player is standing on solid ground
        }
    }



    class Background {                                                                                          //Background class will handle endleslly scrolling background. Using a single endleslly scrolling layer 
        constructor(gameWidth, gameHeight) {                                                                    //constructor expects gameWidth and gameHeight as arguments
            this.gameWidth = gameWidth;                                                                         //converting gameWidth & gameHeight(line below) into class properties
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');                                            //grabbing our background image off the html by its Id
            this.x = 0;
            this.y = 0;
            this.width = 1500;                                                                                  //this.width & this.height(line below) based on size of my backround image. Sizing it on the page properly
            this.height = 815;
            this.speed = 6;                                                                                    //this.speed will dictate how fast our background scrolls by
        }
        draw(context){                                                                                          //takes context as an argument to specify which canvas we want to draw on
            context.drawImage(this.image, this.x, this.y, this.width, this. height);                            //call built in drawImage method
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this. height);  //to create illusion of endleslly scrolling backgorund, need to draw same image twice. HOWEVER, on this line we add this.width to our this.x, so that our second image is position next to our first one. Then, subtracting this.speed from our this.x helps remove the small gap between where first image ends and next begins. Technically, we never see the full second image, we just see the first part as it fills the gap before the first image resets
        }
        update(){
            this.x -= this.speed;                                                                               //setting our horiznotal coordinate(this.x) to be minus our this.speed will make it scroll to the left
            if(this.x < 0 - this.width) this.x = 0;                                                             //created a reset check. This means, if our background scrolls all the way off screen, set its x position back to zero
        }
    }

    

    class Powerup {
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 60;
            this.height = 60;
            // this.image = document.getElementById("dragonBall")
            this.x = this.gameWidth - 600;                               //should start near middle-right position on  screen
            this.y = this.gameHeight - this.gameHeight;           //should drop from top of screen
            this.frameX = 1;
            this.vy = 0;
            this.weight = 1;                                //so it drops from top of screen   
            this.markedForDeletion = false;
        }
        draw(context){                                                                           //draw method expects context as an argument 
            context.strokeStyle = 'transparent'
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.stroke();
            context.fillStyle = "orange"
            context.fillRect(this.x, this.y, this.width, this.height);
            // context.drawImage(this.image, this.frameX * this.width, 1, this.width, this.height, this.x,     //passing it similar dimension as we did with player to situate our desired sprite in the frame
            // this.y, this.width, this.height); 
        }
        update(){
            this.y += this.vy;                                                                  //adding velocity to players vertical coordinate
            if (!this.onGround()){                                                              //if this.onGround is false, meaning player is in air, then...(see below line)
                this.vy += this.weight;
            } else {
                this.vy = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight + 100;  //this makes dragon ball fall directly through floor so that it doesnt buildup at bottom. Player much catch in air
       
       
            this.y += this.vy;                                                                  //adding velocity to players vertical coordinate
            if (!this.onGround()){                                                              //if this.onGround is false, meaning player is in air, then...(see below line)
                this.vy += this.weight;
            }                                     
           

        }
    
        onGround(){
            return this.y >= this.gameHeight - this.height;                                     //utility method to check if powerup is in air or standing on ground. If statement evaluates to true, we know player is standing on solid ground
        }
    }

    function handleDragonBalls(deltaTime) {                                                  //function is responsible for adding, animating, and removing enemies from the game
        if (ballTimer > ballInterval + randomBallInterval){                           //if enemyTimer is greater than our enemyInterval plus our randomly generated randomEnemyInterval it will push a new Enemy into our enemies array. Basically we have a base enemy interval and a randomly generated interval that get added together, and when our timer reaches that sum it pushes a new Enemy into the array
            dragonBalls.push(new Powerup(canvas.width, canvas.height));                        //taking empty enemies array we defined at the top and pushing into it an instance of Enemy class. We pass it canvas.width and canvas.height so it knows to operate within boundaries of our game
            console.log(dragonBalls);
            randomBallInterval = Math.random() * 10000 + 500;
            ballTimer = 0;                                                              //then set enemyTimer back to 0 so we can start enemy generation process over again
        }else {
            ballTimer += deltaTime;                                                     //else just keep adding deltaTime to our enemyTimer until limit defined in enemyInterval is reached. Using deltaTime like this ensures our events are timed the same on slow and fast computers because faster computers will have lower deltaTime
        }
        dragonBalls.forEach(ball => {                                                      //we want to call our draw method and update method from within our Enemy class for EACH enemy object inside our enemies array
            ball.draw(ctx);
            ball.update(deltaTime);                                                    //pass deltaTime into enemy.update method
        });
        dragonBalls = dragonBalls.filter(ball => !ball.markedForDeletion)
    }
    
    
    
    
    
    
    
    
   
   
   
   
    class Enemy {                                                                //Enemy class will generate enemy object
        constructor(gameWidth, gameHeight){                                      //constructor expects gameWidth & gameHeight as arguments because enemies need to be aware of game area boundaries
            this.gameWidth = gameWidth;                                          //convert gameWidth & gameHeight(line below) to class properties
            this.gameHeight = gameHeight; 
            this.width = 160;                                                    //adjust this.width & this.height to size frame of our enemy sprite
            this.height = 226;
            this.image = document.getElementById('enemyImage');                  //grabbing our enemy sprite from html by Id
            this.x = this.gameWidth;                                             //set enemies x cord to gameWidth so that it is hidden just outside the right edge of the canvas 
            this.y = this.gameHeight - this.height;                              //vertical coord of the enemy is gameHeight minus the height of the enemy
            this.frameX = .75;                                                   //frameX and frameY for navigation within sprite sheet
            this.maxFrame = 2.05;                                                //setting maxFrame so sprite animation can itterate up to this value 
            this.fps = 20;                                                       //to time frame rate with delta time we will need 3 helper properties. (1)fps will effect how fast we swap between individual animation frames in our sprite sheet
            this.frameTimer = 0;                                                 //(2)will count from 0 to frameInterval over and over 
            this.frameInterval = 1000/this.fps;                                  //(3)will define the value we are counting towards, its the value of how many ms each frame lasts
            this.frameY = 0;
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(context){                                                                           //draw method expects context as an argument 
            context.strokeStyle = 'transparent'
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + this.height/2, this.width/2, 0, Math.PI * 2);
            context.stroke();
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x,     //passing it similar dimension as we did with player to situate our desired sprite in the frame
            this.y, this.width, this.height);                                                    //call built in drawImage method and pass this.image as well as dimensions to select frame on sprite sheet, just like we did in Player class 
        }
        update(deltaTime){                                                                       // make sure update method expects deltaTime value
            if (this.frameTimer > this.frameInterval){                                          //begins count
                if (this.frameX >= this.maxFrame) this.frameX = .75;                            //cycles through our sprite sheet beginning at start (frameX = .75, our left foot forward position) and to our frameMax which is set to the right foot goomba. The itteration gives the appearance of goomba stepping in motion, but really its just switching back and forth between two sprite images
                else this.frameX = 2.05;
                this.frameTimer = 0;                                                            //reset back to 0 so it can count again
            } else {
                this.frameTimer += deltaTime;                                                   //else, keep increasing frameTimer by deltaTime
            }
            this.x -= this.speed;                                                //adding this.speed to our the enemies this.x will effect how fast the enemies move horizontally through the game
           

        }
    }

    
    function handleEnemies(deltaTime) {                                                  //function is responsible for adding, animating, and removing enemies from the game
        if (enemyTimer > enemyInterval + randomEnemyInterval){                           //if enemyTimer is greater than our enemyInterval plus our randomly generated randomEnemyInterval it will push a new Enemy into our enemies array. Basically we have a base enemy interval and a randomly generated interval that get added together, and when our timer reaches that sum it pushes a new Enemy into the array
            enemies.push(new Enemy(canvas.width, canvas.height));                        //taking empty enemies array we defined at the top and pushing into it an instance of Enemy class. We pass it canvas.width and canvas.height so it knows to operate within boundaries of our game
            console.log(enemies);
            randomEnemyInterval = Math.random() * 3000 + 500;
            enemyTimer = 0;                                                              //then set enemyTimer back to 0 so we can start enemy generation process over again
        }else {
            enemyTimer += deltaTime;                                                     //else just keep adding deltaTime to our enemyTimer until limit defined in enemyInterval is reached. Using deltaTime like this ensures our events are timed the same on slow and fast computers because faster computers will have lower deltaTime
        }
        enemies.forEach(enemy => {                                                      //we want to call our draw method and update method from within our Enemy class for EACH enemy object inside our enemies array
            enemy.draw(ctx);
            enemy.update(deltaTime);                                                    //pass deltaTime into enemy.update method
        });
        enemies = enemies.filter(enemy => !enemy.markedForDeletion)
    };

    function displayStatusText(context) {                                              //utility function that handles things like score and "gameover" message
       //score display
        context.fillStyle = "orange";
        context.textAlign = "left";
        context.font = "40px helvetica";
        context.fillText('Score: ' + score, 20, 50);
        context.fillStyle = "blue";
        context.font = "40px helvetica";
        context.fillText('Score: ' + score, 20, 52);
      //dragonBallCounter display
        context.fillStyle = "blue";
        context.font = "40px helvetica";
        context.fillText('Dragon Balls: ' + dragonBallCounter, 20, 100);
        context.fillStyle = "orange";
        context.font = "40px helvetica";
        context.fillText('Dragon Balls: ' + dragonBallCounter, 20, 102);

        //superSaiyan mode display
        if (dragonBallCounter > 1 && dragonBallCounter % 7 === 0){
            context.textAlign = "center";
            context.fillStyle = "black";
            context.fillText("POWER LEVEL OVER 9000!", canvas.width/2 + 2, 250);
            context.textAlign = "center";
            context.fillStyle = "black";
            context.fillText("POWER LEVEL OVER 9000!", canvas.width/2 + 2, 252);
            context.textAlign = "center";
            context.fillStyle = "black";
            context.fillText("POWER LEVEL OVER 9000!", canvas.width/2 + 2, 254);
            context.textAlign = "center";
            context.fillStyle = "yellow";
            context.fillText("POWER LEVEL OVER 9000!", canvas.width/2 + 2, 256);
        };
        if (gameOver){
            context.textAlign = "center";
            context.fillStyle = "black";
            context.fillText("GAME OVER!", canvas.width/2 + 2, 300);            //all of this is simply to display GAME OVER! in the middle of the screen when you die
            context.textAlign = "center";
            context.fillStyle = "red";
            context.fillText("GAME OVER!", canvas.width/2 + 2, 302);           //added duplicate with diffenet color on top and slighly offset to give sort of shadow effect
            
            context.textAlign = "center";
            context.fillStyle = "orange";
            context.fillText(`Final Score: ${score}`, canvas.width/2 + 2, 400);
            context.textAlign = "center";
            context.fillStyle = "blue";
            context.fillText(`Final Score: ${score}`, canvas.width/2 + 2, 402);
            
            context.textAlign = "center";
            context.fillStyle = "#6F2DA8";
            context.fillText('Game over. Click anywhere to play again!', canvas.width/2 + 2, 500);
            context.textAlign = "center";
            context.fillStyle = "#FF00FF";
            context.fillText('Game over. Click anywhere to play again!', canvas.width/2 + 2, 503);
            context.textAlign = "center";
            context.fillStyle = "#C21807";
            context.fillText('Game over. Click anywhere to play again!', canvas.width/2 + 2, 506);
            context.textAlign = "center";
            context.fillStyle = "#F9812A";
            context.fillText('Game over. Click anywhere to play again!', canvas.width/2 + 2, 509);
            context.textAlign = "center";
            context.fillStyle = "#FFD300";
            context.fillText('Game over. Click anywhere to play again!', canvas.width/2 + 2, 512);
        }
    }
    
        canvas.onclick = function () {
                if (gameOver === true)                                      //if gameOver is true, clicking anywhere on the canvas will run start() aka restarting the game
                start();
        };
 
        
    const input = new InputHandler();                                           //instance of InputHandler class that will run all code inside constructor, so at this point the eventListener "keydown" is applied
    const player = new Player(canvas.width, canvas.height);                     //instance of Player class. Our constuctor expects a gameWidth and gameHeight as arguments, so we will pass it the canvas.width and canvas.height we specified at the top. This keeps our player inside our canvas boundaries
    const background = new Background(canvas.width, canvas.height);             //instance of Background class. I passed it our game dimension, canvas.width & canvas.height
                       
    
    let lastTime = 0;                                                           //helper variable which will hold the value of timeStamp fom the previous animation frame
    let enemyTimer = 0;                                                         //helper variable to assist in timing periodically with deltaTime. Will count ms from 0 to a certain limit(enemyInterval below), and everytime it reaches that limit it will trigger something and reset itself back to 0
    let enemyInterval = 300;                                                   //helper variable to assist in timing periodically with deltaTime. Will be the time limit for enemyTimer(above)
    let randomEnemyInterval = Math.random() * 1000 + 500;                       //this created a random interval whihc we will add to our enemyInterval, thus creating random spawn times for our enemies

   let ballTimer = 0;
   let ballInterval = 1000;
   let randomBallInterval = Math.random() * 1000 + 500;
   
   
   
    function animate(timeStamp){                                               // will run 60 x per second updating and drawing our game over and over 
        const deltaTime = timeStamp - lastTime                                 //deltaTime is the difference in ms between timeStamp from current loop and timeStamp from previous loop. (timeStamp value is generated in our requestAnimationFrame(animate) method.)  The value of deltaTime tells us how many ms our computer needs to serve one animation frame
        lastTime = timeStamp;                                                  //then set lastTime to timeStamp so it can be used in the next loop as the value of timeStamp from the previous loop
        ctx.clearRect(0,0,canvas.width, canvas.height);                        //To show only current animation frame. This built in method will delete whole canvas between each animation loop. This prevents the canvas from leaving a trail, instead showing only current frame
        background.draw(ctx);                                                  //since we are drawing everything on a single canvas element(ctx), we have to draw our background before player and enemies, so that they are visible on top of background
        background.update();                                                   //call background.update inside our animation loop so our background animation will scroll
        player.draw(ctx);                                                      // this displays player by calling our "draw" method we wrote above. It expects "context" as an argument, so we pass it our "ctx" from the top 
        player.update(input, deltaTime, enemies, dragonBalls);                                       // call our update method. Passing in input for key commands and deltaTime for animation
        handleEnemies(deltaTime);                                              //call handle enemies function from inside animation loop, pass it deltaTime because we are using it to trigger periodic events(enemy generation)
        handleDragonBalls(deltaTime);
        displayStatusText(ctx);

        if (!gameOver) requestAnimationFrame(animate);                         //built in method to make everything in our animate function loop. Pass in "animate", the name of its parent function, to make endless animation loop. Only runs if gameOver is false, meaning mario is still alive
    }
    animate(0);                                                                  //call animate function to start endless loop. Pass it 0 since it is not being passed timeStamp from requestAnimationFrame(animate) method

});

