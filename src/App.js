import React from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Bar from "./Bar.js";
import "./App.css";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const YELLOW = "#FBC02D";
const GREEN = "#8BC34A";
const PURPLE = "#735ceb";

const QUICKSORT = 0;
const MERGESORT = 1;
const BUBBLESORT = 2;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      arrBars: [],
      numBars: 12,
      isSorted: false,
      isSorting: false,
      speed: 1
    };

    this.generate = this.generate.bind(this);
    this.sortMethod = this.sortMethod.bind(this);
    this.setSpeed = this.setSpeed.bind(this);
    this.setSize = this.setSize.bind(this);
  }

  async componentDidMount() {
    let arr = new Array(this.state.numBars);
    for (let i = 0; i < this.state.numBars; i++) {
      arr[i] = 0;
    }
    let barArr = arr.map((item, index) => {
      return <Bar value={item} key={index} backgroundColor={PURPLE} />;
    });
    await this.setState({ arrBars: barArr });
    await sleep(100);
    // quando si carica il sito, le barre hanno altezza 0
    // poi con la funzione generate ogni barra assume altezza corrispondente al valore casuale
    // si fa tutto cio' per ottenere l'animazione iniziale di innnalzamento
    this.generate();
  }

  async setSize(val) {
    await this.setState({ numBars: val });
    this.generate();
  }

  async setSpeed(val) {
    await this.setState({ speed: val });
  }

  // restituisce la barra nella posizione index cambiato di colore
  colorChanged(index, color) {
    let element = this.state.arrBars[index];
    return (
      <Bar
        value={element.props.value}
        key={element.key}
        backgroundColor={color}
      />
    );
  }

  // smista la richiesta di ordinamento
  async sortMethod(type) {
    let arr = this.state.arrBars;
    if (this.state.isSorted) {
      for (let i = 0; i < this.state.numBars; i++) {
        arr[i] = this.colorChanged(i, PURPLE);
      }
      this.setState({ arrBars: arr });
    }
    this.setState({ isSorting: true });
    switch (type) {
      case QUICKSORT:
        await this.quickSort();
        break;
      case BUBBLESORT:
        await this.bubbleSort();
        break;
      case MERGESORT:
        arr = await this.mergeSort();
        for (let i = 0; i < this.state.numBars; i++)
          arr[i] = this.colorChanged(i, GREEN);
        this.setState({ arrBars: arr });
        break;
      default:
        break;
    }
    this.setState({ isSorted: true, isSorting: false });
  }

  async merge(arr, start, end) {
    const mid = Math.floor((start + end) / 2);
    for (let i = start; i <= end; i++) arr[i] = this.colorChanged(i, YELLOW);
    let tmpArr = [...arr];
    let i = start,
      j = mid + 1,
      k = start;
    // si mostra la porzione di array da ordinare e unire
    this.setState({ arrBars: tmpArr });
    await sleep(Math.floor(300 / this.state.speed));
    while (i <= mid && j <= end) {
      if (arr[i].props.value < arr[j].props.value) {
        tmpArr[k] = arr[i];
        i++;
      } else {
        tmpArr[k] = arr[j];
        j++;
      }
      k++;
    }
    while (i <= mid) {
      tmpArr[k] = arr[i];
      k++;
      i++;
    }
    while (j <= end) {
      tmpArr[k] = arr[j];
      k++;
      j++;
    }
    // si mostra la porzione di array ordinata
    this.setState({ arrBars: tmpArr });
    await sleep(Math.floor(250 / this.state.speed));
    return tmpArr;
  }

  async mergeSort(
    arr = this.state.arrBars,
    start = 0,
    end = this.state.numBars - 1
  ) {
    if (start >= end) return arr;
    const mid = Math.floor((start + end) / 2);
    arr = await this.mergeSort(arr, start, mid);
    arr = await this.mergeSort(arr, mid + 1, end);
    arr = await this.merge(arr, start, end);
    for (let i = start; i <= end; i++) {
      arr[i] = this.colorChanged(i, PURPLE);
    }
    // si mostra lo stato attuale dell'array
    this.setState({ arrBars: arr });
    await sleep(Math.floor(250 / this.state.speed));
    return arr;
  }

  async quickSort(
    arr = this.state.arrBars,
    start = 0,
    end = this.state.numBars - 1
  ) {
    if (start > end) return;  // > e non >= per renderizzare in verde tutti gli elementi
    let i = start,
      j = start;
    // arr[end] è il punto di riferimento per i confronti
    arr[end] = this.colorChanged(end, YELLOW);
    while (i < end) {
      // decolorazione indice precedente e colorazione di quello attuale
      if (i !== start)
        arr[i - 1] = this.colorChanged(i - 1, PURPLE);
      arr[i] = this.colorChanged(i, YELLOW);
      if (j !== i)
        arr[j] = this.colorChanged(j, YELLOW);
      this.setState({ arrBars: arr });
      await sleep(Math.floor(150 / this.state.speed));
      if (arr[i].props.value < arr[end].props.value) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        // si mostra lo scambio effettuato
        this.setState({ arrBars: arr });
        await sleep(Math.floor(100 / this.state.speed));
        arr[j] = this.colorChanged(j, PURPLE);
        j++;
      }
      i++;
    }
    // decolorazione dell'ultimo indice
    if (i - 1 !== end) {
      if (i - 1 >= start) {
        arr[i - 1] = this.colorChanged(i - 1, PURPLE);
      }
    }
    // scambio di j e end come previsto nell'algoritmo
    if (j !== end) {
      arr[j] = this.colorChanged(j, YELLOW);
      this.setState({ arrBars: arr });
      [arr[end], arr[j]] = [arr[j], arr[end]];
      this.setState({ arrBars: arr });
      arr[end] = this.colorChanged(end, PURPLE);
    }
    arr[j] = this.colorChanged(j, GREEN);
    this.setState({ arrBars: arr });
    await this.quickSort(arr, start, j - 1);
    await this.quickSort(arr, j + 1, end);
  }

  async bubbleSort() {
    let arr = this.state.arrBars;
    let len = this.state.numBars;
    for (let i = 0; i < len; i++) {
      // si comincia sempre dal primo elemento nel bubble sort
      arr[0] = this.colorChanged(0, YELLOW);
      for (let j = 1; j < len - i; j++) {
        // si colora l'indice man mano che si scorre
        if (j !== 1) arr[j - 2] = this.colorChanged(j - 2, PURPLE);
        arr[j] = this.colorChanged(j, YELLOW);
        this.setState({ arrBars: arr });
        await sleep(Math.floor(150 / this.state.speed));
        if (arr[j - 1].props.value > arr[j].props.value) {
          [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
          // si mostra lo scambio effettuato
          await sleep(Math.floor(100 / this.state.speed));
          this.setState({ arrBars: arr });
        }
      }
      // colorazione ultimo elemento in posizione corretta
      if (len - i - 1 >= 0)
        arr[len - i - 1] = this.colorChanged(len - i - 1, GREEN);
      // decolorazione delle barre gialle
      if (len - i - 2 >= 0)
        arr[len - i - 2] = this.colorChanged(len - i - 2, PURPLE);
      this.setState({ arrBars: arr });
    }
  }

  // genera un'array di numeri interi casuali da 5 a 95
  // da questo, crea un'array di Bar da assegnare allo stato del componente
  generate() {
    let arr = new Array(this.state.numBars);
    for (let i = 0; i < this.state.numBars; i++) {
      arr[i] = Math.floor(Math.random() * 100 - 5 + 1) + 5;
    }
    let barArr = arr.map((item, index) => {
      return <Bar value={item} key={index} backgroundColor={PURPLE} />;
    });
    this.setState({ arrBars: barArr, isSorted: false });
  }

  render() {
    return (
      <section className="App" id="App">
        <Header
          generate={this.generate}
          sortMethod={this.sortMethod}
          isSorting={this.state.isSorting}
          speedValue={this.state.speed}
          sizeValue={this.state.numBars}
          setSpeed={this.setSpeed}
          setSize={this.setSize}
        />
        <Main bars={this.state.arrBars} />
      </section>
    );
  }
}
