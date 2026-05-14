import { bootstrapApplication }
from '@angular/platform-browser';

import { AppComponent }
from './app/app.component';

import { appConfig }
from './app/app.config';

// ✅ Charts

import {
  provideCharts,
  withDefaultRegisterables
} from 'ng2-charts';

bootstrapApplication(

  AppComponent,

  {
    providers: [

      // ✅ Chart.js provider

      provideCharts(
        withDefaultRegisterables()
      ),

      // ✅ Existing app providers

      ...appConfig.providers
    ]
  }

).catch((err) =>
  console.error(err)
);