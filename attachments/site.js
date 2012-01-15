var request = function (options, callback) {
  options.success = function (obj) {
    callback(null, obj);
  }
  options.error = function (err) {
    if (err) callback(err);
    else callback(true);
  }
  options.dataType = 'json';
  options.contentType = 'application/json'
  $.ajax(options)
}

var aaronPicture = 'http://www.gravatar.com/avatar/f04bfa14141dca6713f0d9caa763e26b?s=140';
var aaronDescription = 
  "Sammy: The Next Generation - Aaron Quint<br><br>" +
  "Big Daddy Kane once said \"Client Side Routin Ain't Easy\". We'll show off some of the new features of Sammy.next (including HTML5 History Support) that make it easy AND fun."
  ;
  
var alexPicture = 'http://www.dayofjs.com/img/speakers/alex_russell.png?s=140';
var alexDescription = 
  "What browsers really think of your web page - Alex Russell<br><br>" +
  "A guided tour through the bowels of the browser."
  ;

var mikealPicture = 'https://secure.gravatar.com/avatar/d8eba8dd0e89a0580ec4157681121a79?s=140'
  , mikealDescription = '<h4>Mikeal Rogers</h4> Author of request, filed. Curator of NodeConf'
  , dshawPicture = 'https://secure.gravatar.com/avatar/dc2beefe13f65e75fd74eae1b1c1b803?s=140'
  , dshawDescription = '<h4>Daniel Shaw</h4> socket.io contributor'
  , substackPicture = 'https://secure.gravatar.com/avatar/d4a2f12ceae3b7f211b661576d22bfb9?s=140'
  , substackDescription = '<h4>James Halliday AKA substack</h4> Author of nearly 100 modules including dnode'
  , csanzPicture = 'https://secure.gravatar.com/avatar/0fc8248ddec8add2e20b29cc24cf9992?s=140'
  , csanzDescription = '<h4>Christian Sanz</h4> Founder of geekli.st'
  , marcoPicture = 'https://secure.gravatar.com/avatar/30cd2c0748d86f53245986c5dc8281bf?s=140'
  , marcoDescription = '<h4>Marco Rogers</h4> Author of procstreams and libxmljs'
  , chrisPicture = 'https://secure.gravatar.com/avatar/fff2222d0a24009fe938bba62946201a?s=140'
  , chrisDescription = '<h4>Chris Wiliams</h4> Curator of JSConf and author of node-serial'
  , visnuPicture = 'https://secure.gravatar.com/avatar/70281240c4fc8583292ac175e05bb8fe?s=140'
  , visnuDescription = '<h4>Visnu Pitiyanuvath</h4> Creator of Node Knockout.'
  ;

var meetup = {
    date: "Monday January 23rd 2012"
  , location: "Bottom of the Hill Bar, SF"
  , locationLink: 'http://maps.google.com/maps/place?q=bottom+of+the+hill&hl=en&cid=9162671024092880955'
  , schedule: [
        ['8pm', 'Doors open, drink and socialize']
      , ['9ish', 'Live Podcast w/ special guests:']
      , ['', mikealDescription, mikealPicture]
      , ['', dshawDescription, dshawPicture]
      , ['', substackDescription, substackPicture]
      , ['', csanzDescription, csanzPicture]
      , ['', marcoDescription, marcoPicture]
      , ['', chrisDescription, chrisPicture]
      , ['', visnuDescription, visnuPicture]
    ]
}

var getAttendeeHtml = function (doc) {
  var text = '<div class="attendee">'+
    '<div class="attendee-name">'+doc.name+'</div>'+
    '<div class="attendee-pic">'+
      '<img class="attendee-pic" src="'+'http://www.gravatar.com/avatar/'+
        hex_md5(doc.email)+'?s=50'+'"></img></div>'+
  '</div>'
  return text;
}

var app = {};

app.index = function () {
  $("div#main-container").prepend('<div class="event-title">'+meetup.date+' @ '+'<a href="'+meetup.locationLink+'">'+meetup.location+'</a></div>')
  var text = '';
  for (var i=0;i<meetup.schedule.length;i++) {
    if (meetup.schedule[i].length === 2) {
      text += '<div class="event-item">'
      text +=   '<div class="event-time">'+meetup.schedule[i][0]+'</div>'
      text +=   '<div class="event-break-title"><span class="code">'+meetup.schedule[i][1]+'</span></div>'
      text += '</div>'
    } else {
      text += '<div class="event-item">'
      text +=   '<div class="event-time">'+meetup.schedule[i][0]+'</div>'
      text +=   '<div class="event-talk-title">'+meetup.schedule[i][1]+'</div>'
      text +=   '<div class="event-talk-pic"><img class="speaker" src="'+meetup.schedule[i][2]+'" /></div>'
      text += '</div>'
    }
    text += '<div class="spacer">'
  }
  $('div#upcoming-event').append($(text))
  
  $('span#rsvp-button').click(function () {
    var data = {  email: $("input[name=email]").val()
                , name: $("input[name=name]").val()
                , type: 'rsvp'
                , eventDate: meetup.date
                }
    request({type:'POST', url:'/api', data: JSON.stringify(data)}, function (err, obj) {
      if (obj.id) {
        $("div#rsvp").remove();
        $("div#attendees").append($(getAttendeeHtml(data)));
      }
    })
  })
  .hover(
      function () {$(this).css("background-color", "#BABABA")}, 
      function () {$(this).css("background-color", "#AAAAAA")}
  )
  ;
  
  request({url:'/_view/rsvp?'+$.param({key: JSON.stringify(meetup.date), include_docs:'true'})}, function (err, resp) {
    resp.rows.forEach( function (row) {
      $("div#attendees").append($(
        getAttendeeHtml(row.doc)
      ));
    })
    $("div#attendees").append($('<div class="spacer">&nbsp</div>'))
  })
}

var a = $.sammy(function () {
  // Index of all databases
  this.get('', app.index);
  this.get("#/", app.index);
  
})

$(function () {a.use('Mustache'); a.run(); });
