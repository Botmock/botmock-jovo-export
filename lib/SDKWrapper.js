import Botmock from "botmock";

export default class SDKWrapper {
  constructor(config = { debug: false }) {
    this.config = config;
    this.token = process.env.BOTMOCK_TOKEN;
    this.args = [process.env.BOTMOCK_TEAM_ID, process.env.BOTMOCK_PROJECT_ID];
  }

  async init() {
    this.client = new Botmock({
      api_token: this.token,
      debug: this.config.debug
    });
    const { name } = await this.client.projects(...this.args);
    const { board = {} } = await this.client.boards(
      ...this.args,
      process.env.BOTMOCK_BOARD_ID
    );
    const intents = await this.client.intents(...this.args);
    return { name, intents, messages: board.messages || [] };
  }
}
