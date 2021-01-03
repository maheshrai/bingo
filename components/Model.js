export function SquareModel() {
  this.number = 0;
  this.checked = false;
  this.key = "";
}

export function CardModel() {
  this.squares = [];
}

export function Player() {
  this.name = "";
  this.email = "";
  this.card = new CardModel();
}

export function Game() {
  this.players = [];
  this.started = false;
  this.numbersCalled = [];
}
