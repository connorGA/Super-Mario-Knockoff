# Super Mario Saiyans
A classic 2D sidescroller with a twist. Navigate Mario through an oncoming stream of enemy Goombas. If you are skilled enough to collect all 7 Dragon Balls, Mario will turn Super Saiyan!

# How to Play
Navigate Mario through the game using the left, right, and up arrow keys.<br> 
Left and right arrow keys will move Mario horizontally.<br>
Up arrow key allows Mario to jump.<br>
In order to kill enemy Goombas, jump and land directly on their head.<br>
In order for Mario to go Super Saiyan, collect all 7 Dragon Balls. Keep in mind, once Mario is holding 7 Dragon Balls, catching another will restart the count.

# Instillation Instructions
In order to play, click the link below:
Play Game - https://connorga.github.io/Super-Mario-Knockoff/

# Wireframe 
![](./images/Mario-Knockoff-Page-1%20(2).jpg)
![](./images/Mario-Knockoff-Page-2%20(1).jpg)






# Technologies
1. HTML5
2. CSS
3. JavaScript

# HTML
```
```
HTML Corresponding to Home Screen
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Mario Saiyans</title>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="homePageStyle.css">
</head>
<body>
    <div id ="startScreen">
            <h1><span id="blue">S</span><span id="yellow">U</span><span id="red">P</span><span id ="green">E</span><span id="yellow">R</span> <span id="red">M</span><span id="green">A</span><span id="yellow">R</span><span id="blue">I</span><span id="green">O</span><br>  <span id="saiyan">SAIYANS</span></h1>
        <div class = "Objective">
            <h3>Objective</h3>
                <p class = "text">The Goombas are coming!<br>
                    Navigate Mario through a constant stream of oncoming Goombas.<br>
                    Jump on an enemy Goomba's head to earn points and take them out.<br>
                    Be careful though, a head on collision will result in GAME OVER. <br>
                    If you are skilled enough to catch the falling Dragon Balls, great power awaits. <br>
                    Collect all 7 Dragon Balls and Mario will go Super Saiyan!
                </p>
        </div>
        <div class = "controls">
            <h3>Controls</h3>
                <p class = "text">Move Mario horizontally with left and right arrow keys.<br> 
                                Jump by pressing up arrow.<br>
                                When holding all 7 Dragon Balls Mario will have invincibility!
                </p>
        </div>
        <div class = "link">
        <a href="canvas.html">Lets Play</a>
        </div>

        
        <img src="./start screen characters.png" alt="">
        
    </div>
</body>
</html>

```

```
```
HTML Handling Canvas
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
    <title>Super Mario Saiyans</title>
    <link rel="stylesheet" href="canvasStyle.css">
</head>
<body>
    
    <div class = "game">
        <canvas id="canvas1"></canvas>
        <img src="./mario sprites.png" id = "playerImage" alt="player-sprites" style="display: none">
        <img src="./3 Goomba sprite sheet (2).png" id = "enemyImage" alt="enemy-sprites" style="display: none">
        <img src="./Screen Shot 2022-07-24 at 1.59.05 PM.png" id = "backgroundImage" alt="level" style="display: none">
        <img src="./super-saiyans.png" id = "super-saiyans" alt = "power-up-player-sprite" style="display: none">
        <img src="./dragon ball png.png" id ="dragonBall" alt = "power-up-sprite" style="display: none;">
        
    </div>
    <script src="app.js">


    </script>
</body>
</html>

```

# CSS
```
```
CSS styleSheet for Home Page
```
body {
    
    text-align: center;
    background-image: url(./Super_Mario_Clouds.gif);
    background-size: cover;
}

h1 {
    font-family: 'Press Start 2P', cursive;
    font-size: 70px;
}
     
#blue {
    color: rgb(26, 175, 229);
}

#yellow {
    color: rgb(255, 208, 0);
}

#red {
    color: rgb(207, 19, 19);
}

#green {
    color: rgb(19, 167, 19);
}

#saiyan {
    color: rgb(243, 115, 10);
}

h3 {
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 40px;
    color: rgb(100, 47, 47);
}

.text {
    font-size: 25px;
    color: rgb(8, 10, 24);

}

.link {
    font-size: 30px;
    margin-top: 80px;
}


```

```
```
CSS styleSheet for Canvas
```
body {
    background: black;
}

   
   
#canvas1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 5px solid white;
}

#playerImage, #backgroundImage, #enemyImage {     
    display: none;                                 
}
```


# JavaScript
code snippet

# Unsolved Problems for Future Development
I have a sprite sheet created that displays the player sprite(Mario) with blonde Super Saiyan hair. Sizing the sprite was an issue, so for now it was left off. I plan to get it inserted properly so that when player collects 7 Dragon Balls, the player sprite becomes the Super Saiyan itteration of Mario.

I would also like to add some updates to the power ups. Including a timer on the Super Siayan mode and adding some randomeness to where the Dragon Balls drop would make the game more challenging.