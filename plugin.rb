# name: layouts-discordinfo
# about: Layout with informations from Discord
# version: 0.1
# authors: Tobias / exetico
# url: https://github.com/Nordic-T/layouts-discordinfo/

enabled_site_setting :layouts_discordinfo_a_text

after_initialize do
  DiscourseLayouts::WidgetHelper.add_widget('discordinfo')
end
