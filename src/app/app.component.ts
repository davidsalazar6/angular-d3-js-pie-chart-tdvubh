import { Component, VERSION } from "@angular/core";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  data: SimpleDataModel[] = [
    {
        name: "Factiva - News",
        value: 60
    },
    {
        name: "BoardEx",
        value: 60
    },
    {
        name: "AuditAnalytics",
        value: 174
    },
    {
        name: "AuditAnalytics - SEC filings",
        value: 58
    },
    {
        name: "Refinitiv - StockReportsPlus",
        value: 58
    },
    {
        name: "MSCI - ESG Ratings",
        value: 58
    },
    {
        name: "Refinitiv - MnA",
        value: 58
    },
    {
        name: "ISS",
        value: 58
    },
    {
        name: "CFRA",
        value: 58
    },
    {
        name: "Refinitiv - SymCo",
        value: 58
    }
];
}

export interface SimpleDataModel {
  name: string;
  value: number;
  // color?: string;
}
