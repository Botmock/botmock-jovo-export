# botmock-jovo-export

> requires node.js >= 10.5.x

Bring a [Jovo](https://www.jovo.tech) project to parity with a [Botmock](https://botmock.com) project from the command line

### Guide

- clone this repository by running `git clone git@github.com:Botmock/botmock-jovo-export.git`

- create `/.env` and fill it with the following:

```console
BOTMOCK_TEAM_ID="@TEAM-ID"
BOTMOCK_PROJECT_ID="@PROJECT-ID"
BOTMOCK_BOARD_ID="@BOARD-ID"
BOTMOCK_TOKEN="@TOKEN-ID"
JOVO_WEBHOOK_URL="@JOVO-URL"

```

- run `npm i`

- run `npm start`
