export default class GameModel {
  constructor(playerName) {
    this.playerName = playerName;
  }

  get state() {
    return Object.freeze(this._state);
  }

}
