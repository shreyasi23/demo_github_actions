import { SystemKey } from "./systems";

class SelectedSystem {
  currentSystem: SystemKey;
  constructor() {
    this.currentSystem = undefined;
  }

  setSystem(system: SystemKey) {
    this.currentSystem = system;
    console.log("THE CURRENT SYSTEM IS SET TO: ", this.currentSystem);
  }
}

const systemSetter = new SelectedSystem();

export default systemSetter;
