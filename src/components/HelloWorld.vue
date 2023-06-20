<script setup>
import { ref } from 'vue'

const cells = new Array(9*9).fill(0).map((_, i) => {
  return {
    val: i
  };
});

</script>

<template>
  <h1>Sudoku Solver</h1>

  <div id="container">
    <div id="board">
      <div class="cell" v-for="cell in cells">
        <input type="number" />
      </div>
    </div>
  </div>

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
