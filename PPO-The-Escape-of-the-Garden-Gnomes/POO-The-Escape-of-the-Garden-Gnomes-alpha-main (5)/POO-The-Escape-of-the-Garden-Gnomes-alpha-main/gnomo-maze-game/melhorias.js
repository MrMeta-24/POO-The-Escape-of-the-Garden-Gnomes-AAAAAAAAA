// Melhorias para o jogo de labirinto dos gnomos

// 1. Ajustar tamanho do labirinto para melhor jogabilidade
export function ajustarTamanhoLabirinto(jogo) {
  // Reduzir o tamanho do labirinto para 50x50 para melhor performance e jogabilidade
  jogo.maze = new Maze(50, 50);
  jogo.maze.generate();
  jogo.pathfinding = new Pathfinding(jogo.maze);
  
  // Ajustar linha de chegada
  jogo.linhaDeChegada = { x: 45, y: 45 };
  
  // Ajustar tamanho das células para melhor visualização
  jogo.cellSize = 12;
}

// 2. Melhorar feedback visual
export function melhorarFeedbackVisual(jogo) {
  // Adicionar efeitos visuais quando itens são coletados
  jogo.mostrarEfeitoColeta = function(x, y, cor) {
    const ctx = this.ctx;
    ctx.save();
    
    // Efeito de brilho
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.arc(
      x * this.cellSize + this.cellSize/2, 
      y * this.cellSize + this.cellSize/2, 
      this.cellSize * 2, 
      0, 
      2 * Math.PI
    );
    ctx.fill();
    
    ctx.restore();
    
    // Remover efeito após 500ms
    setTimeout(() => {
      this.desenhar();
    }, 500);
  };
}

// 3. Adicionar sons e efeitos
export function adicionarSonsEfeitos(jogo) {
  // Criar contexto de áudio
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Som de coleta de item
  jogo.tocarSomColeta = function() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };
  
  // Som de vitória
  jogo.tocarSomVitoria = function() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };
}

// 4. Melhorar balanceamento do jogo
export function melhorarBalanceamento(jogo) {
  // Ajustar número de itens necessários baseado no tamanho do labirinto
  const itensNecessarios = Math.max(3, Math.floor(jogo.maze.width / 15));
  
  jogo.jogador.itensNecessarios = itensNecessarios;
  jogo.gnomos.forEach(gnomo => {
    gnomo.itensNecessarios = itensNecessarios;
  });
  
  // Atualizar UI
  document.getElementById('itensColetados').textContent = `0/${itensNecessarios}`;
}

// 5. Adicionar indicadores visuais
export function adicionarIndicadores(jogo) {
  // Indicador de direção para o item mais próximo
  jogo.desenharIndicadorDirecao = function() {
    const itensDisponiveis = this.itens.filter(item => 
      item.cor === this.jogador.cor && !item.coletado
    );
    
    if (itensDisponiveis.length > 0) {
      const itemMaisProximo = this.pathfinding.findNearestItem(
        this.jogador.posicao, 
        this.itens, 
        this.jogador.cor
      );
      
      if (itemMaisProximo) {
        const dx = itemMaisProximo.x - this.jogador.posicao.x;
        const dy = itemMaisProximo.y - this.jogador.posicao.y;
        const angle = Math.atan2(dy, dx);
        
        const centerX = this.jogador.posicao.x * this.cellSize + this.cellSize/2;
        const centerY = this.jogador.posicao.y * this.cellSize + this.cellSize/2;
        
        this.ctx.save();
        this.ctx.strokeStyle = this.jogador.cor;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(
          centerX + Math.cos(angle) * this.cellSize * 2,
          centerY + Math.sin(angle) * this.cellSize * 2
        );
        this.ctx.stroke();
        
        this.ctx.restore();
      }
    }
  };
}

// 6. Melhorar performance
export function melhorarPerformance(jogo) {
  // Limitar FPS para melhor performance
  let lastTime = 0;
  const targetFPS = 30;
  const frameTime = 1000 / targetFPS;
  
  const originalGameLoop = jogo.gameLoop.bind(jogo);
  
  jogo.gameLoop = function() {
    if (!this.gameRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime >= frameTime) {
      this.moverJogador();
      this.moverInimigos();
      this.verificarVitoria();
      this.desenhar();
      
      lastTime = currentTime;
    }
    
    requestAnimationFrame(() => this.gameLoop());
  };
}

