const sample = require("./sample");

const binarySearch = (list, target, start, end) => {
    let mid = 0;
    while (start <= end) {
        mid = Math.floor((start + end) / 2);

        if (list[mid] == target) {
            return mid;
        }

        if (list[mid] < target) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    return mid;
};

function solution(qArray, kArray) {
    qArray.sort();
    console.log("우선순위 Q");
    console.log(qArray);
    console.log("적용할 연산 K");
    console.log(kArray);
    let result;

    while (kArray.length > 0) {
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
            if (qArray.length <= 0) {
                qArray.push(parseInt(number));
                console.log("삽입 결과");
                console.log(qArray);
                continue;
            }

            const value = binarySearch(qArray, parseInt(number), 0, qArray.length - 1);

            if (qArray[value] <= parseInt(number)) {
                qArray.splice(value + 1, 0, parseInt(number));
            } else if (qArray[value] > number) {
                qArray.splice(value, 0, parseInt(number));
            }
        }
    }

    if (qArray.length <= 0) {
        result = "EMPTY";
    } else {
        let min = qArray[0];
        let max = qArray[qArray.length - 1];
        result = max + " " + min;
    }

    console.log("결과 출력");

    return result;
}

const index = 5;
console.log(solution(sample[index].Q, sample[index].K));

// I N - N의 정수 삽입
// D -1 - 최소값 삭제
// D 1 - 최대값 삭제
