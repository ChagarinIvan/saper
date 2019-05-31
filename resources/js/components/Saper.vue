<template>
    <div class="row">
        <div class="col-md-12 text-center">
            <div class="timer">
                <div class="tcell">
                    <div class="numbers tenhour moveten">0 1 2 3 4 5 6 7 8 9</div>
                </div>
                <div class="tcell">
                    <div class="numbers hour moveten">0 1 2 3 4 5 6 7 8 9</div>
                </div>
                <div class="tcell divider"><div class="numbers">:</div></div>
                <div class="tcell">
                    <div class="numbers tenminute movesix">0 1 2 3 4 5 6</div>
                </div>
                <div class="tcell">
                    <div class="numbers minute moveten">0 1 2 3 4 5 6 7 8 9</div>
                </div>
                <div class="tcell divider"><div class="numbers">:</div></div>
                <div class="tcell">
                    <div class="numbers tensecond movesix">0 1 2 3 4 5 6</div>
                </div>
                <div class="tcell">
                    <div class="numbers second moveten">0 1 2 3 4 5 6 7 8 9</div>
                </div>
            </div>
            <div class="timer">
                <div class="tcell" :style="counterWidth">
                    <div class="numbers" :style="counterWidth">{{ minesCount }}</div>
                </div>
            </div>
        </div>
        <div class="col-md-12 text-center">
            <div class="saper">
                <div class="row mr-0 ml-0" v-for="(row, y) in table">
                    <div class="cell"
                        :class="{unactive: isShow(y, x), 'text-danger': redBomb(y, x)}"
                        v-for="(cell, x) in row"
                        :key="x + '_' + y"
                        @click="onClick(y, x)"
                        @dblclick="onDblclick(y, x)"
                        @contextmenu.prevent="rightClick(y, x)"
                    >
                        <template v-if="isFlag(y, x)">
                            <i class="fa fa-flag text-danger"></i>
                        </template>
                        <template v-else>
                            <template v-if="isShow(y, x)">
                                <i class="fa fa-bomb" v-if="cell === 9"></i>
                                <p :class="cellClass(cell)"
                                    v-if="cell > 0 && cell !== 9"
                                >
                                    <strong>{{ cell }}</strong>
                                </p>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-12 text-center mt-2" v-if="isFinished">
            <button class="btn btn-lg btn-danger" @click="$router.go(-1)">Back</button>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import $ from 'jquery';

    export default {
        name: 'Saper',

        data: function() {
            return {
                width: _.parseInt(this.$route.params.width),
                height: _.parseInt(this.$route.params.height),
                minesCount: this.$route.params.mines,
                table: [],
                clicked: [],
                isStarted: false,
                isFinished: false,
            }
        },

        created() {
            let row = _.fill(Array(this.width), 0);

            for (let i = 0; i < this.height; i++) {
                this.table[i] = _.cloneDeep(row);
            }

            this.clicked = _.cloneDeep(this.table);
        },

        computed: {
            cellClass() {
                return (cell) => {
                    return 'cell-' + cell;
                }
            },

            isShow() {
                return (y, x) => {
                    return (this.isStarted && this.clicked[y][x] === 1) || this.isFinished;
                }
            },

            redBomb() {
                return (y, x) => {
                    return this.clicked[y][x] === 0 && this.table[y][x] === 9 && this.isFinished;
                }
            },

            isFlag() {
                return (y, x) => {
                    return this.clicked[y][x] === 2;
                }
            },

            counterWidth() {
                return 'width: ' + 0.6 * this.minesCount.toString().length + 'em';
            }
        },

        methods: {
            setMine(startY, startX) {
                let x = _.random(this.width - 1);
                let y = _.random(this.height - 1);

                if (this.table[y][x] === 9 || (y === startY && x === startX)) {
                    this.setMine(startY, startX);
                }
                else {
                    this.table[y][x] = 9
                }
            },

            recalculateEnvironment(y, x) {
                this.iterate(y, x, (y, x, i, n) => {
                    this.addFlag(y + i, x + n);
                });
            },

            addFlag(y, x) {
                if (this.table[y][x] !== 9) {
                    this.table[y][x]++;
                }
            },

            onClick(y, x) {
                if (this.isFinished) {
                    return;
                }

                if (this.clicked[y][x] !== 0) {
                    return;
                }

                this.clicked[y][x] = 1;

                if (!this.isStarted) {
                    this.firstClick(y, x);
                }
                if (this.table[y][x] === 9) {
                    this.finish('You LOSE! Try again');
                }
                else {
                    this.clicked[y][x] = 1;
                    if (this.table[y][x] === 0) {
                        this.showEmpty(y, x);
                    }

                    this.checkWin();
                    this.clicked = _.cloneDeep(this.clicked);
                }
            },

            onDblclick(y, x) {
                if (this.isFinished) {
                    return;
                }

                if (!this.isStarted) {
                    return;
                }

                if (this.clicked[y][x] === 2) {
                    return;
                }

                let flags = 0;
                this.iterate(y, x, (y, x, i, n) => {
                    if (this.clicked[y + i][x + n] === 2) {
                        if (this.table[y + i][x + n] !== 9) {
                            this.finish('You LOSE, you set wrong flag! Try again');
                            return;
                        }
                        flags++;
                    }
                });
                if (flags === this.table[y][x]) {
                    console.log('onDblclick');
                    this.iterate(y, x, (y, x, i, n) => {
                        if (this.clicked[y + i][x + n] === 0) {
                            this.clicked[y + i][x + n] = 1;
                            if (this.table[y + i][x + n] === 0) {
                                this.showEmpty(y + i, x + n);
                            }
                        }
                    });

                    this.checkWin();
                    this.clicked = _.cloneDeep(this.clicked);
                }
            },

            firstClick(y, x) {
                this.isStarted = true;
                for (let i = 0; i < this.minesCount; i++) {
                    this.setMine(y, x);
                }

                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        if (this.table[y][x] === 9) {
                            this.recalculateEnvironment(y, x);
                        }
                    }
                }

                $('.movesix').css("animation-play-state", "running");
                $('.moveten').css("animation-play-state", "running");
            },

            rightClick(y, x) {
                if (this.isFinished) {
                    return;
                }

                if (!this.isStarted) {
                    return;
                }

                switch (this.clicked[y][x]) {
                    case 0: {
                        this.minesCount--;
                        this.clicked[y][x] = 2;
                        this.clicked = _.cloneDeep(this.clicked);
                        this.checkWin();
                        break;
                    }
                    case 2: {
                        this.minesCount++;
                        this.clicked[y][x] = 0;
                        this.clicked = _.cloneDeep(this.clicked);
                        break;
                    }
                }
            },

            showEmpty(y, x) {
                console.log('showEmpty', arguments);
                this.iterate(y, x, (y, x, i, n) => {
                    if (this.clicked[y + i][x + n] === 0) {
                        this.clicked[y + i][x + n] = 1;

                        if (this.table[y + i][x + n] === 0) {
                            this.showEmpty(y + i, x + n);
                        }
                    }
                });
            },

            iterate(y, x, then) {
                for (let i = -1; i <= 1; i++) {
                    for (let n = -1; n <= 1; n++) {
                        if (i === -1) {
                            if (y === 0) {
                                continue;
                            }
                        }
                        if (i === 1) {
                            if (y === this.height - 1) {
                                continue;
                            }
                        }
                        if (n === -1) {
                            if (x === 0) {
                                continue;
                            }
                        }
                        if (n === 1) {
                            if (x === this.width - 1) {
                                continue;
                            }
                        }

                        then(y, x, i, n);
                    }
                }
            },

            checkWin() {
                if (this.minesCount === 0) {
                    for (let i = 0; i < this.height; i++) {
                        for (let n = 0; n < this.width; n++) {
                            if (this.clicked[i][n] === 0) {
                                return;
                            }
                        }
                    }

                    this.finish('You WIN!!!');
                }
            },

            finish(message) {
                this.isFinished = true;
                $('.movesix').css("animation-play-state", "paused");
                $('.moveten').css("animation-play-state", "paused");
                this.$swal(message);
            },
        }
    }
</script>
<style>
    .saper {
        width: auto;
        display: inline-block;
        border: 7px solid #efefef;
        border-radius: 5px;
        position: relative;
        box-shadow:
            inset 0 -2px 10px 1px rgba(0, 0, 0, 0.75),
            0 5px 20px -10px rgba(0, 0, 0, 1);
    }
    .cell {
        width: 25px;
        height: 25px;
        text-align: center;
        cursor: default;
        display: block;
        outline: none;
        background: #dcdcdc linear-gradient(#fff, #dcdcdc);
        box-shadow: 0 0 0 1px #ddd inset, 0 1px 1px #fff;
        font-weight: bolder;
        font-size: 16px;
    }
    .cell:hover {
        box-shadow: 0 0 0 1px #aaa inset, 0 1px 1px #aaa;
    }
    .cell:active {
        background: none;
        box-shadow: 0 0 0 1px #bbb inset, 0 1px 3px rgba(0,0,0,.5) inset, 0 1px 2px #fff;
    }
    .cell-1 {color: #00ff00}
    .cell-2 {color: #22cc00}
    .cell-3 {color: #44aa00}
    .cell-4 {color: #668800}
    .cell-5 {color: #886600}
    .cell-6 {color: #aa4400}
    .cell-7 {color: #cc2200}
    .cell-8 {color: #ff0000}

    .cell.unactive {
        background: rgba(171, 175, 179, 0.38);
        box-shadow: 0 0 0 1px #aaa inset, 0 1px 1px #aaa;
    }
    .cell.unactive:active {
        background: rgba(171, 175, 179, 0.38);
        box-shadow: 0 0 0 1px #aaa inset, 0 1px 1px #aaa;
    }
    .timer {
        padding: 10px;
        display: inline-block;
        border: 7px solid #efefef;
        border-radius: 5px;
        position: relative;
        box-shadow:
            inset 0 -2px 10px 1px rgba(0, 0, 0, 0.75),
            0 5px 20px -10px rgba(0, 0, 0, 1);
    }

    .tcell {
        width: 0.60em;
        height: 40px;
        font-size: 50px;
        overflow: hidden;
        position: relative;
        float: left;
    }

    .numbers {
        width: 0.6em;
        line-height: 40px;
        text-align: center;
        color: #000000;
        position: absolute;
        top: 0;
        left: 0;
        text-shadow: 0 0 5px rgba(255, 255, 255, 1);
    }

    .moveten {
        animation: moveten 1s steps(10, end) infinite;
        animation-play-state: paused;
    }
    .movesix {
        animation: movesix 1s steps(6, end) infinite;
        animation-play-state: paused;
    }

    .second {animation-duration: 10s;}
    .tensecond {animation-duration: 60s;} /*60 раз .second*/

    .minute {animation-duration: 600s;} /*60 раз .second*/
    .tenminute {animation-duration: 3600s;} /*60 раз .minute*/

    .hour {animation-duration: 36000s;} /*60 раз .minute*/
    .tenhour {animation-duration: 360000s;} /*10 раз .hour*/

    @keyframes moveten {
        0% {top: 0;}
        100% {top: -400px;}
    }

    @keyframes movesix {
        0% {top: 0;}
        100% {top: -240px;}
    }
</style>
