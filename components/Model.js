import Groups from "../pages/groups";

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
  this.id = 0;
  this.card = new CardModel();
}

export function Group() {
  this.name = "";
  this.id = 0;
}

export function Game() {
  this.players = [];
  this.started = false;
  this.completed = false;
  this.calledNumbers = [];
  this.caller = "";
  this.Group = new Group();
}
