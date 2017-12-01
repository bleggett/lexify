'use strict';

// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

// --------------- Events -----------------------

function dispatch(intentRequest, callback) {
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
    const artistName = slots.artistName;

    if (source === 'DialogCodeHook') {
        // Perform basic validation on the supplied input slots.  Use the elicitSlot dialog action to re-prompt for the first violation detected.
        const slots = intentRequest.currentIntent.slots;
        // const validationResult = validateOrderFlowers(flowerType, date, time);
        // if (!validationResult.isValid) {
        //     slots[`${validationResult.violatedSlot}`] = null;
        //     callback(elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
        //     return;
        // }

        // Pass the price of the flowers back through session attributes to be used in various prompts defined on the bot model.
        const outputSessionAttributes = intentRequest.sessionAttributes || {};
        if (artistName) {
            outputSessionAttributes.album = artistName.length * 5;
        }
        callback(delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    // Order the flowers, and rely on the goodbye message of the bot to define the message to the end user.  In a real bot, this would likely involve a call to a backend service.
    // callback(close(intentRequest.sessionAttributes, 'Fulfilled',
    //                { contentType: 'PlainText', content: `Thanks, your order for ${flowerType} has been placed and will be ready for pickup by ${time} on ${date}` }));

    callback(close(sessionAttributes, 'Fulfilled',
                   {'contentType': 'PlainText', 'content': `Cool bro, it looks like INSERT ALBUM might be one of ${artistName}'s top albums`}));

}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
                 (response) => {
                     callback(null, response);
                 });
    } catch (err) {
        callback(err);
    }
};
