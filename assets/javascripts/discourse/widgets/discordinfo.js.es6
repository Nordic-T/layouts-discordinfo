import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { cook } from 'discourse/lib/text';
import RawHtml from 'discourse/widgets/raw-html';
import showModal from 'discourse/lib/show-modal';

export default createWidget('discordinfo', {
  tagName: 'div.layout.layouts-discordinfo',
  buildKey: (attrs) => 'discordinfo',

  defaultState(attrs) {
    return {
      topic: attrs.topic
    }
  },

  sendShowCreateAccount() {
    const appRoute = this.register.lookup('route:application');
    appRoute.send('showCreateAccount');
  },

  html(attrs, state) {
    const { currentUser } = this;
    const topic = state.topic;
    const username = currentUser.get('username');

    let a_text = Discourse.SiteSettings.layouts_discordinfo_a_text;

    const a_href = Discourse.SiteSettings.layouts_discordinfo_a_href;
    const a_hover = Discourse.SiteSettings.layouts_discordinfo_a_hover;
    const a_faicon = Discourse.SiteSettings.layouts_discordinfo_a_faicon;
    const users_faicon = Discourse.SiteSettings.layouts_discordinfo_users_faicon;
    const channels_faicon = Discourse.SiteSettings.layouts_discordinfo_channels_faicon;
    const a_selectors = Discourse.SiteSettings.layouts_discordinfo_a_selectors;
    const a_customstyle = Discourse.SiteSettings.layouts_discordinfo_a_customstyle;

    const a_opt_newwindow = Discourse.SiteSettings.layouts_discordinfo_opt_a_newwindow;
    const a_opt_faicon = Discourse.SiteSettings.layouts_discordinfo_opt_a_faicon;

    const identifier = Discourse.SiteSettings.layouts_discordinfo_identifier;
    const startChannelsCollapsed = Discourse.SiteSettings.layouts_discordinfo_startChannelsCollapsed;
    const startMembersCollapsed = Discourse.SiteSettings.layouts_discordinfo_startMembersCollapsed;

    ((a_text.indexOf('@username') >= 0) ? a_text = a_text.replace("@username", username) : a_text);
    
    let contents = []

    if (currentUser && !this.site.mobileView) {
    //Content for both topic and frontpage goes here, if the user is logged in

      if (topic) {
        // Topic-content goes here
        contents.push(
          h('div.handles', [
            h('p', `Nothing here at the moment m8!`)
          ])
        )
      } 

      else{
        // Frontpage content goes here.
        contents.push(
          h('div#discordInfo',[
            h('div#_show_discordChannels',[
              h('span.wrapper',[
                h(`i.fa.${channels_faicon}`),
                h('span#_count_discordChannels.noselect',' ')
                //h('span#type','Channels')
              ])
            ]),
            h('div#discordChannels'),
            h('div#_show_discordMembers',[
              h('span.wrapper',[
                h(`i.fa.${users_faicon}`),
                h('span#_count_discordMembers.noselect',' ')
                //h('span#type','Users')
              ])
            ]),
            h('div#discordMembers')
          ]),
          h(`a ${"#discordInfo-linkbutton" + a_selectors}`, {
            href: a_href,
            title: a_hover,
            style: "display:none;" + a_customstyle,
            attributes: {
              'aria-label': a_hover,
              'target': ((a_opt_newwindow) ? "_blank" : "_self")
            }
          }, [((a_opt_faicon) ? h(`i.fa.${a_faicon}`): ""), a_text]), // Need to mix const's and text? Use something like `Here is my ${a_text} with a ${username}!`
          h('span', Discourse.User.currentProp('custom_fields.Discord-brugernavn')),
        )

        // Global settings
        var settings = {};
        settings.serverIdentifier = identifier;
        settings.startChannelsCollapsed = startChannelsCollapsed;
        settings.startMembersCollapsed = startMembersCollapsed;

        function init(){
          // Check settings for collapse
          if (settings.startChannelsCollapsed)
          {
            $('#discordChannels').hide();
          }
          if (settings.startMembersCollapsed)
          {
            $('#discordMembers').hide();
          }
          
          // Ready to fetch data
          fetchData();    
        }
        
        function fetchData(){
          // Fetch data through AJAX
          $.get('https://discordapp.com/api/servers/'+settings.serverIdentifier+'/embed.json', function(data){
            var channels = "";
            var members = "";
            // Channels
            for (var i=0;i<data.channels.length;i++)
            {
              var elem = data.channels[i];
              channels += "<div class='discord-channel'><span>"+elem.name+"</span></div>";
            }
            // Users
            for (var i=0;i<data.members.length;i++)
            {
              var elem = data.members[i];
              members += "<div class='discord-user'><img src="+elem.avatar_url+" /><span>"+(elem.nick != null ? elem.nick : elem.username)+"</span></div>";
            }
            // Populate channels
            $('#discordChannels').html(channels); 
            // Update channel count
            $('#_count_discordChannels').text(data.channels.length);

            // Populate members
            $('#discordMembers').html(members); 
            // Update member count
            $('#_count_discordMembers').text(data.members.length);

            if(!(data.members.includes(username))){
              $('#chat-linkbutton').show()
            }
          });
        }

        init();
        
        $('#_show_discordChannels').on('click', function(e){
          $('#discordChannels').slideToggle('fast');
        });
        $('#_show_discordMembers').on('click', function(e){
          $('#discordMembers').slideToggle('fast');
        });


      }
   }

    return h('div.widget-inner', contents);
  }

});

