function checkMail() {
  const webhookURL = '<WEBHOOK URL HERE>'; //Webhook that will receive the mail notification
  var emailThreads = GmailApp.getPriorityInboxThreads()
  var discordPayload = {
    embeds: []
  }
  for (let thread in emailThreads) {//cycle threads
    if (emailThreads[thread].isUnread()) {

      var messages = emailThreads[thread].getMessages();
      for (let message in messages) {//cycle messages in a spceific thread
        if (messages[message].isUnread()) {
          let embed = {
            title: 'You got mail!',
            url: `https://mail.google.com/mail/u/0/#inbox/${emailThreads[thread].getId()}`,
            fields: [
              {
                name: 'Subject',
                value: messages[message].getSubject()
              },
              {
                name: 'Sender',
                value: messages[message].getFrom()
              },
              {
                name: 'Content',
                value: messages[message].getPlainBody().length > 255 ? messages[message].getPlainBody().substring(0, 252) + '...' : messages[message].getPlainBody() //stops the message field from going over the API limit
              }
            ]
          }
          discordPayload.embeds.push(embed)
          if (discordPayload.embeds.length > 9) {//webhooks can only take 10 embeds, so send the message prematurely if there are ten
            UrlFetchApp.fetch(webhookURL, {
              method: 'post',
              payload: JSON.stringify(discordPayload),
              contentType: 'application/json'
            })
            discordPayload.embeds = [];
          }

          messages[message].markRead();
        }
      }
    }
  }
  if (discordPayload.embeds.length > 0) {
    UrlFetchApp.fetch(webhookURL, {
      method: 'post',
      payload: JSON.stringify(discordPayload),
      contentType: 'application/json'
    })
  }
}
