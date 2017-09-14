# name: layouts-discordinfo
# about: A custom html widget for use with Discourse Layouts
# version: 0.1
# authors: Angus McLeod

enabled_site_setting :layouts_discordinfo_a_text

after_initialize do
  DiscourseLayouts::WidgetHelper.add_widget('discordinfo')
end
