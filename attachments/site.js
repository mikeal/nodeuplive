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

var mikealPicture = 'https://secure.gravatar.com/avatar/d8eba8dd0e89a0580ec4157681121a79?s=140'
  , mikealDescription = '<div class="hostname">Mikeal Rogers</div><div class="hostdesc">Author of request, filed. Curator of NodeConf</div>'
  , isaacPicture = 'https://secure.gravatar.com/avatar/73a2b24daecb976af81e010b7a3ce3c6?s=140'
  , isaacDescription = '<div class="hostname">Isaac Z. Scluter</div><div class="hostdesc">Creator of npm</div>'
  , paoloPicture = 'https://secure.gravatar.com/avatar/8af5b97a9869fc1387f683afbb875fef?s=140'
  , paoloDescription = '<div class="hostname">Paolo Fragomeni</div><div class="hostdesc">Co-founder and CTO of Nodejitsu</div>'
  , nunoPicture = 'https://secure.gravatar.com/avatar/a998795c23a775e72ee28643c482a1f4?s=140'
  , nunoDescription = '<div class="hostname">Nuno Job</div><div class="hostdesc">Author of nano, founder at ExpenseCat & The Node Firm</div>'
  , dshawPicture = 'https://secure.gravatar.com/avatar/dc2beefe13f65e75fd74eae1b1c1b803?s=140'
  , dshawDescription = '<div class="hostname">Daniel Shaw</div><div class="hostdesc">Socket.io Contributor</div>'
  , substackPicture = 'https://secure.gravatar.com/avatar/d4a2f12ceae3b7f211b661576d22bfb9?s=140'
  , substackDescription = '<div class="hostname">James Halliday</div><div class="hostdesc">Author of nearly 100 modules including dnode</div>'
  , csanzPicture = 'https://secure.gravatar.com/avatar/0fc8248ddec8add2e20b29cc24cf9992?s=140'
  , csanzDescription = '<div class="hostname">Christian Sanz</div><div class="hostdesc">Founder of geekli.st</div>'
  , marcoPicture = 'https://secure.gravatar.com/avatar/30cd2c0748d86f53245986c5dc8281bf?s=140'
  , marcoDescription = '<div class="hostname">Marco Rogers</div><div class="hostdesc">Author of procstreams and libxmljs</div>'
  , chrisPicture = 'https://secure.gravatar.com/avatar/fff2222d0a24009fe938bba62946201a?s=140'
  , chrisDescription = '<div class="hostname">Chris Wiliams</div><div class="hostdesc">Curator of JSConf and author of node-serial</div>'
  , visnuPicture = 'https://secure.gravatar.com/avatar/70281240c4fc8583292ac175e05bb8fe?s=140'
  , visnuDescription = '<div class="hostname">Visnu Pitiyanuvath</div><div class="hostdesc">Creator of Node Knockout</div>'
  ;

var meetup = {
    date: "Monday January 23rd 2012"
  , location: "Bottom of the Hill Bar, SF"
  , locationLink: 'http://maps.google.com/maps/place?q=bottom+of+the+hill&hl=en&cid=9162671024092880955'
  , schedule: [
        ['', mikealDescription, mikealPicture]
      , ['', isaacDescription, isaacPicture]
      , ['', substackDescription, substackPicture]
      , ['', dshawDescription, dshawPicture]
      , ['', paoloDescription, paoloPicture]
      , ['', nunoDescription, nunoPicture]
      , ['', csanzDescription, csanzPicture]
      , ['', marcoDescription, marcoPicture]
      , ['', chrisDescription, chrisPicture]
      , ['', visnuDescription, visnuPicture]
    ]
}

var getAttendeeHtml = function (doc) {
  var text = '<div class="attendee">'+
      '<div class="attendee-left">'+
      '<div class="attendee-pic"><img src="'+'http://www.gravatar.com/avatar/'+hex_md5(doc.email)+'?s=50'+'"></img></div>'+
      '</div>'+
      '<div class="attendee-right">'+
      '<div class="attendee-name">'+doc.name+'</div>'+
      '</div>'+
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
      text +=   '<div class="event-item-left">'
      text +=     '<img class="speaker" src="'+meetup.schedule[i][2]+'" />'
      text +=   '</div>'
      text +=   '<div class="event-item-right">'
      text +=     meetup.schedule[i][0]
      text +=     meetup.schedule[i][1]
      text +=   '</div>'
      text += '</div>'
    }
    text += '<div class="spacer">'
  }
  $('div#upcoming-event').append($(text))
  
  $('#rsvp-button').click(function () {
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
  ;

  $(".rsvp").focus(function(){
    if($(this).val() === $(this).attr("name")){
     $(this).val("");
    }

  });

  $(".rsvp").blur(function(){
    if($(this).val() === ""){
     $(this).val($(this).attr("name"));
    }

  });
  
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
