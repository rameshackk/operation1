import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const k6Path = path.join(__dirname, '..', '..', 'k6_dist', 'k6-v0.56.0-windows-amd64', 'k6.exe');

const scenarios = [
  { name: 'Core Data Endpoints (/api/videos & /api/articles)', file: 'data_endpoints.js' },
  { name: 'Individual Article Page Lookup', file: 'article_page.js' },
  { name: 'Search API Queries (ILIKE full search)', file: 'search.js' }
];

const stages = [
  { vus: 50, duration: '20s' },
  { vus: 200, duration: '25s' },
  { vus: 500, duration: '25s' },
  { vus: 1000, duration: '30s' }
];

const allResults = [];

async function runSingleStage(scenario, stage) {
  const summaryFile = path.join(__dirname, `summary_${stage.vus}_${Date.now()}.json`);
  const scriptPath = path.join(__dirname, scenario.file);

  const cmd = `"${k6Path}" run --vus ${stage.vus} --duration ${stage.duration} --summary-export="${summaryFile}" "${scriptPath}"`;
  console.log(`\n--------------------------------------------------------------`);
  console.log(`[${scenario.name}] -> Testing ${stage.vus} VUs for ${stage.duration}`);
  console.log(`--------------------------------------------------------------`);

  try {
    execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
  } catch (err) {
    // k6 may return exit code 1 if thresholds triggered, ignore
  }

  if (fs.existsSync(summaryFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(summaryFile, 'utf-8'));
      fs.unlinkSync(summaryFile);

      const metrics = data.metrics || {};
      const reqDuration = metrics.http_req_duration?.values || {};
      const reqFailed = metrics.http_req_failed?.values || {};
      const reqs = metrics.http_reqs?.values || {};

      const p50Val = reqDuration['p(50)'] || reqDuration.med || 0;
      const p90Val = reqDuration['p(90)'] || 0;
      const p95Val = reqDuration['p(95)'] || 0;
      const p99Val = reqDuration['p(99)'] || 0;
      const maxVal = reqDuration.max || 0;
      const rpsVal = reqs.rate || 0;
      const errVal = ((reqFailed.rate || 0) * 100).toFixed(2);

      const resultRow = {
        'Scenario': scenario.name,
        'VUs': stage.vus,
        'Duration': stage.duration,
        'Req/sec (RPS)': rpsVal.toFixed(1),
        'p50 (ms)': p50Val.toFixed(1),
        'p95 (ms)': p95Val.toFixed(1),
        'p99 (ms)': p99Val.toFixed(1),
        'Max (ms)': maxVal.toFixed(1),
        'Error Rate': `${errVal}%`
      };

      console.log(`Results: RPS=${resultRow['Req/sec (RPS)']} | p50=${resultRow['p50 (ms)']}ms | p95=${resultRow['p95 (ms)']}ms | p99=${resultRow['p99 (ms)']}ms | Errors=${resultRow['Error Rate']}`);
      return resultRow;
    } catch (e) {
      console.error('Failed to parse summary:', e.message);
    }
  }

  return {
    'Scenario': scenario.name,
    'VUs': stage.vus,
    'Duration': stage.duration,
    'Req/sec (RPS)': '0.0',
    'p50 (ms)': 'Timeout',
    'p95 (ms)': 'Timeout',
    'p99 (ms)': 'Timeout',
    'Max (ms)': 'Timeout',
    'Error Rate': '100.0%'
  };
}

async function main() {
  console.log('==============================================================');
  console.log('            STARTING FULL LOAD TEST MATRIX RUNNER             ');
  console.log('==============================================================');

  for (const scenario of scenarios) {
    for (const stage of stages) {
      const res = await runSingleStage(scenario, stage);
      allResults.push(res);
      // Wait 3 seconds between stages for connection pool stabilization
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log('\n==============================================================');
  console.log('                   FINAL AGGREGATED METRICS                   ');
  console.log('==============================================================');
  console.table(allResults);

  fs.writeFileSync(path.join(__dirname, 'final_loadtest_metrics.json'), JSON.stringify(allResults, null, 2), 'utf-8');
}

main().catch(console.error);
