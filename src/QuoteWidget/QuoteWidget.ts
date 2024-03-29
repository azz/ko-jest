
import * as ko from "knockout";

export default class QuoteWidget {
  securityCode = ko.observable("IRE.ASX");
  bidPrice = ko.observable(1);
  lastPrice = ko.observable(2);
  askPrice = ko.observable(3);
  hasTradingPermission = ko.observable(true);

  constructor(
    private readonly _orderTicketInvoker,
    private readonly _securitySearch,
    private readonly _datePicker
  ) {}

  onSearch(vm: this, event) {
    this._securitySearch.search(
      event.target.value,
      this.onSearchResult.bind(this)
    );
  }

  onSearchResult(response) {
    if (response.success) {
      this.securityCode(response.code);
    } else {
      this.securityCode("");
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
