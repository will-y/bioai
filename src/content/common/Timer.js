class Timer {
    constructor(fun, initialTime) {
        this.fun = fun;
        this.time = initialTime;
        this.active = false;
    }

    start () {
        this.active = true;
        this.tick(this);
    }

    // need the t here to pass through the this context
    tick(t) {
        if (t.active) {
            t.fun();
            setTimeout(t.tick, t.time, t);
        }
    }

    changeTime(newTime) {
        this.time = newTime;
    }

    pause() {
        this.active = false;
    }
}

export default Timer;
