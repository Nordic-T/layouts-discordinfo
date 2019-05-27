# name: layouts-discordinfo
# about: Layout with informations from Discord
# version: 0.2
# authors: Tobias / exetico
# url: https://github.com/Nordic-T/layouts-discordinfo/

enabled_site_setting :layouts_discordinfo_a_text

register_asset 'stylesheets/discordinfo-layout.scss'
register_svg_icon "comment-dots" if respond_to?(:register_svg_icon)
register_svg_icon "users" if respond_to?(:register_svg_icon)
register_svg_icon "arrow-circle-up" if respond_to?(:register_svg_icon)

DiscourseEvent.on(:layouts_ready) do
  if defined?(DiscourseLayouts) == 'constant' && DiscourseLayouts.class == Module
    DiscourseLayouts::WidgetHelper.add_widget('discordinfo')
  end
end
