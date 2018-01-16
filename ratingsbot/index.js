var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

// replace with API token
var rtm = new RtmClient('xoxb-****************************');
rtm.start();

var request = require("request");

let channel;
let bot;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => 
{
	for (const c of rtmStartData.channels) 
	{
        // replace astericks with channel name (or take out entirely)
		if(c.is_member && c.name === '****')
		{
			channel = c.id;
		}
	}
	bot = '<@' + rtmStartData.self.id + '>';
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() 
{
	rtm.sendMessage('Hello! My name is ratingsbot. Type my name followed by ["cf"/"codeforces"/"dmoj"] and then a username to get their rating!', channel);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message)
{
	if(message.channel === channel && message.text != null && message.user != bot)
	{
		var pieces = message.text.split(' ');

		if(pieces.length > 1 && pieces[0] == bot)
		{
			var response = '<@' + message.user + '>';

			switch(pieces[1].toLowerCase())
			{
				case "cf":
				case "codeforces":
					codeforcesRating(pieces[2], message);
					break;
				case "dmoj":
					dmojRating(pieces[2], message);
					break;
				case "help":
					response += ', currently I support DMOJ and codeforces ratings. ' + 
					'Type my name followed by ["cf"/"codeforces"/"dmoj"], and then the username of the person whose rating you would like to looks up (example: ' + bot + ' cf tourist)!';
					rtm.sendMessage(response, message.channel);
					break;
				default:
					response += ', sorry I do not understand this site: "' + pieces[1] + '". For assistance, type: ' + bot + ' help';
					rtm.sendMessage(response, message.channel);
					break;
			}
		}
	}
});

var cf_url_base = 'http://codeforces.com/api/user.info?handles=';
var dmoj_url_base = 'https://dmoj.ca/api/v2/user-info?username=';


// CODEFORCES RATING
// =================
// newbie: <1200 (gray)
// pupil: <1400 (green)
// specialist: <1600 (turquoize)
// expert: <1900 (blue)
// candidate master: <2200 (purple)
// master: <2300 (yellow)
// international master: <2400 (orange)
// grandmaster: <2600 (pink)
// international grandmaster: <2900 (red)
// legendary grandmaster: >= 2900 (dark red)

function codeforcesRating(username, messagetest)
{
	cf_url =  cf_url_base + username;

	request(cf_url, function (error, response, body) 
	{
		if (!error && response.statusCode == 200) 
		{
	  		var info = JSON.parse(body);
	  		var rating = info.result[0].rating;

	  		var response = '<@' + messagetest.user + '>, ' + username 
	  			+ '\'s rating on codeforces is currently ' +String(rating);

	  		if(rating < 1200)
	  		{
	  			response += ' (newbie)!';
	  		}
	  		else if(rating < 1400)
	  		{
	  			response += ' (pupil)!';
	  		}
	  		else if(rating < 1600)
	  		{
	  			response += ' (specialist)!';
	  		}
	  		else if(rating < 1900)
	  		{
	  			response += ' (expert)!';
	  		}
	  		else if(rating < 2200)
	  		{
	  			response += ' (candidate master)!';
	  		}
	  		else if(rating < 2300)
	  		{
	  			response += ' (master)!';
	  		}
	  		else if(rating < 2400)
	  		{
	  			response += ' (international master)!';
	  		}
	  		else if(rating < 2600)
	  		{
	  			response += ' (grandmaster)!';
	  		}
	  		else if(rating < 2900)
	  		{
	  			response += ' (international grandmaster)!';
	  		}
	  		else if(rating >= 2900)
	  		{
	  			response += ' (legendary grandmaster)!';
	  		}
	  		else
	  		{
	  			response += ' (probably negative) :cry:';
	  		}

	  		rtm.sendMessage(response, messagetest.channel);
  		}
  	});
}

// DMOJ RATING
// ===========
// newbie: <1000 (gray)
// pupil: <1200 (green)
// expert: <1500 (blue)
// candidiate master: <1800 (purple)
// master: <2200 (yellow)
// grandmaster: >=2200 (red)

function dmojRating(username, messagetest)
{
	dmoj_url = dmoj_url_base + username;

	request(dmoj_url, function (error, response, body) 
	{
		if (!error && response.statusCode == 200) 
		{
	  		var info = JSON.parse(body);
	  		var rating = info.contests.current_rating;

	  		var response = '<@' + messagetest.user + '>, ' + username 
	  			+ '\'s rating on DMOJ is currently ' +String(rating);

	  		if(rating < 1000)
	  		{
	  			response += ' (newbie)!';
	  		}
	  		else if(rating < 1200)
	  		{
	  			response += ' (pupil)!';
	  		}
	  		else if(rating < 1500)
	  		{
	  			response += ' (expert)!';
	  		}
	  		else if(rating < 1800)
	  		{
	  			response += ' (candidate master)!';
	  		}
	  		else if(rating < 2200)
	  		{
	  			response += ' (master)!';
	  		}
	  		else
	  		{
	  			response += ' (grandmaster)!';
	  		}

	  		rtm.sendMessage(response, messagetest.channel);
  		}
  	});
}