const timers = [];
let curId = 0;

export function startTimer(fun, initialTime) {
    timers.push({
        active: true,
        time: initialTime
    });

    const id = curId++;

    tick(id, fun);

    return id;
}

function tick(id, fun) {
    if (timers[id].active) {
        fun();
        setTimeout(tick, timers[id].time, id, fun);
    }
}

export function changeTime(id, time) {
    timers[id].time = time;
}

export function stopTimer(id) {
    if (id < curId && id !== -1) {
        timers[id].active = false;
    }
}
