require "rails_helper"

describe DiscourseDiscordInfo do
  before do
    @join_text = "Join us today"

    SiteSetting.layouts_discordinfo_a_text = @join_text
  end

end
