export class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
    this.visited = this.createGrid(true); // all cells are initially unvisited
  }

  // Create an empty grid (width x height)
  createGrid(fill = false) {
    let grid = [];
    for (let y = 0; y < this.height; y++) {
      grid.push([]);
      for (let x = 0; x < this.width; x++) {
        grid[y].push(fill);
      }
    }
    return grid;
  }

  // Recursive backtracking maze generation
  generate(x = 1, y = 1) {
    // Directions: Right, Down, Left, Up
    const directions = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0], // up
    ];
    // Randomize directions
    directions.sort(() => Math.random() - 0.5);

    // Visit the current cell
    this.visited[y][x] = true;
    this.grid[y][x] = ' '; // Open path

    // Explore neighbors
    for (let i = 0; i < directions.length; i++) {
      const nx = x + directions[i][0] * 2;
      const ny = y + directions[i][1] * 2;

      if (nx > 0 && ny > 0 && nx < this.width - 1 && ny < this.height - 1 && !this.visited[ny][nx]) {
        // Carve the path
        this.grid[ny][nx] = ' '; // Open path
        this.grid[y + directions[i][1]][x + directions[i][0]] = ' '; // Carve between cells

        // Recursively generate the maze
        this.generate(nx, ny);
      }
    }
  }
}