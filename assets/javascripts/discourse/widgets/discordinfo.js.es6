import { createWidget } from 'discourse/widgets/widget';
import { iconHTML } from "discourse-common/lib/icon-library";
import { h } from 'virtual-dom';

export default createWidget('discordinfo', {
  tagName: 'div.layout.layouts-discordinfo',
  buildKey: (attrs) => 'discordinfo',

  defaultState(attrs) {
    return {
      renderScheduled: false
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
    const discord_username =  Discourse.User.currentProp('custom_fields.Discord-brugernavn');

    let a_text = Discourse.SiteSettings.layouts_discordinfo_a_text;

    const a_href = Discourse.SiteSettings.layouts_discordinfo_a_href;
    const a_hover = Discourse.SiteSettings.layouts_discordinfo_a_hover;
    const a_classes = Discourse.SiteSettings.layouts_discordinfo_a_classes;
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

      if (!(topic)) {
        contents.push(
          h(`div.layouts-discordinfo-inner`, {
            style: "min-height:42px"
          })) // Need to mix const's and text? Use something like `Here is my ${a_text} with a ${username}!`

        // Frontpage content goes here.
        if (!state.renderScheduled) {
        let html = `
        <div id="discordinfo">
        <div id="_show_discordChannels"><span class="wrapper">${iconHTML('comment-dots')}</i><span id="_count_discordChannels" class="noselect"> </span></span></div>
        <div id="discordChannels"></div>
        <div id="_show_discordMembers"><span class="wrapper">${iconHTML('users')}</i><span id="_count_discordMembers" class="noselect"> </span></span></div>
        <div id="discordMembers"></div>
        </div>
        
        <a href="${a_href}" title="${a_hover}" style="display: none; ${a_customstyle}" aria-label="${a_hover}" target="${((a_opt_newwindow) ? "_blank" : "_self")}" id="discordinfo-linkbutton" class="${a_classes}">${a_opt_faicon && iconHTML('arrow-circle-up')}${a_text}</a>
        `

        Ember.run.scheduleOnce('afterRender', this, function() {
          $("div.layouts-discordinfo-inner").append(`<div class='contents'>${html}</div>`);


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
            var notpresent = true;
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
              var name = elem.nick != null ? elem.nick : elem.username;
              members += "<div class='discord-user'><img src="+elem.avatar_url+" /><span>"+name+"</span></div>";

              if(name === username || name === discord_username){
                notpresent = false;
              }
            }
            // Show join-text if user isn't present in Discord list
            if(notpresent){
              $('#discordinfo-linkbutton').show()
            }

            // Populate channels
            if(data.channels.length === 0){
              $('#discordChannels').html("<center>No data to show...</center>");   
              $('#_count_discordChannels').text("-");
            }else{
              $('#discordChannels').html(channels);   
              $('#_count_discordChannels').text(data.channels.length);
            }

            // Populate channels
            if(data.members.length === 0){
              $('#discordMembers').html("<center>No data to show...</center>");   
              $('#_count_discordMembers').text("-");
            }else{
              $('#discordMembers').html(members); 
              $('#_count_discordMembers').text(data.members.length);
            }

          });

          intToggle();
        }

        function intToggle(){
          $('#_show_discordChannels').on('click', function(e){
            $('#discordChannels').slideToggle('fast');
          });
          $('#_show_discordMembers').on('click', function(e){
            $('#discordMembers').slideToggle('fast');
          });
        }
        init(); // FOLD IND UD VIRKER IKKKE...



        });
        state.renderScheduled = true;


      }
   }
    }
    //return iconHTML('comment-dots');
    return h('div.widget-inner', contents);
    //return '';
  }

});

