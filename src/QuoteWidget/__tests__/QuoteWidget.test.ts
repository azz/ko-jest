import {
  getTemplate,
  renderTemplateToDom,
  renderTemplateToRaw
} from "../../utils";
import * as ko from "knockout";
import * as path from "path";
import QuoteWidget from "../QuoteWidget";

const templatePath = path.resolve(__dirname, "..", "Tmpl_QuoteWidget.html");

describe("Quote Widget", () => {
  let script, widget, orderTicketInvoker, securitySearch, datePicker;

  const snapshot = () =>
    expect(
      renderTemplateToRaw(getTemplate(templatePath), widget)
    ).toMatchSnapshot();

  beforeEach(() => {
    // Mock a template
    // script = document.createElement('script');
    // script.type = "text/html";
    // script.id = "Tmpl_DatePicker";
    // script.innerHTML = `
    //   <div data-bind="text: currentDate></div>
    // `;
    // document.body.appendChild(script);


    orderTicketInvoker = {
      buy: jest.fn(),
      sell: jest.fn()
    };
    securitySearch = {
      search: jest.fn()
    };
    datePicker = {
      data: {
        currentDate: ko.observable(new Date())
      }
    }
    widget = new QuoteWidget(orderTicketInvoker, securitySearch, datePicker);
  });

  it("renders successfully", () => {
    snapshot();
  });

  it("renders altered last price", () => {
    widget.lastPrice(100);
    snapshot();
  });

  describe("buy/sell buttons", () => {
    it("are hidden if there's no trading permissions", () => {
      widget.hasTradingPermission(false);
      snapshot();
    });

    it("calls orderTicketInvoker.buy with bid price when the buy button is clicked", () => {
      widget.bidPrice(888);
      const { dom } = renderTemplateToDom(getTemplate(templatePath), widget);
      dom.querySelector(".-buy-button").click();
      expect(orderTicketInvoker.buy).toHaveBeenCalledWith({
        code: "IRE.ASX",
        price: 888
      });
    });

    it("calls orderTicketInvoker.sell with ask price when the sell button is clicked", () => {
      widget.askPrice(777);
      const { dom } = renderTemplateToDom(getTemplate(templatePath), widget);
      dom.querySelector(".-sell-button").click();
      expect(orderTicketInvoker.sell).toHaveBeenCalledWith({
        code: "IRE.ASX",
        price: 777
      });
    });
  });

  describe("search", () => {
    it("calls securitySearch.search with entered text on key up", () => {
      const { dom, window } = renderTemplateToDom(
        getTemplate(templatePath),
        widget
      );
      const input = dom.querySelector(".-security-input");
      expect(input).not.toBeNull();
      input.value = "BHP";
      input.dispatchEvent(new window.Event("keyup"));
      expect(securitySearch.search).toHaveBeenCalledWith(
        "BHP",
        expect.any(Function)
      );
    });

    it("changes value of search box when a successful result comes back", () => {
      const { dom } = renderTemplateToDom(getTemplate(templatePath), widget);
      securitySearch.search = jest.fn((text, cb) =>
        cb({
          success: true,
          code: text + ".ASX"
        })
      );
      widget.onSearch(null, { target: { value: "RIO" } });
      expect(dom.querySelector(".-security-input").value).toBe("RIO.ASX");
    });
  });
});
