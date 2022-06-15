API_ENDPOINT = "http://127.0.0.1/api"

function addonMainCallback(event) {
  console.info("Hello");

  var message = getCurrentMessage(event);

  console.info("Got message");

  var rawMsg = {
    "dateRaw": message.getDate(),
    "fromRaw": message.getFrom(),
    "toRaw": message.getTo(),
    "ccRaw": message.getCc(),
    "subjectRaw": message.getSubject(),
    "bodyRaw": message.getBody(),
  };
  var rawMsgString = JSON.stringify(rawMsg);
  console.info("Composed rawMsgString");
  console.info(rawMsgString);

  var card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader().setTitle('My Header'));

  var statusSection = CardService.newCardSection();
  statusSection.addWidget(CardService.newTextParagraph()
    .setText('Hello world!'));
  statusSection.addWidget(CardService.newTextParagraph()
    .setText('<b>' + message.getSubject() + '</b>'));
  card.addSection(statusSection);

  var otherSection = CardService.newCardSection();

  var action = CardService.newAction()
    .setFunctionName('buttonCallback').setParameters({'rawMsgString': rawMsgString});
  otherSection.addWidget(
      CardService.newButtonSet().addButton(
        CardService.newTextButton()
          .setText('CRM this')
          .setOnClickAction(action)
      )
    );
  card.addSection(otherSection);

  return card.build();
}

function buttonCallback(event) {
  console.info("buttonCallback: hello world");

  var params = event.commonEventObject.parameters;
  
  var rawMsgString = params["rawMsgString"];

  console.info("buttonCallback: got infos");
  console.info("buttonCallback: rawMsgString = " + rawMsgString);
  
  var options = {
    "contentType": "application/json",
    "method": "post",
    "payload": rawMsgString,
  };
  var response = UrlFetchApp.fetch(API_ENDPOINT, options);

  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText(JSON.stringify(response)))
      .build();
}

function getCurrentMessage(event) {
  var accessToken = event.messageMetadata.accessToken;
  var messageId = event.messageMetadata.messageId;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  return GmailApp.getMessageById(messageId);
}
