// Algoritmo A* para pathfinding no labirinto
export class Pathfinding {
  constructor(maze) {
    this.maze = maze;
    this.width = maze.width;
    this.height = maze.height;
  }

  // Calcula a distância Manhattan entre dois pontos
  heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  // Retorna os vizinhos válidos de uma posição
  getNeighbors(pos) {
    const neighbors = [];
    const directions = [
      { x: 0, y: -1 }, // cima
      { x: 1, y: 0 },  // direita
      { x: 0, y: 1 },  // baixo
      { x: -1, y: 0 }  // esquerda
    ];

    for (const dir of directions) {
      const newX = pos.x + dir.x;
      const newY = pos.y + dir.y;

      // Verifica se a posição está dentro dos limites e é um caminho livre
      if (newX >= 0 && newX < this.width && 
          newY >= 0 && newY < this.height && 
          this.maze.grid[newY][newX] === ' ') {
        neighbors.push({ x: newX, y: newY });
      }
    }

    return neighbors;
  }

  // Algoritmo A* para encontrar o caminho mais curto
  findPath(start, goal) {
    const openSet = [start];
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    // Inicializa scores
    const startKey = `${start.x},${start.y}`;
    gScore.set(startKey, 0);
    fScore.set(startKey, this.heuristic(start, goal));

    while (openSet.length > 0) {
      // Encontra o nó com menor fScore
      let current = openSet[0];
      let currentIndex = 0;
      
      for (let i = 1; i < openSet.length; i++) {
        const currentKey = `${openSet[i].x},${openSet[i].y}`;
        const bestKey = `${current.x},${current.y}`;
        
        if (fScore.get(currentKey) < fScore.get(bestKey)) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      // Remove o nó atual do openSet
      openSet.splice(currentIndex, 1);
      const currentKey = `${current.x},${current.y}`;
      closedSet.add(currentKey);

      // Verifica se chegou ao objetivo
      if (current.x === goal.x && current.y === goal.y) {
        return this.reconstructPath(cameFrom, current);
      }

      // Examina todos os vizinhos
      const neighbors = this.getNeighbors(current);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        
        if (closedSet.has(neighborKey)) {
          continue;
        }

        const tentativeGScore = gScore.get(currentKey) + 1;

        if (!openSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
          continue;
        }

        // Este caminho é o melhor até agora
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, goal));
      }
    }

    // Não foi possível encontrar um caminho
    return [];
  }

  // Reconstrói o caminho a partir do mapa cameFrom
  reconstructPath(cameFrom, current) {
    const path = [current];
    let currentKey = `${current.x},${current.y}`;

    while (cameFrom.has(currentKey)) {
      current = cameFrom.get(currentKey);
      path.unshift(current);
      currentKey = `${current.x},${current.y}`;
    }

    return path;
  }

  // Encontra o próximo movimento em direção ao objetivo
  getNextMove(start, goal) {
    const path = this.findPath(start, goal);
    
    if (path.length > 1) {
      return path[1]; // Retorna o próximo passo no caminho
    }
    
    return start; // Se não há caminho, fica parado
  }

  // Encontra o item mais próximo de uma cor específica
  findNearestItem(start, items, color) {
    const availableItems = items.filter(item => 
      item.cor === color && !item.coletado
    );

    if (availableItems.length === 0) {
      return null;
    }

    let nearestItem = availableItems[0];
    let shortestDistance = this.heuristic(start, nearestItem);

    for (const item of availableItems) {
      const distance = this.heuristic(start, item);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestItem = item;
      }
    }

    return nearestItem;
  }

  // Estratégia de IA melhorada para gnomos
  getSmartMove(gnomo, items, linhaDeChegada) {
    const start = gnomo.posicao;
    
    // Se já coletou todos os itens necessários, vai para a linha de chegada
    if (gnomo.itensColetados >= gnomo.itensNecessarios) {
      return this.getNextMove(start, linhaDeChegada);
    }

    // Procura o item mais próximo da cor do gnomo
    const nearestItem = this.findNearestItem(start, items, gnomo.cor);
    
    if (nearestItem) {
      return this.getNextMove(start, nearestItem);
    }

    // Se não há itens disponíveis, move-se aleatoriamente
    const neighbors = this.getNeighbors(start);
    if (neighbors.length > 0) {
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    }

    return start; // Fica parado se não há movimentos válidos
  }
}