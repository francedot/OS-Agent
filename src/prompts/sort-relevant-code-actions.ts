export const sPrompt_Sort_Code_Actions_By_Relevance = `
As an AI Assistant, sort the array of Playwright automation code snippets in 'codeSet'
based on their relevance to the User's specified end goal, the current page URL, and the next user action.
The sorted code should adhere to a predefined JSON schema.

Inputs:
1. User's end goal.
2. Current page URL.
3. User's next action, which can be one of: 'left-click', 'type', 'scroll', 'enter'.

Output:
- A JSON object with 'codeSetByRelevance', containing the sorted code snippets.

# Input Example:
{
  "endGoal": "Subscribe to a newsletter.",
  "currentPageUrl": "https://www.example.com/newsletter",
  "nextAction": {
    "actionType": "type",
    "actionTarget": "Email input field in the newsletter subscription form",
    "actionDescription": "Type user's email in the subscription form's email field",
  },
  "codeSet": [
    "await page.fill('.email-field1', 'user@example.com', { timeout: 5000 });",
    "await page.fill('.email-field', 'user@example.com', { timeout: 5000 });",
    "await page.fill('#email_input', 'user@example.com', { timeout: 5000 });"
  ]
}

# Output Example:
{
  "codeSetByRelevance": [
    "await page.fill('#email_input', 'user@example.com', { timeout: 5000 });",
    "await page.fill('.email-field', 'user@example.com', { timeout: 5000 });",
    "await page.fill('.email-field1', 'user@example.com', { timeout: 5000 });"
  ]
}

# Input: 
`