window.onload = function () {
  const restarting = sessionStorage.getItem("restarting");
  if (restarting) {
    sessionStorage.removeItem("restarting");
    startHandler();
  } else {
    const start = document.querySelector(".start");

    start.addEventListener(
      "click",
      () => {
        startHandler();
      },
      { once: true }
    );
  }
  const restart = document.querySelector(".restart");
  restart.addEventListener("click", () => {
    sessionStorage.setItem("restarting", "true");
    location.reload();
  });
};

let scoreboard = [];

async function getScoreboard() {
  let url = "https://gram-arcade.herokuapp.com/supermat/scoreboard";
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
const startHandler = () => {
  const grid = document.querySelector(".grid");

  const supermat = document.createElement("div");
  let startPoint = 150;
  let supermatLeftSpace = 50;
  let supermatBottomSpace = startPoint;
  let isGameOver = false;
  let classesCount = 4;
  let progClasses = [];

  let mateCount = 1;
  let mateArr = [];

  let meetingCount = 1;
  let meetingArr = [];

  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  function createSupermat() {
    grid.appendChild(supermat);
    supermat.classList.add("supermat");
    supermatLeftSpace = progClasses[0].left;
    supermat.style.left = supermatLeftSpace + "px";
    supermat.style.bottom = supermatBottomSpace + "px";
  }

  class ProgClass {
    constructor(newProgClassBottom) {
      this.bottom = newProgClassBottom;
      this.left = Math.random() * 370;
      this.visual = document.createElement("div");
      const visual = this.visual;
      visual.classList.add("progClass");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      function changeBackgroundImage() {
        const images = [
          'url("./Prog_logos/1.png")',
          'url("./Prog_logos/2.png")',
          'url("./Prog_logos/3.png")',
          'url("./Prog_logos/4.png")',
          'url("./Prog_logos/5.png")',
          'url("./Prog_logos/6.png")',
          'url("./Prog_logos/7.png")',
          'url("./Prog_logos/8.png")',
          'url("./Prog_logos/9.png")',
          'url("./Prog_logos/10.png")',
          'url("./Prog_logos/11.png")',
          'url("./Prog_logos/12.png")',
          'url("./Prog_logos/13.png")',
        ];

        const background = images[Math.floor(Math.random() * images.length)];
        visual.style.backgroundImage = background;
      }
      setInterval(changeBackgroundImage, 2000);
      grid.appendChild(visual);
    }
  }
  function createProgClass() {
    for (let i = 0; i < classesCount; i++) {
      let progClassGap = 700 / classesCount;
      let newProgClassBottom = 100 + i * progClassGap;
      let newProgClass = new ProgClass(newProgClassBottom);
      progClasses.push(newProgClass);
      // console.log(progClasses);
    }
  }
  function moveProgClasses() {
    if (supermatBottomSpace > 200) {
      progClasses.forEach((pclass) => {
        pclass.bottom -= 4;
        let visual = pclass.visual;
        visual.style.bottom = pclass.bottom + "px";
        if (pclass.bottom < 10) {
          let firstProgClass = progClasses[0].visual;
          firstProgClass.classList.remove("progClass");
          progClasses.shift();
          score++;
          // console.log(progClasses);
          let newProgClass = new ProgClass(700);
          progClasses.push(newProgClass);
        }
      });
    }
  }

  function createLivescore() {
    document.getElementById("livescore").innerHTML = score;
  }

  class Mate {
    constructor(newMateBottom) {
      this.bottom = newMateBottom;
      this.left = Math.random() * 390;
      this.visual = document.createElement("div");
      const visual = this.visual;
      visual.classList.add("mate");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }
  function createMate() {
    for (let i = 0; i < mateCount; i++) {
      let mateGap = 3600 / mateCount;
      let newMateBottom = 850 + i * mateGap;
      let newMate = new Mate(newMateBottom);
      mateArr.push(newMate);
      // console.log(mateArr);
    }
  }
  function moveMate() {
    if (supermatBottomSpace > 200) {
      mateArr.forEach((m) => {
        m.bottom -= 4;
        let visual = m.visual;
        visual.style.bottom = m.bottom + "px";
        if (m.bottom < 10) {
          let firstmate = mateArr[0].visual;
          firstmate.classList.remove("mate");
          mateArr.shift();
          score++;
          // console.log(mateArr);
          let newMate = new Mate(1400);
          mateArr.push(newMate);
        }
      });
    }
  }

  class Meeting {
    constructor(newMeetingBottom) {
      this.bottom = newMeetingBottom;
      this.left = Math.random() * 390;
      this.visual = document.createElement("div");
      const visual = this.visual;
      visual.classList.add("meeting");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }
  function createMeeting() {
    for (let i = 0; i < meetingCount; i++) {
      let meetingGap = 1400 / meetingCount;
      let newMeetingBottom = 1400 + i * meetingGap;
      let newMeeting = new Meeting(newMeetingBottom);
      meetingArr.push(newMeeting);
      // console.log(meetingArr);
    }
  }
  function moveMeeting() {
    if (supermatBottomSpace > 200) {
      meetingArr.forEach((meet) => {
        meet.bottom -= 4;
        let visual = meet.visual;
        visual.style.bottom = meet.bottom + "px";
        if (meet.bottom < 10) {
          let firstmeeting = meetingArr[0].visual;
          firstmeeting.classList.remove("meeting");
          meetingArr.shift();
          let newMeeting = new Meeting(2100);
          meetingArr.push(newMeeting);
        }
      });
    }
  }

  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(function () {
      supermatBottomSpace += 20;
      supermat.style.bottom = supermatBottomSpace + "px";
      if (supermatBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30);
  }
  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(function () {
      supermatBottomSpace -= 5;
      supermat.style.bottom = supermatBottomSpace + "px";
      if (supermatBottomSpace <= 0) {
        gameOver();
      }
      progClasses.forEach((pclass) => {
        if (
          supermatBottomSpace >= pclass.bottom &&
          supermatBottomSpace <= pclass.bottom + 25 &&
          supermatLeftSpace + 70 >= pclass.left &&
          supermatLeftSpace <= pclass.left + 100 &&
          !isJumping
        ) {
          // console.log("landed");
          startPoint = supermatBottomSpace;
          jump();
        }
      });
      mateArr.forEach((m) => {
        if (
          supermatBottomSpace >= m.bottom &&
          supermatBottomSpace <= m.bottom + 35 &&
          supermatLeftSpace + 70 >= m.left &&
          supermatLeftSpace <= m.left + 35 &&
          !isJumping
        ) {
          // console.log("got a mate");
          startPoint = supermatBottomSpace + 200;
          jump();
        }
      });
      meetingArr.forEach((meet) => {
        if (
          supermatBottomSpace >= meet.bottom &&
          supermatBottomSpace <= meet.bottom + 25 &&
          supermatLeftSpace + 70 >= meet.left &&
          supermatLeftSpace <= meet.left + 125 &&
          !isJumping
        ) {
          // console.log("stuck in a meeting");
          startPoint = supermatBottomSpace - 150;
          score -= 1;
          jump();
        }
      });
    }, 30);
  }
  function gameOver() {
    // console.log("game over");
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    const scoreForm = document.createElement("FORM");
    scoreForm.setAttribute("id", "myForm");
    grid.appendChild(scoreForm);

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
        let url = `https://gram-arcade.herokuapp.com/supermat/newscoreboard/${scoreInput.value}/${score}`;
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

    isGameOver = true;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function control(e) {
    supermat.style.bottom = supermatBottomSpace + "px";
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveStraight();
    }
  }

  function moveLeft() {
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);

    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(function () {
      if (supermatLeftSpace >= 0) {
        supermatLeftSpace -= 5;
        supermat.style.left = supermatLeftSpace + "px";
      } else {
        moveRight();
      }
    }, 30);
  }
  function moveRight() {
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);

    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(function () {
      if (supermatLeftSpace <= 430) {
        supermatLeftSpace += 5;
        supermat.style.left = supermatLeftSpace + "px";
      } else {
        moveLeft();
      }
    }, 30);
  }

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function start() {
    if (!isGameOver) {
      createProgClass();
      createSupermat();
      moveProgClasses();
      createMate();
      moveMate();
      setInterval(moveMate, 35);
      createMeeting();
      moveMeeting();
      setInterval(moveMeeting, 35);
      setInterval(moveProgClasses, 35);
      jump();
      document.getElementById("yourscore").innerHTML = "Your Score";
      createLivescore();
      setInterval(createLivescore, 0.1);
      document.addEventListener("keydown", control);
    }
  }
  start();
};
