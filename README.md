# Botmock Jovo Export

Bring a [Jovo](https://www.jovo.tech) project to parity with a [Botmock](https://botmock.com) project from the command line.

- Tutorial Video (Coming Soon)
- Documentation (Coming Soon)
- [Support Email](mailto:help@botmock.com)

## Prerequisites

- [Node.js](https://nodejs.org/en/) >= 12.x

```shell
node --version
```

- [Jovo](https://github.com/jovotech/jovo-cli)

### Guide

- clone this repository by running `git clone git@github.com:Botmock/botmock-jovo-export.git`
- `cd` into `botmock-jovo-export`
- create `.env` containing the below content with your values filled in:
```shell
BOTMOCK_TEAM_ID=@botmock-team-id
BOTMOCK_PROJECT_ID=@botmock-project-id
BOTMOCK_BOARD_ID=@botmock-board-id
BOTMOCK_TOKEN=@botmock-token

```

- run `npm install`
- run `npm start`
- `cd` into `output`
- run `jovo run` to generate your [webhook url](https://www.jovo.tech/docs/cli/run)

## Want to help?

Found bugs or have some ideas to improve this integration? We'd love to to hear from you! You can start by submitting an issue at the [Issues](https://github.com/Botmock/botmock-jovo-export/issues) tab. If you want, feel free to submit a pull request and propose a change as well!

### Submitting a Pull Request

1. Create an issue; the more information, the better!
2. Fork the Repository.
3. Make a change under a branch based on master. Ideally, the branch should be based on the issue you made such as "issue-530"
4. Make the Pull Request, followed by a brief description of the changes you've made. Reference the issue.

_NOTE: Make sure to leave any sensitive information out of an issue when reporting a bug with imagery or copying and pasting error data. We want to make sure all your info is safe!_

## License

Botmock Jovo Export is copyright © 2019 Botmock. It is free software, and may be redistributed under the terms specified in the LICENSE file.
