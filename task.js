class VendingMachine {
    constructor() {
      this.products = {
        cola: { price: 1.00, stock: 5 },
        crisps: { price: 0.50, stock: 5 },
        chocolate: { price: 0.65, stock: 5 },
      };
      this.validCoins = [0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1, 2];
      this.insertedCoins = [];
      this.availableChange = {
        0.01: 10,
        0.02: 10,
        0.05: 10,
        0.10: 10,
        0.20: 10,
        0.50: 10,
        1: 10,
        2: 10,
      };
    }
  
    insertCoin(coin) {
      if (this.validCoins.includes(coin)) {
        this.insertedCoins.push(coin);
        this.availableChange[coin]++;
        return this.getInsertedAmount();
      } else {
        return "Invalid coin";
      }
    }
  
    getInsertedAmount() {
      return this.insertedCoins.reduce((sum, coin) => sum + coin, 0);
    }
  
    canMakeChange(amount) {
      let remainingAmount = amount;
      for (const coin of this.validCoins.reverse()) {
        const requiredCoins = Math.min(Math.floor(remainingAmount / coin), this.availableChange[coin]);
        remainingAmount -= requiredCoins * coin;
        if (remainingAmount < 0.01) {
          return true;
        }
      }
      return false;
    }
  
    exactChangeRequired() {
      return !this.canMakeChange(Math.max(...Object.values(this.products).map(p => p.price)));
    }
  
    selectProduct(productName) {
      const product = this.products[productName];
  
      if (!product) {
        return "Invalid product";
      }
  
      if (product.stock === 0) {
        return "SOLD OUT";
      }
  
      const insertedAmount = this.getInsertedAmount();
  
      if (insertedAmount < product.price) {
        return `PRICE £${product.price.toFixed(2)}`;
      }
  
      const change = insertedAmount - product.price;
  
      if (!this.canMakeChange(change)) {
        return "EXACT CHANGE ONLY";
      }
  
      product.stock--;
      this.insertedCoins = [];
  
      // Update available change in the machine
      for (const coin of this.validCoins.reverse()) {
        const requiredCoins = Math.floor(change / coin);
        this.availableChange[coin] -= requiredCoins;
      }
  
      return "THANK YOU";
    }
  
    returnCoins() {
      const returnedCoins = this.insertedCoins;
      this.insertedCoins = [];
      return returnedCoins;
    }
  }
  
  // Example usage
  const vendingMachine = new VendingMachine();
  
  console.log(vendingMachine.insertCoin(0.50)); // 0.50
  console.log(vendingMachine.selectProduct("crisps")); // THANK YOU
  console.log(vendingMachine.insertCoin(1));
  console.log(vendingMachine.selectProduct("cola")); // THANK YOU
  console.log(vendingMachine.returnCoins()); // []
  