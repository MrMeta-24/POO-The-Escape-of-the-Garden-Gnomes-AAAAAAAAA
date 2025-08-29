# 🧙‍♂️ A Fuga dos Gnomos de Jardim

Um jogo de labirinto onde você escolhe seu gnomo e compete contra outros gnomos controlados pela máquina para coletar itens coloridos e alcançar a linha de chegada primeiro!

## 🎮 Como Jogar

### Objetivo
Colete 3 itens da sua cor espalhados pelo labirinto e chegue à área dourada (linha de chegada) antes dos outros gnomos!

### Controles
- **WASD** ou **Setas do teclado**: Mover seu gnomo
- **Espaço**: Pausar/Despausar o jogo
- **Ctrl+R**: Reiniciar jogo atual
- **Ctrl+N**: Iniciar novo jogo

### Tipos de Gnomo

#### 🏃‍♂️ Gnomo Veloz
- **Vantagem**: Move-se mais rapidamente (90% chance de movimento por turno)
- **Desvantagem**: Pode ser mais azarado em algumas situações

#### 🐌 Gnomo Azarado  
- **Vantagem**: Tem mais sorte com poções e efeitos especiais
- **Desvantagem**: Move-se mais devagar (60% chance de movimento por turno)

#### 🧠 Gnomo Inteligente
- **Vantagem**: Equilibrado e usa estratégias avançadas
- **Características**: Movimento moderado (80% chance) com IA melhorada

### Elementos do Jogo

#### 🎯 Itens Coloridos
- Cada gnomo deve coletar 3 itens da sua cor específica
- Cores disponíveis: Vermelho, Azul, Verde, Amarelo
- Itens são espalhados aleatoriamente pelo labirinto

#### 🧪 Poções
- **Poção Verde** (Positiva): Teletransporte para próximo de um item ou congela inimigos
- **Poção Vermelha** (Negativa): Teletransporte para longe ou congela você temporariamente

#### 🗺️ Labirinto
- Gerado proceduralmente a cada partida
- Tamanho: 50x50 células
- Paredes pretas bloqueiam o movimento
- Caminhos brancos permitem passagem

## 🤖 Inteligência Artificial

Os gnomos controlados pela máquina usam:
- **Algoritmo A*** para pathfinding inteligente
- **Estratégias adaptativas** baseadas no tipo de gnomo
- **Tomada de decisão** para priorizar coleta de itens vs. corrida para o final

## 🚀 Como Executar

1. Abra o arquivo `index.html` em um navegador web moderno
2. Ou sirva os arquivos através de um servidor HTTP:
   ```bash
   python3 -m http.server 8000
   ```
3. Acesse `http://localhost:8000` no navegador

## 📁 Estrutura do Projeto

```
gnomo-maze-game/
├── index.html          # Interface principal do jogo
├── app.js             # Inicialização da aplicação
├── jogo.js            # Lógica principal do jogo
├── map.js             # Geração do labirinto
├── pathfinding.js     # Algoritmo A* para IA
├── gnomo.js           # Classe base dos gnomos
├── gnomoVeloz.js      # Gnomo veloz
├── gnomoAzarado.js    # Gnomo azarado
├── gnomoInteligente.js # Gnomo inteligente
├── gnomoFactory.js    # Fábrica de gnomos
├── chapeu.js          # Sistema de chapéus
├── pocoes.js          # Sistema de poções
├── corrida.js         # Lógica de corrida
├── style.css          # Estilos visuais
└── README.md          # Esta documentação
```

## 🎨 Características Técnicas

- **Linguagem**: JavaScript ES6+ com módulos
- **Renderização**: Canvas HTML5
- **Arquitetura**: Orientada a objetos com padrões Factory e Strategy
- **IA**: Algoritmo A* para pathfinding
- **Performance**: Otimizado para 30 FPS

## 🏆 Estratégias de Vitória

1. **Escolha o gnomo certo**: Cada tipo tem vantagens específicas
2. **Colete itens eficientemente**: Use o pathfinding visual para encontrar itens
3. **Use poções sabiamente**: Poções verdes podem dar vantagem decisiva
4. **Observe os oponentes**: Antecipe movimentos da IA
5. **Balance coleta vs. velocidade**: Não demore muito coletando itens

## 🐛 Solução de Problemas

- **Jogo não carrega**: Verifique se está servindo via HTTP (não file://)
- **Movimento lento**: Isso é normal para Gnomos Azarados
- **IA muito difícil**: Tente diferentes tipos de gnomo para encontrar sua estratégia

---

Divirta-se jogando **A Fuga dos Gnomos de Jardim**! 🎮✨

