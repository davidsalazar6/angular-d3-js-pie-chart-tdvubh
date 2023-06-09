import { Component, VERSION } from "@angular/core";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  data: SimpleDataModel[]  = [
    {
      name: "INTER MIAMI FC",
      value: 271
    },
    {
      name: "UNIVISION HOLDINGS INC",
      value: 60
    },
    {
      name: "TWITTER INC",
      value: 20
    },
    {
      name: "THE JONES FINANCIAL COMPANIES LLLP",
      value: 2
    },
    {
      name: "3M CO",
      value: 5
    },
    {
      name: "GENERAL MOTORS CORP",
      value: 2
    },
    {
      name: "HERTZ GLOBAL HOLDINGS",
      value: 3
    },
    {
      name: "INTERNATIONAL PAPER CO",
      value: 2
    },
    {
      name: "RPM INTERNATIONAL INC",
      value: 1
    },
    {
      name: "SYNEOS HEALTH INC",
      value: 1
    },
    {
      name: "CARLISLE COS INC",
      value: 1
    },
    {
      name: "CHANGE HEALTHCARE INC (UNITEDHEALTH GROUP INC)",
      value: 1
    },
    {
      name: "USAA",
      value: 1
    },
    {
      name: "AMERICAN AIRLINES GROUP INC",
      value: 7
    },
    {
      name: "DISCOVER FINANCIAL SERVICES",
      value: 1
    },
    {
      name: "MARATHON PETROLEUM CORP",
      value: 1
    }
  ];
}

export interface SimpleDataModel {
  name: string;
  value: number;
  // color?: string;
}
