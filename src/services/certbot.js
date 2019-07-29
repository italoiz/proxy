import { spawnSync } from 'child_process';

class CertbotService {
  certbotVersion() {
    try {
      const { error, stdout, status } = spawnSync('certbot', ['--version']);

      if (error || status !== 0) {
        throw new Error('could not find certbot');
      }

      return stdout.toString().trim();
    } catch (err) {
      return false;
    }
  }

  generateCerts(domains, email) {
    if (this.certbotVersion() !== false) {
      const debug = process.env.SSL_DEBUG ? ['--dry-run', '--debug'] : [];

      domains = domains.map(domain => `-d ${domain}`);
      email = email ? [`-m ${email}`] : [];

      try {
        const params = [
          'certonly',
          '--webroot',
          '-w /usr/share/nginx/html',
          ...domains,
          ...email,
          '--non-interactive',
          '--agree-tos',
          '--quiet',
          ...debug,
        ];

        const { error, stdout, stderr, status } = spawnSync('certbot', params, {
          shell: true,
        });

        if (error || status !== 0) {
          const err = stderr || error.message;
          throw new Error(`certbot ${params.join(' ')}\n${err}`);
        }

        if (debug) {
          process.stdout.write(stdout);
        }

        const log = `certificates generated for domains ${domains.join(', ')}`;
        process.stdout.write(log);
      } catch (err) {
        if (process.env.NODE_ENV === 'production') {
          process.stderr.write(err.message);
          process.exit(1);
        }
      }
    }
  }
}

export default new CertbotService();
