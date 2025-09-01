import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';
import { version } from '../../../package.json';

datadogRum.init({
    applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID!,
    clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN!,
    site: 'datadoghq.eu',
    service: 'define',
    env: 'prod',

    version,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    defaultPrivacyLevel: 'mask-user-input',
    plugins: [reactPlugin({ router: true })],
});
