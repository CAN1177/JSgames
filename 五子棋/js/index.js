var over = false; //表示下棋结束

// 储存棋盘落子情况
var chassBoard = [];
for (var i = 0; i < 15; i++) {
  chassBoard[i] = [];
  for (var j = 0; j < 15; j++) {
    chassBoard[i][j] = 0;
  }
}

// 黑棋先手
var me = true;

// 棋盘的绘制
var chass = document.getElementById("chassboard");
var context = chass.getContext("2d");
context.strokeStyle = "#333";
for (var i = 0; i < 15; i++) {
  context.moveTo(20 + i * 40, 20);
  context.lineTo(20 + i * 40, 580);
  context.moveTo(20, 20 + i * 40);
  context.lineTo(580, 20 + i * 40);
  context.stroke();
}

// window.onload = function () {
//   oneStep(0, 0, true);
//   oneStep(2, 2, false);
//   oneStep(10, 10, true);
//   oneStep(9, 9, false);
// };

var oneStep = function (i, j, me) {
  // i,j 为索引，me代表黑白棋
  // 棋子的绘制
  context.beginPath();
  context.arc(20 + i * 40, 20 + j * 40, 17, 0, 2 * Math.PI);
  context.closePath();
  var gradient = context.createRadialGradient(
    20 + i * 40 + 2,
    20 + j * 40 - 2,
    17,
    20 + i * 40 + 2,
    20 + j * 40 - 2,
    0
  ); // 参数从左到右表示第一个圆的圆心半径和第二个圆的圆心和半径
  if (me) {
    // 表示黑棋
    gradient.addColorStop(0, "#0a0a0a");
    gradient.addColorStop(1, "#636766");
  } else {
    gradient.addColorStop(0, "#D1d1d1");
    gradient.addColorStop(1, "#f9f9f9");
  }

  context.stroke();
  context.fillStyle = gradient;
  context.fill();
};

// 棋盘点击落子事件
chass.onclick = function (e) {
  if (over) {
    return;
  }
  if (!me) { // 判断是否为我方下棋
    return
  }
  var X = e.offsetX,
    Y = e.offsetY;
  var i = Math.floor(X / 40);
  var j = Math.floor(Y / 40);
  console.log(i, j);
  if (chassBoard[i][j] == 0) {
    oneStep(i, j, me);
    chassBoard[i][j] = 1;
  
    for (var k = 0; k < count; k++) {
      if (wins[i][j][k]) {
        myWin[k]++;
        opponentWin[k] = 6; //异常情况，五个子之外
        if (myWin[k] == 5) {
          setTimeout(function () {
            window.alert("你赢了!");
          }, 100);
          over = true;
        }
      }
    }
    if(!over) {
      computerAI()
      me = !me;
    }
  }
};

// 计算机AI
var computerAI = function() {
  var max = 0;
  var u=0,v=0;
  var myScore =[]
  var computerScore =[]
  for(var i = 0; i < 15; i++) { // 初始化二维数组
    myScore[i]=[];
    computerScore[i]=[];
    for(var j = 0; j < 15; j++) {
      myScore[i][j]=0;
      computerScore[i][j]=0;
    }
  }

  // 遍历整个棋盘
  for(var i = 0; i < 15; i++) {
    for(var j = 0; j < 15; j++) {
      if (chassBoard[i][j]==0) {
        for(var k = 0; k < count; k++) {
          if (wins[i][j][k]) {
            if ( myWin[k]==1) {
              myScore[i][j]+= 200;
            }else if (myWin[k]==2) {
              myScore[i][j]+= 400;
            }else if (myWin[k]==3) {
              myScore[i][j]+= 2000;
            }else if (myWin[k]==4) {
              myScore[i][j]+= 10000;
            } 

            
            // 修改难易程度只需修改权重（计算机的得分）
            if ( opponentWin[k]==1) {
              computerScore[i][j]+= 220;
            }else if (opponentWin[k]==2) {
              computerScore[i][j]+= 420;
            }else if (opponentWin[k]==3) {
              computerScore[i][j]+= 2100;
            }else if (opponentWin[k]==4) {
              computerScore[i][j]+= 20000;
            }
          }
        }

        if ( myScore[i][j] > max) {
            max = myScore[i][j];
            u=i;
            v=j;
        }else if ( myScore[i][j] == max) {
          if (computerScore[i][j]> computerScore[u][v]) {
            u=i;
            v=j;
          }
        }

        if ( computerScore[i][j] > max) {
          max = computerScore[i][j];
          u=i;
          v=j;
      }else if ( computerScore[i][j] == max) {
        if (myScore[i][j]> myScore[u][v]) {
          u=i;
          v=j;
        }
      }

      }
    }
  }
  oneStep(u,v,false)
  chassBoard[u][v]=2;

  for (var k = 0; k < count; k++) {
    if (wins[u][v][k]) {
      opponentWin[k]++;
      myWin[k] = 6; //异常情况，五个子之外
      if (opponentWin[k] == 5) {
        setTimeout(function () {
          window.alert("你输了!");
        }, 100);
        over = true;
      }
    }
  }
  if(!over) {
    me = !me;
  }

}


// 数组（所有赢法的数组）三维数组
var wins = [];
for (var i = 0; i < 15; i++) {
  wins[i] = [];
  for (var j = 0; j < 15; j++) {
    wins[i][j] = [];
  }
}
var count = 0;
// 统计所有的横线
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i][j + k][count] = true;
    }
    count++;
  }
}
// 统计所有的竖线
for (var i = 0; i < 15; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[j + k][i][count] = true;
    }
    count++;
  }
}
// 统计所有的斜线
for (var i = 0; i < 11; i++) {
  for (var j = 0; j < 11; j++) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j + k][count] = true;
    }
    count++;
  }
}
// 统计所有的反斜线
for (var i = 0; i < 11; i++) {
  for (var j = 14; j > 3; j--) {
    for (var k = 0; k < 5; k++) {
      wins[i + k][j - k][count] = true;
    }
    count++;
  }
}
console.log("count: ", count);

// 黑方、白方赢法数组统计
var myWin = [];
var opponentWin = [];
for (var i = 0; i < count; i++) {
  myWin[i] = 0;
  opponentWin[i] = 0;
}
