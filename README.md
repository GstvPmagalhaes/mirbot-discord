# mirBOT Discord

Bot de cartas para Discord escrito em TypeScript, preparado para Node.js 24 LTS.

## Desenvolvimento

```sh
npm ci
npm run check
npm run build
npm start
```

Crie um arquivo `.env` na raiz durante o desenvolvimento:

```text
DISCORD_TOKEN=seu_token_aqui
```

O código-fonte fica em `src/` e a compilação é gerada em `dist/`.

## Execução 24/7 com runit no antiX

O exemplo abaixo usa `/opt/mirbot` e um usuário de sistema chamado `mirbot`.

1. Crie o usuário e prepare o projeto:

   ```sh
   sudo adduser --system --group --home /opt/mirbot mirbot
   sudo git clone https://github.com/GstvPmagalhaes/mirbot-discord.git /opt/mirbot
   sudo chown -R mirbot:mirbot /opt/mirbot
   sudo -u mirbot sh -c 'cd /opt/mirbot && npm ci && npm run build'
   ```

2. Guarde o token no formato usado pelo `envdir`:

   ```sh
   sudo -u mirbot mkdir -p /opt/mirbot/deploy/runit/env
   sudo sh -c 'printf %s "SEU_TOKEN_AQUI" > /opt/mirbot/deploy/runit/env/DISCORD_TOKEN'
   sudo chown mirbot:mirbot /opt/mirbot/deploy/runit/env/DISCORD_TOKEN
   sudo chmod 600 /opt/mirbot/deploy/runit/env/DISCORD_TOKEN
   ```

3. Ative o serviço:

   ```sh
   sudo chmod +x /opt/mirbot/deploy/runit/run
   sudo ln -s /opt/mirbot/deploy/runit /etc/service/mirbot
   sudo sv up mirbot
   sudo sv status mirbot
   ```

Para acompanhar a saída do serviço, use o mecanismo de logs configurado no seu antiX ou rode `sudo sv status mirbot`. Para reiniciar depois de uma atualização:

```sh
cd /opt/mirbot
sudo -u mirbot git pull --ff-only
sudo -u mirbot npm ci
sudo -u mirbot npm run build
sudo sv restart mirbot
```

O processo do serviço roda sem privilégios como `mirbot`. Os arquivos `inventory.json` e `daily.json` permanecem na raiz do projeto e são gravados de forma atômica.
