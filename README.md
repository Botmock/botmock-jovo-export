# botmock-jovo-export

> requires node.js >= 10.5.x and a global install of `jovo-cli`

Bring a [Jovo](https://www.jovo.tech) project to parity with a [Botmock](https://botmock.com) project from the command line

### Guide

- clone this repository by running `git clone git@github.com:Botmock/botmock-jovo-export.git`

- in the created directory, create `/.env` and fill it with the following:

```console
BOTMOCK_TEAM_ID="@YOUR-TEAM-ID"
BOTMOCK_PROJECT_ID="@YOUR-PROJECT-ID"
BOTMOCK_BOARD_ID="@YOUR-BOARD-ID"
BOTMOCK_TOKEN="@YOUR-TOKEN-ID"
JOVO_WEBHOOK_URL="@YOUR-JOVO-URL"

```

- run `npm i`

- run `npm start`

- run any [jovo commands](https://github.com/jovotech/jovo-cli#commands) from within `/output`
