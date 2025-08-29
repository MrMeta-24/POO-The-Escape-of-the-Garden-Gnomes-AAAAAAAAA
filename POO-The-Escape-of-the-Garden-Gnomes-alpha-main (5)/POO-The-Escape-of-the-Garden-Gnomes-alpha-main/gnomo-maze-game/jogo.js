import { GnomoFactory } from './gnomoFactory.js';
import { PocaoTeletransporte, PocaoCongelamento } from './pocoes.js';
import { Pathfinding } from './pathfinding.js';
import { Maze } from './map.js';


class Jogo {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.maze = null;
    this.pathfinding = null;
    this.gnomos = [];
    this.jogador = null;
    this.itens = [];
    this.pocoes = [];
    this.linhaDeChegada = { x: 45, y: 45 };
    this.cellSize = 12;
    this.gameRunning = false;
    this.gameWon = false;
    this.keys = {};
    
    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 800;
    this.canvas.height = 800;
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  criarMaze() {
    this.maze = new Maze(50, 50);
    this.maze.generate();
    this.pathfinding = new Pathfinding(this.maze);
  }

  iniciarJogo(tipoGnomo, nomeJogador, corChapeu) {
    this.criarMaze();
    
    // Criar jogador
    this.jogador = GnomoFactory.criarGnomo(tipoGnomo, nomeJogador, corChapeu);
    this.jogador.posicao = { x: 1, y: 1 };
    this.jogador.cor = corChapeu;
    this.jogador.congelado = false;
    this.jogador.tempoCongelamento = 0;
    this.jogador.itensColetados = 0;
    this.jogador.itensNecessarios = 3;

    // Adicionar método de congelamento
    this.jogador.congelar = function(tempo) {
      this.congelado = true;
      this.tempoCongelamento = tempo;
      setTimeout(() => {
        this.congelado = false;
        this.tempoCongelamento = 0;
      }, tempo);
    };

    // Criar gnomos inimigos
    this.gnomos = [];
    const tipos = ['Veloz', 'Azarado', 'Inteligente'];
    const cores = ['vermelho', 'azul', 'verde', 'amarelo'];
    
    for (let i = 0; i < 3; i++) {
      const tipo = tipos[Math.floor(Math.random() * tipos.length)];
      const cor = cores[Math.floor(Math.random() * cores.length)];
      const gnomo = GnomoFactory.criarGnomo(tipo, `Inimigo${i+1}`, cor);
      gnomo.posicao = this.encontrarPosicaoLivre();
      gnomo.cor = cor;
      gnomo.congelado = false;
      gnomo.tempoCongelamento = 0;
      gnomo.itensColetados = 0;
      gnomo.itensNecessarios = 3;
      
      // Adicionar método de congelamento
      gnomo.congelar = function(tempo) {
        this.congelado = true;
        this.tempoCongelamento = tempo;
        setTimeout(() => {
          this.congelado = false;
          this.tempoCongelamento = 0;
        }, tempo);
      };
      
      this.gnomos.push(gnomo);
    }

    // Criar itens espalhados pelo mapa
    this.criarItens();
    
    // Criar poções
    this.criarPocoes();

    this.gameRunning = true;
    this.gameWon = false;
    this.gameLoop();
  }

  encontrarPosicaoLivre() {
    let x, y;
    do {
      x = Math.floor(Math.random() * 48) + 1;
      y = Math.floor(Math.random() * 48) + 1;
    } while (this.maze.grid[y][x] !== ' ');
    return { x, y };
  }

  criarItens() {
    this.itens = [];
    const cores = ['vermelho', 'azul', 'verde', 'amarelo', this.jogador.cor];
    
    for (let cor of cores) {
      for (let i = 0; i < 3; i++) {
        const posicao = this.encontrarPosicaoLivre();
        this.itens.push({
          x: posicao.x,
          y: posicao.y,
          cor: cor,
          coletado: false
        });
      }
    }
  }

  criarPocoes() {
    this.pocoes = [];
    
    // Criar 2 poções de teletransporte
    for (let i = 0; i < 2; i++) {
      const posicao = this.encontrarPosicaoLivre();
      const tipo = Math.random() < 0.5 ? 'buf' : 'debuf';
      this.pocoes.push({
        x: posicao.x,
        y: posicao.y,
        tipo: 'teletransporte',
        efeito: tipo,
        usado: false,
        pocao: new PocaoTeletransporte(tipo)
      });
    }

    // Criar 2 poções de congelamento
    for (let i = 0; i < 2; i++) {
      const posicao = this.encontrarPosicaoLivre();
      const tipo = Math.random() < 0.5 ? 'buf' : 'debuf';
      this.pocoes.push({
        x: posicao.x,
        y: posicao.y,
        tipo: 'congelamento',
        efeito: tipo,
        usado: false,
        pocao: new PocaoCongelamento(tipo)
      });
    }
  }

  moverJogador() {
    if (this.jogador.congelado) return;

    let novaX = this.jogador.posicao.x;
    let novaY = this.jogador.posicao.y;

    if (this.keys['ArrowUp'] || this.keys['w']) novaY--;
    if (this.keys['ArrowDown'] || this.keys['s']) novaY++;
    if (this.keys['ArrowLeft'] || this.keys['a']) novaX--;
    if (this.keys['ArrowRight'] || this.keys['d']) novaX++;

    // Verificar se a nova posição é válida
    if (novaX >= 0 && novaX < 50 && novaY >= 0 && novaY < 50 && 
        this.maze.grid[novaY][novaX] === ' ') {
      this.jogador.posicao.x = novaX;
      this.jogador.posicao.y = novaY;
    }

    // Verificar colisões com itens
    this.verificarColisaoItens(this.jogador);
    
    // Verificar colisões com poções
    this.verificarColisaoPocoes(this.jogador);
  }

  moverInimigos() {
    this.gnomos.forEach(gnomo => {
      if (gnomo.congelado) return;

      // IA inteligente usando pathfinding A*
      const novaPosicao = this.pathfinding.getSmartMove(gnomo, this.itens, this.linhaDeChegada);
      
      // Aplicar modificadores de velocidade baseados no tipo de gnomo
      const shouldMove = this.shouldGnomoMove(gnomo);
      
      if (shouldMove && novaPosicao.x !== gnomo.posicao.x || novaPosicao.y !== gnomo.posicao.y) {
        gnomo.posicao.x = novaPosicao.x;
        gnomo.posicao.y = novaPosicao.y;
      }

      // Verificar colisões
      this.verificarColisaoItens(gnomo);
      this.verificarColisaoPocoes(gnomo);
    });
  }

  // Determina se o gnomo deve se mover baseado em suas características
  shouldGnomoMove(gnomo) {
    // Gnomos Velozes se movem mais frequentemente
    if (gnomo.constructor.name === 'GnomoVeloz') {
      // 90% de chance de se mover (mais rápido)
      return Math.random() < 0.9;
    }
    
    // Gnomos Azarados se movem menos frequentemente
    if (gnomo.constructor.name === 'GnomoAzarado') {
      // 60% de chance de se mover (mais lento)
      return Math.random() < 0.6;
    }
    
    // Gnomos Inteligentes se movem de forma equilibrada
    if (gnomo.constructor.name === 'GnomoInteligente') {
      // 80% de chance de se mover (equilibrado)
      return Math.random() < 0.8;
    }
    
    // Outros tipos de gnomo (padrão)
    return Math.random() < 0.75;
  }

  verificarColisaoItens(gnomo) {
    this.itens.forEach(item => {
      if (!item.coletado && 
          item.x === gnomo.posicao.x && 
          item.y === gnomo.posicao.y && 
          item.cor === gnomo.cor) {
        item.coletado = true;
        gnomo.itensColetados++;
        
        if (gnomo === this.jogador) {
          document.getElementById('itensColetados').textContent = `${gnomo.itensColetados}/3`;
        }
      }
    });
  }

  verificarColisaoPocoes(gnomo) {
    this.pocoes.forEach(pocao => {
      if (!pocao.usado && 
          pocao.x === gnomo.posicao.x && 
          pocao.y === gnomo.posicao.y) {
        pocao.usado = true;
        
        const outrosGnomos = gnomo === this.jogador ? 
          this.gnomos : 
          [this.jogador, ...this.gnomos.filter(g => g !== gnomo)];
        
        const itensDisponiveis = this.itens.filter(item => 
          item.cor === gnomo.cor && !item.coletado
        );
        
        pocao.pocao.aplicarEfeito(gnomo, itensDisponiveis, this.linhaDeChegada, outrosGnomos);
      }
    });
  }

  verificarVitoria() {
    // Verificar se o jogador ganhou
    if (this.jogador.itensColetados >= this.jogador.itensNecessarios &&
        this.jogador.posicao.x >= this.linhaDeChegada.x &&
        this.jogador.posicao.y >= this.linhaDeChegada.y) {
      this.gameWon = true;
      this.gameRunning = false;
      document.getElementById('status').textContent = 'Você venceu!';
      document.getElementById('status').style.color = 'green';
      return;
    }

    // Verificar se algum inimigo ganhou
    this.gnomos.forEach(gnomo => {
      if (gnomo.itensColetados >= gnomo.itensNecessarios &&
          gnomo.posicao.x >= this.linhaDeChegada.x &&
          gnomo.posicao.y >= this.linhaDeChegada.y) {
        this.gameWon = true;
        this.gameRunning = false;
        document.getElementById('status').textContent = `${gnomo.nome} venceu!`;
        document.getElementById('status').style.color = 'red';
      }
    });
  }

  desenhar() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Desenhar maze
    for (let y = 0; y < this.maze.height; y++) {
      for (let x = 0; x < this.maze.width; x++) {
        this.ctx.fillStyle = this.maze.grid[y][x] === ' ' ? 'white' : 'black';
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      }
    }

    // Desenhar linha de chegada
    this.ctx.fillStyle = 'gold';
    this.ctx.fillRect(
      this.linhaDeChegada.x * this.cellSize, 
      this.linhaDeChegada.y * this.cellSize, 
      10 * this.cellSize, 
      10 * this.cellSize
    );

    // Desenhar itens
    this.itens.forEach(item => {
      if (!item.coletado) {
        this.ctx.fillStyle = item.cor;
        this.ctx.fillRect(
          item.x * this.cellSize, 
          item.y * this.cellSize, 
          this.cellSize, 
          this.cellSize
        );
      }
    });

    // Desenhar poções
    this.pocoes.forEach(pocao => {
      if (!pocao.usado) {
        this.ctx.fillStyle = pocao.efeito === 'buf' ? 'lightgreen' : 'lightcoral';
        this.ctx.fillRect(
          pocao.x * this.cellSize, 
          pocao.y * this.cellSize, 
          this.cellSize, 
          this.cellSize
        );
      }
    });

    // Desenhar jogador
    this.ctx.fillStyle = this.jogador.congelado ? 'lightblue' : this.jogador.cor;
    this.ctx.fillRect(
      this.jogador.posicao.x * this.cellSize, 
      this.jogador.posicao.y * this.cellSize, 
      this.cellSize * 2, 
      this.cellSize * 2
    );

    // Desenhar inimigos
    this.gnomos.forEach(gnomo => {
      this.ctx.fillStyle = gnomo.congelado ? 'lightblue' : gnomo.cor;
      this.ctx.fillRect(
        gnomo.posicao.x * this.cellSize, 
        gnomo.posicao.y * this.cellSize, 
        this.cellSize * 2, 
        this.cellSize * 2
      );
    });
  }

  gameLoop() {
    if (!this.gameRunning) return;

    this.moverJogador();
    this.moverInimigos();
    this.verificarVitoria();
    this.desenhar();

    requestAnimationFrame(() => this.gameLoop());
  }
}

export default Jogo;