Guidance on Writing Instructions
There are many ways to write successful instructions: the most important thing is that the instructions enable the model to reflect the user's preferences.

Typically, there are three sections:

Context to explain to the model what the GPT Action(s) is doing
Instructions on the sequence of steps – this is where you reference the Action name and any parameters the API call needs to pay attention to
Additional Notes if there’s anything to keep in mind

Here’s an example of the instructions for the Weather GPT. Notice how the instructions refer to the API action name and json parameters from the Open API schema:


**Context**: A user needs information related to a weather forecast of a specific location.

**Instructions**:
1. The user will provide a lat-long point or a general location or landmark (e.g. New York City, the White House). If the user does not provide one, ask for the relevant location
2. If the user provides a general location or landmark, convert that into a lat-long coordinate. If required, browse the web to look up the lat-long point. 
3. Run the "getPointData" API action and retrieve back the gridId, gridX, and gridY parameters.
4. Apply those variables as the office, gridX, and gridY variables in the "getGridpointForecast" API action to retrieve back a forecast
5. Use that forecast to answer the user's question 

**Additional Notes**: 
- Assume the user uses US weather units (e.g. Fahrenheit) unless otherwise specified
- If the user says "Let's get started" or "What do I do?", explain the purpose of this Custom GPT
