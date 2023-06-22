<script setup>
import { ref, watch, reactive } from 'vue';
import { solve } from '../utils/sudoku.js';

const KEY_DELETE = 'Delete';
const KEY_BACKSPACE = 'Backspace';
const allowedChars = new Set([...'0123456789 ']);
const ARROW_UP = 'ArrowUp';
const ARROW_RIGTH = 'ArrowRight';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const MAX = 9 * 9;

const cells = reactive(new Array(MAX).fill(0).map((_, i) => {
  return {
    val: ''
  };
}));

const cellsRefs = ref([]);

// watch(() => cells.value, 
//   curr => {
//     console.log(curr);
//   },
//   { deep: true }
// );

const idx2Coords = idx => [idx / 9 | 0, idx % 9];
const coords2idx = (row, col) => row * 9 + col;

const setFocus = ci => {
  cellsRefs._value[ci].focus();
};

const keyDown = (event, i) => {
  const isArrow = [ARROW_UP, ARROW_RIGTH, ARROW_DOWN, ARROW_LEFT].includes(event.key);
  // const isEmpty = cells[i].val === '';
  const isAllowed = allowedChars.has(event.key);
  const isRemoving = [KEY_BACKSPACE, KEY_DELETE].includes(event.key);
  if (isArrow) {
    const [row, col] = idx2Coords(i);
    const ni = coords2idx(
      (row + (event.key === ARROW_UP ? -1 : 0) + (event.key === ARROW_DOWN ? 1 : 0) + 9) % 9,
      (col + (event.key === ARROW_LEFT ? -1 : 0) + (event.key === ARROW_RIGTH ? 1 : 0) + 9) % 9,
    );
    setFocus(ni);
  } else if (isAllowed) {
    cells[i].val = [' ', '0'].includes(event.key) ? '' : event.key
    setFocus((i + 1 + MAX) % MAX);
  } else if (isRemoving) {
    cells[i].val = '';
    // if (event.key === KEY_BACKSPACE && isEmpty) {
    if (event.key === KEY_BACKSPACE) {
      setFocus((i - 1 + MAX) % MAX);
    }
  }
  event.preventDefault();
};

const solveBtn = () => {
  console.log('solve', cells.map(cell => +cell.val));
  const solutions = solve(cells.map(cell => +cell.val));
  if (solutions.length <= 0) return alert('no solutions');
  cells.map((cell, i) => cell.val = solutions[0][i]);
};

</script>

<template>
  <!-- <h1>Sudoku Solver</h1> -->

  <div id="container">
    <div id="board">
      <div class="cell" v-for="(cell, i) in cells">
        <input
          type="number"
          ref="cellsRefs"
          v-model="cell.val"
          @keydown="keyDown($event, i)"
          />
      </div>
    </div>
  </div>

  <input type="button" value="Solve" @click="solveBtn" />

</template>

<style scoped lang="scss">

$cellSize: 40px;

$borderThin: 1px;
$borderThick: 3px;

$borderDiff: $borderThick - $borderThin;

#container {
  display: grid;
  justify-items: center;
  align-items: center;
}

#board {
  background: black;

  display: grid;
  grid-template-rows: repeat(9, auto);
  grid-template-columns: repeat(9, auto);
  column-gap: $borderThin;
  row-gap: $borderThin;
  padding: $borderThick;

  margin-bottom: 70px;
}

.cell {
  width: $cellSize;
  height: $cellSize;
  background: white;

  display: grid;
  justify-items: center;
  align-items: center;

  input {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    border-width: 0;
    text-align: center;
    font-size: 1.5em;
    &:focus {
      outline: none;
    }
  }
}

.cell input:hover {
  background: rgb(255-20, 255-10, 255);
}
.cell input:focus {
  background: rgb(255-40, 255-20, 255);
}

.cell:nth-child(3n):not(:nth-child(9n)) {
  margin-right: $borderDiff;
}

@for $i from 1 through 9 {
  .cell:nth-child(27n + #{$i + 27}) {
    margin-top: $borderDiff;
  }
}


/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
