class Engine {
  constructor(horsePower, cc, numberOfGears) {
    this.horsePower = horsePower;
    this.cc = cc;
    this.numberOfGears = numberOfGears;
  }

  toString() {
    return `Horse Power: ${this.horsePower} HP, CC: ${this.cc}cc, Gears: ${this.numberOfGears}`;
  }
}

class Car {
  constructor(brand, price, engine) {
    this.brand = brand;
    this.price = price;
    this.engine = engine;
  }

  toString() {
    return `------- Car Info -------\nBrand: ${this.brand}\nPrice: $${
      this.price
    }\nEngine: ${this.engine.toString()}`;
  }
}

function createListOfCarRawInfo() {
  return [
    "Ford, 33000, 35, 2000, 6",
    "Toyota, 23000, 40, 2100, 6",
    "Mitsubishi, 44000, 45, 2200, 6",
    "Nissan, 21000, 37, 2300, 6",
    "GM, 25000, 39, 2400, 6",
    "VW, 42000, 25, 2500, 6",
  ];
}

function createListOfCarRawInfo() {
  return [
    "Ford, 33000, 35, 2000, 6",
    "Toyota, 23000, 40, 2100, 6",
    "Mitsubishi, 44000, 45, 2200, 6",
    "Nissan, 21000, 37, 2300, 6",
    "GM, 25000, 39, 2400, 6",
    "VW, 42000, 25, 2500, 6",
  ];
}

function createListOfCarObjects(listOfCars) {
  let carObjects = [];

  for (let carStr of listOfCars) {
    let parts = carStr.split(",").map((item) => item.trim());
    let brand = parts[0];
    let price = parseFloat(parts[1]);
    let horsePower = parseInt(parts[2]);
    let cc = parseInt(parts[3]);
    let numberOfGears = parseInt(parts[4]);

    let engine = new Engine(horsePower, cc, numberOfGears);
    let car = new Car(brand, price, engine);

    carObjects.push(car);
  }

  return carObjects;
}

function printInventory(listOfCarObjects) {
    for (let car of listOfCarObjects) {
        console.log(car.toString());
    }
}

function main() {
    let listOfCars = createListOfCarRawInfo();
    console.log("Raw Car Data:");
    console.log(listOfCars);

    let listOfCarObjects = createListOfCarObjects(listOfCars);
    console.log("\nCar Objects:");
    console.log(listOfCarObjects);

    console.log("\nInventory:");
    printInventory(listOfCarObjects);
}

main();
