var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var rtm = new RtmClient('xoxb-****************************');
rtm.start();

let channel;
let bot;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => 
{
	for (const c of rtmStartData.channels) 
	{
		if(c.is_member && c.name === '******')
		{
			channel = c.id;
		}
	}

	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);

	bot = '<@' + rtmStartData.self.id + '>';
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() 
{
	rtm.sendMessage("Hello!", channel);
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
				case "jump":
					response += '"Wow, that was a really high jump! Good job my dude :ok_hand:"';
					break;
				case "help":
					response += ', currently I support the following commands: jump';
					break;
				default:
					response += ', sorry I do not understand this command: "' + pieces[1] + '". For a list of supported commands, type: ' + bot + ' help';
					break;
			}

			rtm.sendMessage(response, message.channel);
		}
	}
});