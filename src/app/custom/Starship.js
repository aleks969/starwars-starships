export default class Starship {
  constructor(name, consumables, passengers) {
    this.name = name;
    this._consumables = consumables;
    this._passengers = passengers;
  }

  get maxDaysInSpace() {
    return this._consumables / this._passengers;
  }
}
