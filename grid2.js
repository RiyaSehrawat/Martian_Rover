<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grid Visualization</title>
    <style>
        canvas {
            border: 1px solid black;
        }
    </style>
</head>
<body>
    <canvas id="gridCanvas" width="800" height="800"></canvas>
    <script>
        class Node {
            constructor(column, row, size, isStart, isFinish, isWall, grid) {
                this.column = column;
                this.row = row;
                this.size = size;
                this.isStart = isStart;
                this.isFinish = isFinish;
                this.isWall = isWall;
                this.grid = grid;
                this.distance = Infinity;
                this.neighbours = [];
                this.previousNode = null;
                this.isVisited = false;
            }

            draw() {
                const x = this.column * this.size;
                const y = this.row * this.size;
                ctx.fillStyle = this.isStart ? 'green' :
                                this.isFinish ? 'red' :
                                this.isWall ? 'black' :
                                'white';
                ctx.fillRect(x, y, this.size, this.size);
                ctx.strokeRect(x, y, this.size, this.size);
            }

            clicked() {
                this.isWall = !this.isWall;
                this.draw();
            }
        }

        class Grid {
            constructor(columns, rows, nodeSize) {
                this.columns = columns;
                this.rows = rows;
                this.nodeSize = nodeSize;
                this.grid = [];
            }

            createGrid() {
                for (let i = 0; i < this.columns; i++) {
                    this.grid[i] = [];
                }

                let startColumn = Math.round(this.columns / 10);
                let startRow = Math.round(this.rows / 2) - 1;
                let finishColumn = Math.round(this.columns - (this.columns / 10));
                let finishRow = Math.round(this.rows / 2) + 2;

                for (let column = 0; column < this.columns; column++) {
                    for (let row = 0; row < this.rows; row++) {
                        let isStart = (column === startColumn && row === startRow);
                        let isFinish = (column === finishColumn && row === finishRow);
                        this.grid[column][row] = new Node(column, row, this.nodeSize, isStart, isFinish, false, this.grid);
                    }
                }
            }

            drawGrid() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let column = 0; column < this.columns; column++) {
                    for (let row = 0; row < this.rows; row++) {
                        this.grid[column][row].draw();
                    }
                }
            }

            updateGrid(mouse) {
                const changeX = Math.floor(mouse.x / this.nodeSize);
                const changeY = Math.floor(mouse.y / this.nodeSize);

                if (this.grid[changeX][changeY].isStart) {
                    this.grid[changeX][changeY].isStart = false;
                    this.grid[mouse.x][mouse.y].isStart = true;
                } else if (this.grid[changeX][changeY].isFinish) {
                    this.grid[changeX][changeY].isFinish = false;
                    this.grid[mouse.x][mouse.y].isFinish = true;
                } else if (mouse.x !== changeX || mouse.y !== changeY) {
                    this.grid[changeX][changeY].clicked();
                }
                this.drawGrid();
            }

            getStartNode() {
                for (let i = 0; i < this.grid.length; i++) {
                    for (let j = 0; j < this.grid[i].length; j++) {
                        let node = this.grid[i][j];
                        if (node.isStart) {
                            return node;
                        }
                    }
                }
            }

            getFinishNode() {
                for (let i = 0; i < this.grid.length; i++) {
                    for (let j = 0; j < this.grid[i].length; j++) {
                        let node = this.grid[i][j];
                        if (node.isFinish) {
                            return node;
                        }
                    }
                }
            }

            setStartNodeDistance(distance) {
                this.getStartNode().distance = distance;
            }

            resetGrid() {
                for (let column = 0; column < this.columns; column++) {
                    for (let row = 0; row < this.rows; row++) {
                        this.grid[column][row].neighbours = [];
                        this.grid[column][row].previousNode = null;
                        this.grid[column][row].isVisited = false;
                        this.grid[column][row].distance = Infinity;
                    }
                }
            }
        }

        const canvas = document.getElementById('gridCanvas');
        const ctx = canvas.getContext('2d');
        const grid = new Grid(20, 20, 40);

        canvas.addEventListener('mousedown', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouse = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                down: true
            };
            grid.updateGrid(mouse);
        });

        canvas.addEventListener('mouseup', () => {
            mouse.down = false;
        });

        grid.createGrid();
        grid.drawGrid();
    </script>
</body>
</html>

    }
}

// Ensure `ctx`, `canvas`, `mouse`, `changeX`, `changeY`, and `Node` are properly defined and initialized
