let scoreboard = [];

async function getScoreboard() {
  let url = "https://gram-arcade.herokuapp.com//wonderkarla/scoreboard";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
getScoreboard().then((res) => res.map((r) => scoreboard.push(r)));
console.log(scoreboard);

setTimeout(() => {
  const scoreList = document.querySelector("#scoreboard");

  console.log(scoreList);
  let nodes = scoreboard.map((score) => {
    let li = document.createElement("li");
    li.textContent = `${score.name} (${score.score})`;
    return li;
  });

  scoreList.append(...nodes);
}, 500);

kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 100, 0.1],
});

{
  /* <a href="https://imgbb.com/"><img src="https://i.ibb.co/MSYv0sW/supermat-d.png" alt="supermat-d" border="0"></a> 
	REACT blue<a href="https://imgbb.com/"><img src="https://i.ibb.co/PTQStFY/reactjs-logo.png" alt="reactjs-logo" border="0"></a>
	REACT RED <a href="https://imgbb.com/"><img src="https://i.ibb.co/tmMjn9S/1-JSFjofdj-IH5-RDVf-q-OODGw.png" alt="1-JSFjofdj-IH5-RDVf-q-OODGw" border="0"></a>
	REDUX <a href="https://ibb.co/X43ffQ8"><img src="https://i.ibb.co/QcC77gd/redux-logo.png" alt="redux-logo" border="0"></a>
	CODAISSEUR LOGO<a href="https://imgbb.com/"><img src="https://i.ibb.co/LZBZBdQ/codaisseur-square.png" alt="codaisseur-square" border="0"></a>
	JS LOGO <a href="https://imgbb.com/"><img src="https://i.ibb.co/9gKw5x1/js-logo.png" alt="js-logo" border="0"></a>
	DB LOGO <a href="https://ibb.co/Zhv72T0"><img src="https://i.ibb.co/FBcCH7F/database-logo.png" alt="database-logo" border="0"></a>
	WONDER KARLA <a href="https://imgbb.com/%22%3E<img src="https://i.ibb.co/m53MVbh/Wonder-Karla.png" alt="Wonder-Karla" border="0"></a>
  	HTML LOGO <a href="https://imgbb.com/%22%3E<img src="https://i.ibb.co/hWp15d8/HTML5-Badge-svg.png" alt="HTML5-Badge-svg" border="0"></a>
  	CSS LOGO <a href="https://imgbb.com/%22%3E<img src="https://i.ibb.co/wWwCrCS/CC3-Badge.png" alt="CC3-Badge" border="0"></a>
  	DISCORD LOGO <a href="https://imgbb.com/"><img src="https://i.ibb.co/1d9pK3d/discord-logo.png" alt="discord-logo" border="0"></a>*/
}

const MOVE_SPEED = 120;
const JUMP_FORCE = 360;
const BIG_JUMP_FORCE = 550;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
let isJumping = true;
const FALL_DEATH = 400;

const ENEMY_SPEED = 20;

loadSprite("WONDER KARLA", "https://i.ibb.co/m53MVbh/Wonder-Karla.png");

loadSprite(
  "evil-react",
  "https://i.ibb.co/tmMjn9S/1-JSFjofdj-IH5-RDVf-q-OODGw.png"
);
loadSprite("codaisseur-logo", "https://i.ibb.co/LZBZBdQ/codaisseur-square.png");
loadSprite("evil-redux", "https://i.ibb.co/QcC77gd/redux-logo.png");
loadSprite("good-react", "https://i.ibb.co/PTQStFY/reactjs-logo.png");
loadSprite("block", "https://i.ibb.co/9gKw5x1/js-logo.png");
loadSprite("DB-pipe", "https://i.ibb.co/FBcCH7F/database-logo.png");

loadSprite("html-block", "https://i.ibb.co/hWp15d8/HTML5-Badge-svg.png");
loadSprite("css-block", "https://i.ibb.co/wWwCrCS/CC3-Badge.png");
loadSprite("surprise", "https://i.ibb.co/1d9pK3d/discord-logo.png");

// loadRoot("./sounds/");
// loadSound("pointSound", "pointSound.mp3");

loadRoot("https://i.imgur.com/");
loadSprite("brick", "pogC9x5.png");
loadSprite("unboxed", "bdrLpi6.png");
loadSprite("blue-steel", "gqVoI2b.png");

const actionRockAudio = new Audio("sounds/actionRockAudio.mp3");
const hero911Audio = new Audio("sounds/hero911Audio.mp3");
const cheekyAudio = new Audio("sounds/cheekyAudio.mp3");
const funAudio = new Audio("sounds/funAudio.mp3");

const pointSound = new Audio("sounds/pointSound.mp3");
const growSound = new Audio("sounds/growSound.mp3");
const jumpRetro = new Audio("sounds/jumpRetro.mp3");
const respawnSound = new Audio("sounds/respawnSound.mp3");
const stampSound = new Audio("sounds/stampSound.mp3");
const painSound = new Audio("sounds/painSound.mp3");
const monsterGrowl = new Audio("sounds/monsterGrowl.mp3");
const bounce = new Audio("sounds/bounceSound.mp3");

scene("game", ({ level, score, levelNumber }) => {
  layers(["bg", "obj", "ui"], "obj");

  const maps = [
    [
      "                                                                                            ",
      "                                                                                            ",
      "                                                                                            ",
      "  *                                                                                        ",
      "              %       *%                      *      %                   %                       ",
      "      p                                                                                        ",
      "             ^                  ^                                                             ",
      "     ===    ====    ====       ==      =   ===$   ===    ==%*   =    =  ===                        ",
      "   ==      =    =   =  ==     =  =        =$  =  =$  =   =      =    =  =  =                       ",
      "   =      =      =  =   =     =  =$    =  =$     =$      =      =    =  =   =                      ",
      "  =*      =      =  =    =   =    =    =   =      =      =      =    =  =   =                      ",
      "  =       =      =  =    =   ======    =    ==     ==    =%=*   =    =  ====                       ",
      "  =       =      =  =    =  =      =   =      =      =   =      =  z =  =  =       %                ",
      "   = ^    =      =  =   =   =      =   =       =      =  =      =    =  =   =          p           ",
      "   ==      =  z =   =  ==  =        =  =  =   =   =  =   =       =  =   =   =                      ",
      "     ===    ====    ====   =        =  =   ===     ===   =====    ==    =    =  ===========*        ",
      "                                                                                                   ",
      "                                                                                                   ",
      "                                               ==== == == == == == == == == ====          ====      ",
    ],
    [
      "                                 ",
      "                                      ",
      "                    ^                 ",
      "                  hhhh                 ",
      "                h                     ",
      "     %                                ",
      "         h*h%h                             ",
      "   p                         *   p       ",
      "                   ^   ^                ",
      "hhhhhhhhh      hhhhhhhhhh   hhhhhhhh",
      "         hhhh                         ",
    ],
    [
      "c                                         c",
      "c                         %%%%*%          c",
      "c                                         c",
      "c                %%%%%%                   c",
      "c                                         c",
      "c        %%%%%*              x x          c",
      "c                          x x x          c",
      "c    p                    x x x x  x  p   c",
      "c               z   z  x x x x x  x       c",
      "ccccccccccccccccccccccccccccccccccccccccccc",
    ],
  ];

  const audios = [funAudio, actionRockAudio, hero911Audio];
  // const audiosPause = [funAudio, actionRockAudio, hero911Audio];

  level > 0 && levelNumber <= audios.length && audios[level - 1].pause();
  levelNumber <= audios.length && audios[level].play();

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("block"), scale(0.05), solid()],
    h: [sprite("html-block"), scale(0.03), solid()],
    c: [sprite("css-block"), scale(0.04), solid()],
    "^": [sprite("evil-react"), solid(), scale(0.08), "dangerous", body()],
    "#": [sprite("good-react"), solid(), scale(0.05), "good-react", body()],
    z: [sprite("evil-redux"), solid(), scale(0.03), "dangerous", body()],
    $: [sprite("codaisseur-logo"), solid(), scale(0.04), "codaisseur-logo"],
    "%": [sprite("surprise"), solid(), "CD-surprise", scale(0.04)],
    "*": [sprite("surprise"), solid(), "react-surprise", scale(0.04)],
    "}": [sprite("unboxed"), solid()],

    p: [sprite("DB-pipe"), solid(), scale(0.05), "DB-pipe"],
    x: [sprite("blue-steel"), solid(), scale(0.5)],
  };

  const gameLevel = addLevel(maps[level], levelCfg);

  const scoreLabel = add([
    text(score),
    pos(80, 20),
    layer("ui"),
    {
      value: score,
    },
  ]);

  const levelLabel = add([
    text(levelNumber),
    pos(80, 6),
    layer("ui"),
    {
      value: levelNumber,
    },
  ]);

  add([text("Score "), pos(30, 20)]);
  add([text("Level "), pos(30, 6)]);

  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        cheekyAudio.pause();
        levelNumber > 3 ? audios[2].play() : audios[level].play();

        this.scale = vec2(0.05);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        levelNumber > 3 ? audios[2].pause() : audios[level].pause();
        audios[level].pause();
        cheekyAudio.play();

        this.scale = vec2(0.1);
        timer = time;
        isBig = true;
      },
    };
  }

  const player = add([
    sprite("WONDER KARLA"),
    solid(),
    pos(100, 0),
    body(),
    big(),
    origin("bot"),
    scale(0.05),
  ]);

  player.action(() => {
    camPos(player.pos);
    camScale(1.8);
  });

  function respawn_evil() {
    let new_pos = rand(130, width());
    new_pos = Math.floor(new_pos);

    randomEvil = add([
      "dangerous",
      sprite("evil-redux"),
      solid(),
      pos(new_pos, 0),
      body(),
      scale(0.03),
    ]);
  }

  const loopTime = 10 / levelNumber;
  loop(loopTime, () => {
    console.log(loopTime);
    monsterGrowl.play();
    respawn_evil();
  });

  player.collides("DB-pipe", () => {
    keyPress("down", () => {
      respawnSound.play();
      levelLabel.value++;
      levelLabel.text = levelLabel.value;
      go("game", {
        level: (level + 1) % maps.length,
        score: scoreLabel.value,
        levelNumber: levelNumber + 1,
      });
    });
  });

  action("good-react", (m) => {
    m.move(20, 0);
  });

  player.on("headbump", (obj) => {
    bounce.play();
    if (obj.is("CD-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("react-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });

  player.collides("good-react", (m) => {
    destroy(m);
    camShake(25);
    growSound.play();
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
    player.biggify(6);
  });

  player.collides("codaisseur-logo", (c) => {
    destroy(c);
    pointSound.play();
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  });

  action("dangerous", (d) => {
    d.move(-ENEMY_SPEED, 0);
  });

  player.collides("dangerous", (d) => {
    if (isJumping || player.isBig()) {
      stampSound.play();
      camShake(20);
      scoreLabel.value++;
      scoreLabel.text = scoreLabel.value;
      destroy(d);
    } else {
      painSound.play();
      go("lose", { score: scoreLabel.value, levelNumber: levelLabel.value });
      console.log("scoreLabel.value", scoreLabel.value);
    }
  });

  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      painSound.play();
      go("lose", { score: scoreLabel.value, levelNumber: levelLabel.value });
    }
  });

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  });

  keyPress("space", () => {
    if (player.grounded()) {
      jumpRetro.play();
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
});

scene("lose", ({ score, levelNumber }) => {
  add([
    text(`Score ${score}`, 32),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  add([
    text(`Level ${levelNumber}`, 32),
    origin("center"),
    pos(width() / 2, height() / 2 - 50),
  ]);
  keyPress("space", () => {
    go("game", { level: 0, score: 0, levelNumber: 1 });
  });

  const canvas = document.getElementById("game-canvas");
  console.log(canvas);

  const scoreForm = document.createElement("FORM");
  scoreForm.setAttribute("id", "myForm");
  canvas.appendChild(scoreForm);

  const msgToPlayer = document.createElement("p");
  msgToPlayer.setAttribute("id", "msgToPlayer");
  const textMsg = document.createTextNode(
    "Please enter your name to be added to the scoreboard"
  );
  msgToPlayer.appendChild(textMsg);
  document.getElementById("myForm").appendChild(msgToPlayer);

  const scoreInput = document.createElement("INPUT");
  scoreInput.setAttribute("type", "text");
  scoreInput.setAttribute("value", "");
  document.getElementById("myForm").appendChild(scoreInput);

  const submitButton = document.createElement("BUTTON");
  submitButton.setAttribute("type", "submit");
  const buttonName = document.createTextNode("Submit");
  submitButton.appendChild(buttonName);
  document.getElementById("myForm").appendChild(submitButton);

  submitButton.onclick = async function (event) {
    event.preventDefault();
    if (scoreInput.value.length < 3) {
      return alert("Name has to have at least 3 characters");
    } else {
      let url = `https://gram-arcade.herokuapp.com//wonderkarla/newscoreboard/${scoreInput.value}/${score}`;
      try {
        await fetch(url, {
          method: "POST",
        });
      } catch (error) {
        console.log(error);
      }
      location.reload();
    }
  };
  document.getElementById("myForm").appendChild(submitButton);
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("start-button").addEventListener("click", startGame);
  document
    .getElementById("restart-button")
    .addEventListener("click", restartGame);
});

function startGame() {
  console.log("start-game click");
  start("game", { level: 0, score: 0, levelNumber: 1 });
}
function restartGame() {
  go("game", { level: 0, score: 0, levelNumber: 1 });
}

function quitGame() {
  console.log("quit-game click");
}
