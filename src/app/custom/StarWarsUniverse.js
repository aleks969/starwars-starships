import Starship from "./Starship";

export default class StarWarsUniverse {
  constructor() {
    this.starships = [];
    this.starshipCount = 0;
  }

  async _getStarshipCount() {
    const res = await fetch(`https://swapi.boom.dev/api/starships/`);
    const { count } = await res.json();
    // console.log(count);
    this.starshipCount = count;
  }

  async _createStarships() {
    let counter = 0;

    while (counter !== this.starshipCount) {
      let url = `https://swapi.boom.dev/api/starships/${counter}`;

      const res = await fetch(url);
      if (res.status === 404) {
        counter++;
        continue;
      } else {
        const starshipsData = await res.json();
        console.log(starshipsData);

        if (this._validateData(starshipsData)) {
          const starship = new Starship(
            starshipsData.name,
            this.convertConsumablesToNumber(starshipsData.consumables),
            parseInt(starshipsData.passengers.replace(",", ""))
          );
          // console.log(starship);
          this.starships.push(starship);
        }
        counter++;
      }
    }
  }

  _validateData(starship) {
    if (
      typeof starship.consumables === undefined ||
      typeof starship.consumables === null ||
      starship.consumables === "unknown"
    ) {
      return false;
    } else if (
      typeof starship.passenger === undefined ||
      typeof starship.passengers === null ||
      starship.passengers === "unknown" ||
      starship.passengers === "0" ||
      starship.passengers === "n/a"
    ) {
      return false;
    } else return true;
  }

  convertConsumablesToNumber(str) {
    const substrings = str.split(" ");
    const days =
      parseInt(substrings[0]) * this.convertDateToDays(substrings[1]);
    return days;
  }

  convertDateToDays(str) {
    const daysMap = {
      year: 365,
      years: 365,
      month: 30,
      months: 30,
      week: 7,
      days: 1,
    };

    let res = 0;

    Object.keys(daysMap).forEach((key) => {
      if (str === key) res = daysMap[key];
    });

    return res;
  }

  get theBestStarship() {
    let bestStarship;
    let maxDaysInSpace = 0;

    this.starships.forEach((starship) => {
      if (starship.maxDaysInSpace > maxDaysInSpace) {
        bestStarship = starship;
        maxDaysInSpace = starship.maxDaysInSpace;
      }
    });

    return bestStarship;
  }

  async init() {
    await this._getStarshipCount();
    await this._createStarships();
    // console.log(this.starships);
    // console.log(this.theBestStarship);
  }
}
