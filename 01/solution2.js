const sample = require("./sample");

function solution(qArray, kArray) {
    console.log("우선순위 Q");
    console.log(qArray);
    console.log("적용할 연산 K");
    console.log(kArray);
    let result;
    while (kArray.length > 0) {
        qArray.sort();
        let [command, number] = kArray.shift().split(" ");

        if (command === "D") {
            if (qArray.length <= 0) {
                continue;
            }
            if (parseInt(number) === -1) {
                qArray.shift();
            } else if (parseInt(number) === 1) {
                qArray.pop();
            }
        } else if (command === "I") {
            qArray.push(parseInt(number));
        }
    }

    qArray.sort();

    if (qArray.length <= 0) {
        result = "EMPTY";
    } else {
        let min = qArray[0];
        let max = qArray[qArray.length - 1];
        result = max + " " + min;
        console.log("최대값 최소값 출력");
    }

    return result;
}

const index = 0;
console.log(solution(sample[index].Q, sample[index].K));

// I N - N의 정수 삽입
// D -1 - 최소값 삭제
// D 1 - 최대값 삭제
