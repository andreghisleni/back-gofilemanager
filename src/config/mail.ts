interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    smtp: {
      email: string;
      pass: string;
      host: string;
    };
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    smtp: {
      email: process.env.MAIL_USER || 'non',
      pass: process.env.MAIL_PASS || 'non',
      host: process.env.MAIL_HOST || 'non',
    },
    from: {
      email: 'noreply@mail.ensinoastronomiaoestesc.com.br',
      name:
        process.env.APP_NAME ||
        'Equipe do III Encontro de Ensino de Astronomia do Oeste Catarinense',
    },
  },
} as IMailConfig;
