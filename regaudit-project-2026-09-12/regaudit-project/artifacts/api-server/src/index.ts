import { createApp } from './app';
import { env } from './env';

const app = createApp();

app.listen(env.port, '0.0.0.0', () => {
  console.log(`RegAudit API server listening on port ${env.port}`);
});
