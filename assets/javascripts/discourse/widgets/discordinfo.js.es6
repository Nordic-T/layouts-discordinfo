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
    
    const startCollapsed = {
      Channels: Discourse.SiteSettings.layouts_discordinfo_startChannelsCollapsed,
      Members: Discourse.SiteSettings.layouts_discordinfo_startMembersCollapsed
    }

    const counter = '_count_';
    const icon = '_show_';
    const types = ['Members', 'Channels'];

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
        <div id="_show_discordMembers" style="display:none"><span class="wrapper">${iconHTML('users')}</i><span id="_count_discordMembers" class="noselect"> </span></span></div>
        <div id="_show_discordChannels" style="display:none"><span class="wrapper">${iconHTML('comment-dots')}</i><span id="_count_discordChannels" class="noselect"> </span></span></div>
        <div id="discordMembers"></div>
        <div id="discordChannels"></div>
        </div>
        
        <a href="${a_href}" title="${a_hover}" style="display: none; ${a_customstyle}" aria-label="${a_hover}" target="${((a_opt_newwindow) ? "_blank" : "_self")}" id="discordinfo-linkbutton" class="${a_classes}">${a_opt_faicon && iconHTML('arrow-circle-up')}${a_text}</a>
        `

        Ember.run.scheduleOnce('afterRender', this, function() {
          $("div.layouts-discordinfo-inner").append(`<div class='contents'>${html}</div>`);

          function init(){
            // Check settings for collapse
            types.forEach(function(type) {
              if (startCollapsed[type])
              {
                $('#discord' + type).hide();
              }
            });

            // Ready to fetch data
            fetchData();    
          }

          function fetchData(){
            // Fetch data through AJAX
            $.get('https://discordapp.com/api/servers/'+identifier+'/embed.json', function(data){
              
              var html = {
                Members : '',
                Channels : ''
              }
              
              var notpresent = true;

              types.forEach(function(type) {
                var current = data[type.toLowerCase()]
                var len = current.length;

                if(len === 0){// If no data
                  html[type] += '<div><b>' + type + '</b>: No data</div>';

                }else if(len > 0){// Render HTML for type
                  if(type === 'Members'){
                    for (var i=0;i<len;i++)
                    {
                      var elem = current[i];
                      var name = elem.nick != null ? elem.nick : elem.username;
                      html[type] += "<div class='discord-user'><img src="+elem.avatar_url+" /><span>"+name+"</span></div>";
        
                      if(name === username || name === discord_username){
                        notpresent = false;
                      }
                    }

                    // Show join-text, if username not present
                    if(notpresent){
                      $('#discordinfo-linkbutton').show()
                    }
                  }else if(type === Channels){
                    for (var i=0;i<len;i++){
                      var elem = current[i];
                      html[type] += "<div class='discord-channel'><span>"+elem.name+"</span></div>";
                    }
                  }
                }else{// Else, i dont know what to do
                  html[type] += '<div style="color:red;"><b>' + type + '</b>: Error</div>';
                }

                // Populate discord[type]
                $('#discord' + type).html(html[type]);
                if(len > 0){
                  $('#' + counter + 'discord' + type).text(len);
                  $('#' + icon + 'discord' + type).show();

                  // Initiate toggle for type
                  $('#' + icon + 'discord' + type).on('click', function(e){
                    $('#discord' + type).slideToggle('fast');
                  });
                }
              });
            });
          }

          init();

          });
          state.renderScheduled = true;
        }
      }
    }

    return h('div.widget-inner', contents);
  }

});

