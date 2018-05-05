# name: layouts-discordinfo
# about: Layout with informations from Discord
# version: 0.1
# authors: Tobias / exetico
# url: https://github.com/Nordic-T/layouts-discordinfo/

enabled_site_setting :layouts_discordinfo_a_text

register_asset 'stylesheets/discordinfo-layout.scss'

DiscourseEvent.on(:layouts_ready) do
  if defined?(DiscourseLayouts) == 'constant' && DiscourseLayouts.class == Module
    DiscourseLayouts::WidgetHelper.add_widget('discordinfo')
  end
end
