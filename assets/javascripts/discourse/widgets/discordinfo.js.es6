import { createWidget } from 'discourse/widgets/widget';
import RawHtml from 'discourse/widgets/raw-html';

export default createWidget('discordinfo', {
  tagName: 'div.discordinfo',

  html() {
    return new RawHtml({ html: this.siteSettings.layouts_discordinfo_a_text })
  }
})
