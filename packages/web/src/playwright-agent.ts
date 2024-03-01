import { Page as PlaywrightPage } from "@playwright/test";
import {
  AzureAIInput,
  NLAction,
  OpenAIInput,
  NavAIGuideAgent,
  SearchUrl,
} from "@navaiguide/core";
import { gotoWaitForTimeout } from "./playwright-utils";
import { tryAsyncEval } from "@navaiguide/core";
import { PlaywrigthNavAIGuidePage } from "./types";
import { sPrompt_Generate_Search_Query } from "./prompts/generate-search-query";

/**
 * The PlaywrightAgent class orchestrates the process of performing and reasoning about actions on a web page towards achieving a specified end goal.
 */
export class PlaywrightAgent extends NavAIGuideAgent {
  private plPage: PlaywrightPage;
  private readonly runCodeSelectorMaxRetries = 3;

  /**
   * Constructs a new PlaywrightAgent instance.
   * @param fields - Configuration fields including OpenAI and AzureAI inputs and Playwright page instance.
   */
  constructor(
    fields?: Partial<OpenAIInput> &
      Partial<AzureAIInput> & {
        configuration?: { organization?: string };
      } & { page: PlaywrightPage }
  ) {
    super(fields);
    this.plPage = fields!.page;
  }

  /**
   * Runs the agent to achieve a specified end goal using a series of actions.
   * @param endGoal - The end goal to be achieved.
   * @returns A promise resolving to an array of relevant data strings upon successfully achieving the goal.
   */
  public async runAsync({ query }: { query: string }): Promise<string[][]> {
    // Define the starting task: bing.com, bing.com/shopping
    const startTask = await this.navAIGuide.classifyStartTask({
      endGoal: query,
      prompt: sPrompt_Classifier_Start_Task
    });
    
    console.log(`Starting at page: ${startTask.startPage}`);
    await gotoWaitForTimeout(this.plPage, startTask.startPage, 5000);

    let currentNavAIGuidePage = await PlaywrigthNavAIGuidePage.fromPlaywrightAsync({
      page: this.plPage,
    });

    const actions: NLAction[] = [];
    while (true) {
      const nextAction = await this.navAIGuide.predictNextNLAction({
        page: currentNavAIGuidePage,
        endGoal: query,
        previousActions: actions,
        mode: "visual",
      });

      console.log(`Predicted next probable action: ${nextAction.actionDescription}`);
      actions.push(nextAction);

      const codeActionResult = await this.navAIGuide.runCodeSelectorWithRetry({
        inputPage: currentNavAIGuidePage,
        endGoal: query,
        nextAction: nextAction,
        maxRetries: 3,
        codeEvalFunc: 
          async (code) => await tryAsyncEval({ page: this.plPage }, code),
      });

      if (!codeActionResult.success) {
        nextAction.actionSuccess = false;
        console.log(`The code action was unsuccessful after ${this.runCodeSelectorMaxRetries} retries.`);
        continue;
      }
      console.log(`The code action was successful.`);

      console.log(`Comparing page states before and after the action.`);
      const nextNavAIGuidePage = await PlaywrigthNavAIGuidePage.fromPlaywrightAsync({
        page: this.plPage,
      });

      // Reasoning - Action Feedback
      const actionFeedbackReasoningResult =
        await this.navAIGuide.RunActionFeedbackReasoning({
          beforePage: currentNavAIGuidePage,
          afterPage: nextNavAIGuidePage,
          takenAction: nextAction,
        });

      if (
        !actionFeedbackReasoningResult ||
        !actionFeedbackReasoningResult.actionSuccess
      ) {
        console.log(`The action did not hold the expected results: ${actionFeedbackReasoningResult.pageStateChanges}.`);
        // TODO: Backtrack if no success + restore previous page state
        nextAction.actionSuccess = false;
        continue;
      }
      console.log(`The action held the expected results: ${actionFeedbackReasoningResult.pageStateChanges}.`);
      
      console.log(`Checking whether the goal was met.`);
      // Reasoning - Goal Check
      const {endGoalMet, relevantData } = await this.navAIGuide.RunGoalCheckReasoning({
        page: nextNavAIGuidePage,
        endGoal: query,
        newInformation: actionFeedbackReasoningResult.newInformation,
      });

      if (endGoalMet) {
        console.log(`Goal was met. Found relevant data:`);
        for (const data of relevantData) {
          if (data[0] && data[1]) {
            console.log(`${data[0]} - ${data[1]}`);
          }
        }
        return relevantData;
      }

      console.log(`Goal not met. Continuing to the next action.`);
      currentNavAIGuidePage = nextNavAIGuidePage;
    }
  }

  /**
   * Generates a search query based on the given end goal.
   * @param endGoal - The final objective or goal specified in natural language.
   * @returns A promise resolving to a SearchQuery object representing the query to be used on Bing Search.
   */
  private async generateSearchUrl({
    endGoal,
  }: {
    endGoal: string;
  }): Promise<SearchUrl> {
    const startTaskResult = await this.client.generateText({
      systemPrompt: sPrompt_Generate_Search_Query,
      prompt: JSON.stringify({
        endGoal: endGoal,
      }),
      model: OpenAIEnum.GPT35_TURBO,
      responseFormat: "json_object",
      temperature: 0.4,
      seed: 923, // Reproducible output
    });

    let searchQuery: SearchUrl;
    try {
      searchQuery = JSON.parse(startTaskResult.choices[0].message.content);
    } catch (e) {
      console.error("Parsed content is not valid JSON");
    }

    return searchQuery;
  }
}
