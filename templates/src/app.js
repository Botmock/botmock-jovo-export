import { App } from 'jovo-framework';
import { Alexa } from 'jovo-platform-alexa';
import { GoogleAssistant } from 'jovo-platform-googleassistant';

const app_ = new App();

app_.use(new Alexa(), new GoogleAssistant());

app_.setHandler();

export const app = app_;
