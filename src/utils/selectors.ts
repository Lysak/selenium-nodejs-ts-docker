import {By} from "selenium-webdriver";

export const selectors = {
    limitButton: By.css("#bn-tab-LIMIT"),
    instantButton: By.css("#bn-tab-INSTANT"),
    buySectionButton: By.css(".bn-tabs.bn-tabs__buySell #bn-tab-0"),
    sellSectionButton: By.css(".bn-tabs.bn-tabs__buySell #bn-tab-1"),
    buyButton: By.css("button[data-bn-type='submit'][class*='Buy']"),
    sellButton: By.css("button[data-bn-type='submit'][class*='Sell']"),
    price: By.css("#limitPrice"),
    total: By.css("#limitTotal"),
    openPriceValue: By.css(".chart-title-row .chart-title-indicator-container .default-label-box[key=\"o\"]"),
    closePriceValue: By.css(".chart-title-row .chart-title-indicator-container .default-label-box[key=\"c\"]"),
    lowPriceValue: By.css(".chart-title-row .chart-title-indicator-container .default-label-box[key=\"l\"]"),
    highPriceValue: By.css(".chart-title-row .chart-title-indicator-container .default-label-box[key=\"h\"]"),
    isOrderOpen: By.css('.bn-web-table-tbody tr:not(.bn-web-table-measure-row) [aria-colindex="4"]'),
    slider: By.css('.bn-slider'),
};
