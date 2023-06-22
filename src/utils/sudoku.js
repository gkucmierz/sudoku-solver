
const print = grid => {
  const res = grid
    .join('')
    .replace(/0/g, ' ')
    .match(/.{9}/g);
  // console.log(res);
  return res;
};

export const solve = grid => {
  const coord2idx = (ri, ci) => ri * 9 + ci;
  const idx2coord = idx => {
    const ri = idx / 9 | 0;
    const ci = idx % 9;
    return [ri, ci];
  };
  const mapRow = (grid, ri, fn) => {
    return new Array(9).fill(0).map((_, ci) => {
      const idx = coord2idx(ri, ci);
      return fn(grid[idx], idx);
    });
  };
  const mapCol = (grid, ci, fn) => {
    return new Array(9).fill(0).map((_, ri) => {
      const idx = coord2idx(ri, ci);
      return fn(grid[idx], idx);
    });
  };
  const mapBox = (grid, ri, ci, fn) => {
    const bri = (ri / 3 | 0) * 3;
    const bci = (ci / 3 | 0) * 3;
    return new Array(9).fill(0).map((_, i) => {
      const j = i / 3 | 0;
      const k = i % 3;
      const idx = coord2idx(bri + j, bci + k);
      return fn(grid[idx], idx);
    });
  };
  const createSet = () => new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const check = grid => {
    const isRowCorrect = new Array(9).fill(0).map((_, ri) => {
      const set = createSet();
      return mapRow(grid, ri, (val, idx) => {
        if (val === 0) return true;
        if (set.has(val)) {
          set.delete(val);
          return true;
        }
        return false;
      }).every(val => val);
    }).every(val => val);
    const isColCorrect = new Array(9).fill(0).map((_, ci) => {
      const set = createSet();
      return mapCol(grid, ci, (val, idx) => {
        if (val === 0) return true;
        if (set.has(val)) {
          set.delete(val);
          return true;
        }
        return false;
      }).every(val => val);
    }).every(val => val);
    const isBoxCorrect = new Array(9).fill(0).map((_, bi) => {
      const set = createSet();
      const ri = (bi / 3 | 0) * 3;
      const ci = (bi % 3) * 3;
      return mapBox(grid, ri, ci, (val, idx) => {
        if (val === 0) return true;
        if (set.has(val)) {
          set.delete(val);
          return true;
        }
        return false;
      }).every(val => val);
    }).every(val => val);
    return [isRowCorrect, isColCorrect, isBoxCorrect].every(val => val);
  };

  const iteration = grid => {
    let minSize = Infinity;
    let minSet;
    let minIdx;
    let cnt = 0;
    grid.map((val, idx) => {
      if (val !== 0) return;
      const set = createSet();
      const [ri, ci] = idx2coord(idx);
      mapRow(grid, ri, val => set.delete(val));
      mapCol(grid, ci, val => set.delete(val));
      mapBox(grid, ri, ci, val => set.delete(val));
      if (set.size < minSize) {
        minSize = set.size;
        minSet = set;
        minIdx = idx;
      }
      ++cnt;
    });
    const done = cnt === 0;
    return [done, minSet, minIdx];
  };

  const solutions = [];
  const loop = (grid, lvl = 0) => {
    const [done, set, idx] = iteration(grid);
    if (done) {
      solutions.push(grid.slice());
      return true;
    }
    const [ri, ci] = idx2coord(idx);
    if (set.size === 0) return false; // cannot put any number
    [...set].map(val => {
      grid[idx] = val;
      loop(grid, lvl + 1);
      grid[idx] = 0;
    });
  };

  if (!check(grid)) return false;
  loop(grid);
  return solutions;
};
