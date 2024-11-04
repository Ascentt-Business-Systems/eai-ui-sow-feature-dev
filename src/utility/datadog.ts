import { datadogRum } from '@datadog/browser-rum';
import { DATADOGAPPID, DATADOGENV, DATADOGSERVICE, DATADOGTOKEN } from './constants';
 
datadogRum.init({
    applicationId: DATADOGAPPID,
    clientToken: DATADOGTOKEN,
    // `site` refers to the Datadog site parameter of your organization
    // see https://docs.datadoghq.com/getting_started/site/
    site: 'datadoghq.com',
    service: DATADOGSERVICE,
    env: DATADOGENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
});