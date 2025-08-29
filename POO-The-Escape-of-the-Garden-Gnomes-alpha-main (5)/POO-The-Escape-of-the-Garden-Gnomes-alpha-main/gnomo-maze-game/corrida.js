// Importa a classe Gnomo, que representa os competidores da corrida
import { Gnomo } from './gnomo.js';

// Classe responsável por simular uma corrida entre gnomos
class Corrida {
  // Declaração das propriedades principais
  competidores = [];      // Array com os gnomos participantes
  distanciaTotal;         // Distância total da corrida
  vencedor;               // Gnomo que vencer a corrida

  // Construtor da Corrida - define a distância que os gnomos devem percorrer
  constructor(distanciaTotal) {
    this.distanciaTotal = distanciaTotal;
  }

  // Adiciona um gnomo à corrida
  adicionarCompetidor(gnomo) {
    this.competidores.push(gnomo);
  }

  // Avança todos os gnomos uma rodada (um "turno")
  proximoTurno() {
    // Cada gnomo dá um passo (ou mais, dependendo da lógica interna dele)
    this.competidores.forEach(gnomo => gnomo.avancar());

    // Verifica se algum gnomo venceu após esse turno
    this.verificarVencedor();
  }

  // Verifica se há um vencedor
  verificarVencedor() {
    this.competidores.forEach(gnomo => {
      // Se o gnomo alcançou ou passou a linha de chegada, e ainda não há um vencedor registrado
      if (gnomo.posicao >= this.distanciaTotal && !this.vencedor) {
        this.vencedor = gnomo;
        console.log(`Vencedor: ${gnomo.nome}`); // Mostra o nome do vencedor no console
      }
    });
  }

  // Inicia a simulação da corrida inteira
  iniciarSimulacao() {
    let turno = 0;

    // Enquanto não houver vencedor, os turnos continuam
    while (!this.vencedor) {
      console.log(`Turno ${turno + 1}:`);
      this.proximoTurno(); // Avança todos os gnomos
      turno++;             // Contador de turnos
    }
  }
}

// Exporta a classe Corrida como padrão (default)
export default Corrida;
