/*
보드의 세로는 N 가로는 M 크기는 각 1*1
첫번째 줄에 보드의 세로, 가로를 의미하는 N, M 이 주어진다.
다음 N개의 줄에 모양을 나타내는 길이 M의 문자열이 주어진다.
'.' = 빈 칸
'#' = 장애물
'O' = 구멍
'R' = 빨간 구슬
'B' = 파란 구슬

최소 몇 번 만에 빨간 구슬을 구멍을 통해 빼낼 수 있는지 출력한다.
만약 10번 이하로 움직여서 빨간 구슬을 빼낼 수 없으면 -1을 출력한다.

R과 B는 같은 방향으로 동시에 움직인다.
벽에서 벽으로 이동한다.

두 공의 좌표를 계속 저장한다.
방향이 바뀔 때만 카운팅한다.
방금 이동한 방향으로 가는 것은 의미없다.

빨간공과 파란공은 같은 자리에 있을 수 없다.

공은 벽/구멍을 마주할 때 까지 움직인다.
빨간공과 파란 구멍이 동시에 구멍에 들어간다. (실패)
다른 루트 탐색
파란 공만 구멍에 들어간다. (실패)
다른 루트 탐색
빨간공만 구멍에 들어간다. (성공 및 종료)

최소 몇 번만에 구슬을 빼낼 수 있는지 구하느 프로그램을 작성하시오.
*/

const fs = require('fs');
const input = fs.readFileSync('./input.txt').toString().split("\n");

const boxHeight = Number(input[0].split(" ")[0]);
const boxWidth = Number(input[0].split(" ")[1]);
const box = [];

let redX;
let redY;
let blueX;
let blueY;
let count = 0;

const direction = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
]

//box 만들기
for (let i = 1; i <= boxHeight; i++) {
    box.push(input[i].split(''));
}
// console.log('boxHeight: ', boxHeight);
// console.log('boxWidth: ', boxWidth);
// console.log('box:', box);

//빨간공, 파란공 좌표 찾기
for (let i = 0; i < boxHeight; i++) {
    for (let j = 0; j < boxWidth; j++) {
        if (box[i][j] === "R") {
            redX = j;
            redY = i;
            //console.log('red: ', box[redY][redX], redY, redX);
        } else if (box[i][j] === "B") {
            blueX = j;
            blueY = i;
           //console.log('blue:', box[blueY][blueX], blueY, blueX);
        }
    }
}

/*
복제 좌표를 하나 만든다.
복제 좌표에 상하좌우 값 대응해서 쭉 이동하게 한다.
*/
function solution() {
    //배열에 변경된 값을 저장하고 불러와서 시작점을 변경한다.
    let way = [{
        newRedX: redX,
        newRedY: redY,
        newBlueX: blueX,
        newBlueY: blueY,
        newCount: count,
        newDirection: 0
    }];
    while (way.length !== 0) {
        let nrx, nry, nbx, nby, nc;
        nrx = way[0].newRedX;
        nry = way[0].newRedY;
        nbx = way[0].newBlueX;
        nby = way[0].newBlueY;
        nc = way[0].newCount;
        nd = way[0].newDirection;
        way.shift();

        //10번 이상하면 실패
        if (nc > 10) {
            return(console.log(-1));
        }
        /*
        const direction = [
            상 [-1, 0], 
            하 [1, 0],  
            좌 [0, -1],
            우 [0, 1] 
        ]
        */
        for (i = 0; i < 4; i++) {
            //방금 이동한 방향과 같은 방향으로 이동은 무시
            if (i === nd) {
                continue;
            }
            let ry = nry;
            let rx = nrx;
            let by = nby;
            let bx = nbx;
            let redMoveCount = 0;
            let blueMoveCount = 0;
            let redBallIn = false;
            let blueBallIn = false;

            //공은 벽/구멍을 마주할 때 까지 움직인다.
            while (box[ry][rx] !== '#') {
                ry += direction[i][0];
                rx += direction[i][1];
                redMoveCount++;
              //  console.log('redmove: ', ry, rx);
                if (box[ry][rx] === 'O') {
                   // console.log('redin: ', ry, rx);
                    redBallIn = true;
                    break;
                }
            }
            //부딪힌 후 좌표 보정
            ry -= direction[i][0];
            rx -= direction[i][1];
           // console.log('redBall: ', ry, rx);

            //공은 벽/구멍을 마주할 때 까지 움직인다.
            while (box[by][bx] !== '#') {
                by += direction[i][0];
                bx += direction[i][1];
                blueMoveCount++;
              //  console.log('bluemove: ', by, bx);
                if (box[by][bx] === 'O') {
                  //  console.log('bluein: ', by, bx);
                    blueBallIn = true;
                    break;
                }
            }
            //부딪힌 후 좌표 보정
            by -= direction[i][0];
            bx -= direction[i][1];
            //console.log('blueBall: ', by, bx);

            //빨간공 파란공 좌표가 똑같을 때 늦게 도착한 공이 한칸 밀린다.
            if (rx === bx && ry === by) {
                // console.log('bomb');
                if (redMoveCount > blueMoveCount) {
                    ry -= direction[i][0];
                    rx -= direction[i][1];
                } else {
                    by -= direction[i][0];
                    bx -= direction[i][1];
                }
            }
            // //파란공이 들어가면 무시
            // if (blueBallIn) {
            //     continue;
            // }
            //파란공이 안들어 갔을 때 빨간공이 들어가면
            if (!blueBallIn && redBallIn) {
                return(console.log(nc + 1));
            }
            //빨간공도 안들어가면 마지막 좌표값 전달
            else if (!blueBallIn) {
                way.push({
                    newRedX: rx,
                    newRedY: ry,
                    newBlueX: bx,
                    newBlueY: by,
                    newCount: nc + 1,
                    newDirection: i
                });
            }
        }
    }
    //10회 이하로 불가능하고, 10회 이상 시도하기도 전에 답이 없을 때
    return(console.log(-1));
}
solution();