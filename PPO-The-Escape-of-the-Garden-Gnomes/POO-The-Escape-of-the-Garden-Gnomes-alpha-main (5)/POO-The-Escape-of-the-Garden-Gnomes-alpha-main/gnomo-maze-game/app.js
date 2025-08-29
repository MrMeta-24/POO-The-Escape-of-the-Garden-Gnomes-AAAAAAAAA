// Importa a classe Jogo de outro arquivo (mecânica principal do jogo)
import Jogo from './jogo.js';
export function iniciarJogo() {
    document.getElementById("gameSetup").style.display = "none";
    document.getElementById("gameArea").style.display = "block";
    // aqui você chama a função que inicializa o canvas do jogo (ex: startGame())
}

document.getElementById('setupForm').addEventListener('submit', function(e) {
            e.preventDefault(); // evita recarregar a página
            iniciarJogo(); // função que deve estar no app.js
        });

// Classe principal da aplicação
class App {
  constructor() {
    // Inicializa variáveis do jogo
    this.jogo = null;
    this.gameRunning = false;
    this.gamePaused = false;

    // Inicializa os ouvintes de eventos (botões, formulário etc.)
    this.initEventListeners();
  }

  // Define todos os ouvintes de eventos (interações com o DOM)
  initEventListeners() {
    // Formulário de configuração do jogo
    const setupForm = document.getElementById('setupForm');
    setupForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Impede recarregamento da página
      this.iniciarJogo(); // Inicia o jogo com os dados do formulário
    });

    // Botão de pausar/continuar
    document.getElementById('pauseBtn').addEventListener('click', () => {
      this.pausarJogo();
    });

    // Botão de reiniciar jogo
    document.getElementById('restartBtn').addEventListener('click', () => {
      this.reiniciarJogo();
    });

    // Botão de novo jogo (voltar à configuração)
    document.getElementById('newGameBtn').addEventListener('click', () => {
      this.novoJogo();
    });

    // Validação em tempo real do formulário (para ativar ou desativar botão de iniciar)
    this.setupFormValidation();
  }

  // Valida se o formulário está completo para ativar o botão de "Começar Jogo"
  setupFormValidation() {
    const nomeInput = document.getElementById('nomeJogador');
    const tipoSelect = document.getElementById('tipoGnomo');
    const corRadios = document.querySelectorAll('input[name="corChapeu"]');
    const startBtn = document.querySelector('.start-btn');

    // Função de validação
    const validateForm = () => {
      const nome = nomeInput.value.trim();
      const tipo = tipoSelect.value;
      const cor = document.querySelector('input[name="corChapeu"]:checked');

      // Habilita botão apenas se todos os campos estiverem preenchidos
      const isValid = nome.length > 0 && tipo && cor;
      startBtn.disabled = !isValid;
      startBtn.style.opacity = isValid ? '1' : '0.6';
      startBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    };

    // Ouvintes para validar sempre que o usuário interagir
    nomeInput.addEventListener('input', validateForm);
    tipoSelect.addEventListener('change', validateForm);
    corRadios.forEach(radio => {
      radio.addEventListener('change', validateForm);
    });

    // Validação inicial ao carregar a página
    validateForm();
  }

  // Inicia o jogo com os dados fornecidos
  iniciarJogo() {
    const formData = new FormData(document.getElementById('setupForm'));
    const nomeJogador = formData.get('nomeJogador').trim();
    const tipoGnomo = formData.get('tipoGnomo');
    const corChapeu = formData.get('corChapeu');

    // Validação básica
    if (!nomeJogador || !tipoGnomo || !corChapeu) {
      this.showMessage('Por favor, preencha todos os campos!', 'error');
      return;
    }

    if (nomeJogador.length < 2) {
      this.showMessage('O nome deve ter pelo menos 2 caracteres!', 'error');
      return;
    }

    // Esconde o formulário e mostra a área do jogo
    document.getElementById('gameSetup').style.display = 'none';
    document.getElementById('gameArea').style.display = 'grid';

    // Preenche informações do jogador no UI
    document.getElementById('playerName').textContent = nomeJogador;
    document.getElementById('playerType').textContent = tipoGnomo;
    document.getElementById('playerColor').textContent = corChapeu;
    document.getElementById('itensColetados').textContent = '0';
    document.getElementById('status').textContent = 'Jogando...';
    document.getElementById('status').style.color = '#4a5568';

    // Cria uma nova instância do jogo e o inicia
    try {
      this.jogo = new Jogo();
      this.jogo.iniciarJogo(tipoGnomo, nomeJogador, corChapeu);
      this.gameRunning = true;
      this.gamePaused = false;

      this.showMessage(`Jogo iniciado! Boa sorte, ${nomeJogador}!`, 'success');
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
      this.showMessage('Erro ao iniciar o jogo. Tente novamente.', 'error');
      this.novoJogo();
    }
  }

  // Alterna entre pausar e despausar o jogo
  pausarJogo() {
    if (!this.jogo || !this.gameRunning) return;

    const pauseBtn = document.getElementById('pauseBtn');

    if (this.gamePaused) {
      // Retoma o jogo
      this.jogo.gameRunning = true;
      this.jogo.gameLoop();
      this.gamePaused = false;
      pauseBtn.textContent = '⏸️ Pausar';
      document.getElementById('status').textContent = 'Jogando...';
      this.showMessage('Jogo despausado!', 'info');
    } else {
      // Pausa o jogo
      this.jogo.gameRunning = false;
      this.gamePaused = true;
      pauseBtn.textContent = '▶️ Continuar';
      document.getElementById('status').textContent = 'Pausado';
      this.showMessage('Jogo pausado!', 'info');
    }
  }

  // Reinicia o jogo atual com as mesmas configurações
  reiniciarJogo() {
    if (!this.jogo) return;

    const confirmRestart = confirm('Tem certeza que deseja reiniciar o jogo? Todo o progresso será perdido.');

    if (confirmRestart) {
      // Reutiliza os dados do jogador atual
      const nomeJogador = document.getElementById('playerName').textContent;
      const tipoGnomo = document.getElementById('playerType').textContent;
      const corChapeu = document.getElementById('playerColor').textContent;

      try {
        this.jogo = new Jogo();
        this.jogo.iniciarJogo(tipoGnomo, nomeJogador, corChapeu);
        this.gameRunning = true;
        this.gamePaused = false;

        // Atualiza UI
        document.getElementById('itensColetados').textContent = '0';
        document.getElementById('status').textContent = 'Jogando...';
        document.getElementById('status').style.color = '#4a5568';
        document.getElementById('pauseBtn').textContent = '⏸️ Pausar';

        this.showMessage('Jogo reiniciado!', 'success');
      } catch (error) {
        console.error('Erro ao reiniciar o jogo:', error);
        this.showMessage('Erro ao reiniciar o jogo.', 'error');
      }
    }
  }

  // Volta para o menu inicial e reseta o jogo
  novoJogo() {
    const confirmNew = this.gameRunning ? 
      confirm('Tem certeza que deseja iniciar um novo jogo? Todo o progresso será perdido.') : 
      true;

    if (confirmNew) {
      // Para o jogo atual
      if (this.jogo) {
        this.jogo.gameRunning = false;
        this.jogo = null;
      }

      this.gameRunning = false;
      this.gamePaused = false;

      // Mostra a tela de configuração e esconde o jogo
      document.getElementById('gameSetup').style.display = 'grid';
      document.getElementById('gameArea').style.display = 'none';

      // Limpa o formulário
      document.getElementById('setupForm').reset();

      // Desativa botão de início
      const startBtn = document.querySelector('.start-btn');
      startBtn.disabled = true;
      startBtn.style.opacity = '0.6';
      startBtn.style.cursor = 'not-allowed';

      this.showMessage('Pronto para um novo jogo!', 'info');
    }
  }

  // Mostra mensagens de feedback (sucesso, erro, info etc.)
  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;

    // Estilos visuais da mensagem
    Object.assign(messageEl.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '10px',
      color: 'white',
      fontWeight: '600',
      zIndex: '10000',
      maxWidth: '300px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });

    // Define cores de fundo com base no tipo da mensagem
    const colors = {
      success: '#38a169', // Verde
      error: '#e53e3e',   // Vermelho
      info: '#3182ce',    // Azul
      warning: '#d69e2e'  // Amarelo
    };

    // Aplica a cor correspondente
    messageEl.style.backgroundColor = colors[type] || colors.info;

    // Adiciona a mensagem ao DOM
    document.body.appendChild(messageEl);

    // Anima a entrada da mensagem (slide in)
    setTimeout(() => {
      messageEl.style.transform = 'translateX(0)';
    }, 100);

    // Remove a mensagem após 3 segundos (com animação de saída)
    setTimeout(() => {
      messageEl.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl);
        }
      }, 300); // Aguarda fim da animação
    }, 3000);
  }
}

// Inicializa o app quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new App(); // Cria uma instância da aplicação
});

// Atalhos de teclado para facilitar interação do usuário
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'r':
        e.preventDefault();
        // Ctrl+R = Reiniciar jogo
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn && !restartBtn.disabled) {
          restartBtn.click();
        }
        break;
      case 'n':
        e.preventDefault();
        // Ctrl+N = Novo jogo
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
          newGameBtn.click();
        }
        break;
    }
  }

  // Pausar/despausar com espaço
  if (e.code === 'Space') {
    e.preventDefault();
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn && !pauseBtn.disabled) {
      pauseBtn.click();
    }
  }
});

// Previne zoom do navegador ao usar Ctrl+Scroll
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault(); // Impede zoom
  }
}, { passive: false });

// Mensagens de debug no console (instruções e status do jogo)
console.log('🧙‍♂️ A Fuga dos Gnomos de Jardim - Jogo carregado!');
console.log('Atalhos disponíveis:');
console.log('- Espaço: Pausar/Despausar');
console.log('- Ctrl+R: Reiniciar jogo');
console.log('- Ctrl+N: Novo jogo');
console.log('- WASD ou Setas: Mover gnomo');
