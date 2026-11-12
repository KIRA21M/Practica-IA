import { referenceCases } from './referenceCases.js';
import { analyzeTraditional } from '../engines/traditionalEngine.js';
import { analyzeGenerative } from '../engines/generativeEngine.js';
import { config, hasGenerativeApiKey } from '../config.js';
import { isSupportAnalysis } from '../domain/support.js';

function evaluate(result, expected) {
  return {
    category: result?.category ?? null,
    priority: result?.priority ?? null,
    formatValid: isSupportAnalysis(result),
    categoryCorrect: result?.category === expected.category,
    priorityCorrect: result?.priority === expected.priority,
    overallCorrect: result?.category === expected.category && result?.priority === expected.priority
  };
}

function summarize(results) {
  const completed = results.filter((result) => result.status === 'completed');
  return {
    total: results.length,
    completed: completed.length,
    formatAccuracy: completed.length ? completed.filter((result) => result.evaluation.formatValid).length / completed.length : 0,
    categoryAccuracy: completed.length ? completed.filter((result) => result.evaluation.categoryCorrect).length / completed.length : 0,
    overallAccuracy: completed.length ? completed.filter((result) => result.evaluation.overallCorrect).length / completed.length : 0
  };
}

async function run() {
  const traditional = referenceCases.map((expected) => ({
    ...expected,
    status: 'completed',
    evaluation: evaluate(analyzeTraditional(expected.message), expected)
  }));

  const generative = [];
  if (hasGenerativeApiKey()) {
    for (const expected of referenceCases) {
      try {
        const result = await analyzeGenerative(expected.message);
        generative.push({ ...expected, status: 'completed', evaluation: evaluate(result, expected) });
      } catch (error) {
        generative.push({ ...expected, status: 'error', error: error.message });
      }
    }
  } else {
    const variable = config.aiProvider === 'anthropic' ? 'ANTHROPIC_API_KEY' : 'OPENAI_API_KEY';
    generative.push(...referenceCases.map((expected) => ({ ...expected, status: 'skipped', error: `${variable} no configurada` })));
  }

  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    referenceCount: referenceCases.length,
    traditional: { summary: summarize(traditional), cases: traditional },
    generative: { summary: summarize(generative), cases: generative }
  }, null, 2));
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
