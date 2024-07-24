import {WisdomInterface} from "common";

import {GrowlComponent} from "./lib/growl.component";
import de_DE from "./i18n/de_DE";
import en_US from "./i18n/en_US";

export const wisdomInterface: WisdomInterface = {
  route: {
    path: "growl",
    component: GrowlComponent,
  },
  scopes: [],
  translations: {
    de_DE,
    en_US,
  },
};

export * from "./lib/growl.service";
export * from "./lib/growl.component";
export * from "./lib/growl.module";
