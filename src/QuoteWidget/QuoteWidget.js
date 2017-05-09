const ko = require("knockout");

module.exports = class QuoteWidget {
  constructor(orderTicketInvoker, securitySearch) {
    this._orderTicketInvoker = orderTicketInvoker;
    this._securitySearch = securitySearch;

    this.securityCode = ko.observable("IRE.ASX");
    this.bidPrice = ko.observable(1);
    this.lastPrice = ko.observable(2);
    this.askPrice = ko.observable(3);
    this.hasTradingPermission = ko.observable(true);
  }

  onSearch(vm, event) {
    this._securitySearch.search(
      event.target.value,
      this.onSearchResult.bind(this)
    );
  }

  onSearchResult(response) {
    if (response.success) {
      this.securityCode(response.code);
    }
  }

  onBuy() {
    this._orderTicketInvoker.buy({
      code: this.securityCode(),
      price: this.bidPrice()
    });
  }

  onSell() {
    this._orderTicketInvoker.sell({
      code: this.securityCode(),
      price: this.askPrice()
    });
  }
};
