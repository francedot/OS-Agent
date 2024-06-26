import { WindowsAgent } from "../src/win-agent";
import { ToolsetPlan } from "@interface-agent/core";
import { tPrompt_Blank_Word } from "./tasks-to-be-done/word";
import { tPrompt_Movies_App } from "./tasks-to-be-done/movie-night";

describe("Windows Device Interaction Tests", function() {

  let windowsAgent: WindowsAgent;

  before(async function() {
    windowsAgent = new WindowsAgent();
    await windowsAgent.initAsync();
  });

  beforeEach(async function() {
    // This runs before each test. Initializing the Appium client here if needed for each test.
  });

  afterEach(async function() {
    // This runs after each gh k. Clean up resources, like closing the Appium session.
  });

  const wordPlan: ToolsetPlan = {
    description: "Create a resume using Word.",
    steps: [
      {
        toolId: "Word",
        toolPrompt: tPrompt_Blank_Word
      }
    ]
  };

  it(wordPlan.description, async function() {
    const results = await windowsAgent.runFromPlanAsync({
      plan: wordPlan
    });
  });

  const movieNightPlan: ToolsetPlan = {
    description: "A plan for a movie night: download a movie and order some pizza",
    steps: [
      {
        toolId: "Microsoft.ZuneVideo_8wekyb3d8bbwe",
        toolPrompt: tPrompt_Movies_App
      },
      {
        toolId: "Edge",
        toolPrompt: "Use Edge, open deliveroo.ie and order some pizza."
      }
    ]
  };

  it(movieNightPlan.description, async function() {
    const results = await windowsAgent.runFromPlanAsync({
      plan: movieNightPlan
    });
  });

  const msMovies1Query = "Open the Movies & TV app.";
  it(msMovies1Query, async function() {
    const results = await windowsAgent.runAsync({
      query: msMovies1Query
    });
  });

  const msMoviesQuery = "Open the Movies & TV app and look for a movie named 'The Matrix'.";
  it(msMoviesQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: msMoviesQuery
    });
  });

  const msEdgeQuery = "Use Edge, open deliveroo.ie and order some pizza.";
  it(msEdgeQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: msEdgeQuery
    });
  });

  const vsCodeQuery = "Write a new hello world in C# in Visual Studio 2022.";
  it(vsCodeQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: vsCodeQuery
    });
  });

  const winStoreQuery = "Open the Windows Store app and look for an app named EdgeTile, and download it.";
  it(winStoreQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: winStoreQuery
    });
  });

  const wordQuery = "Help me create a document on 'AI in Healthcare' using Word.";
  it(wordQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: wordQuery
    });
  });

  const pptPresentationQuery = "Help me create a presentation on 'AI in Healthcare' using PowerPoint.";
  it(pptPresentationQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: pptPresentationQuery
    });
  });

  const fitnessPlannerQuery = "I need some help for running a 30-day fitness challenge.";
  it(fitnessPlannerQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: fitnessPlannerQuery
    });
  });

  const musicNightPlannerQuery = "Let's plan a music night for this Saturday.";
  it(musicNightPlannerQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: musicNightPlannerQuery
    });
  });

  const wicklowTripPlannerQuery = "Let's plan a trip to Cork for this weekend.";
  it(wicklowTripPlannerQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: wicklowTripPlannerQuery
    });
  });

  const findLatestMGKQuery = "I'd like to listen the latest MGK single called 'don't let me go' on SoundCloud.";
  it(findLatestMGKQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: findLatestMGKQuery
    });
  });

  const sendMessageWhatsappQuery = "Send a message to friend on Instagram telling her 'Bella Ciao'";
  it(sendMessageWhatsappQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: sendMessageWhatsappQuery
    });
  });

  const turnOffLocationServiceQuery = "Turn off location services in iOS Settings.";
  it(turnOffLocationServiceQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: turnOffLocationServiceQuery
    });
  });

  const youtubeQuery = "Check the latest news on AI from 'Matt Wolfe' on YouTube.";
  it(youtubeQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: youtubeQuery
    });
  });

  const twitterQuery = "Check the latest news on AI from 'Matt Wolfe' on Twitter.";
  it(twitterQuery, async function() {
    const results = await windowsAgent.runAsync({
      query: twitterQuery
    });
  });

  after(async function() {
    // Cleanup code for the entire test suite, if any.
  });
});
