import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.etanokdvfyvkidpeovdi:Fortune%21%40%23%241234%3F@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 10, // Default pool size configured in lib/db.js
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

function calculatePercentiles(latencies) {
  if (latencies.length === 0) return { p50: 0, p90: 0, p95: 0, p99: 0, min: 0, max: 0, avg: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const getP = (p) => sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
  const avg = sorted.reduce((sum, v) => sum + v, 0) / sorted.length;
  return {
    p50: getP(50).toFixed(1),
    p90: getP(90).toFixed(1),
    p95: getP(95).toFixed(1),
    p99: getP(99).toFixed(1),
    min: sorted[0].toFixed(1),
    max: sorted[sorted.length - 1].toFixed(1),
    avg: avg.toFixed(1),
    totalQueries: sorted.length
  };
}

async function runStage(concurrency, totalQueriesPerWorker) {
  console.log(`\n======================================================`);
  console.log(`[DB Pool Benchmark] Testing Concurrency: ${concurrency} simultaneous workers (${totalQueriesPerWorker} queries/worker)`);
  console.log(`======================================================`);

  const latencies = [];
  const errors = [];
  const startTime = Date.now();

  const worker = async (workerId) => {
    for (let i = 0; i < totalQueriesPerWorker; i++) {
      const qStart = Date.now();
      try {
        // Read-only catalog query matching app usage
        await pool.query(`
          SELECT a.id, a.slug, a.title_ta, a.title_en, a.category, a.published_at 
          FROM articles a 
          WHERE a.status = 'published' 
          ORDER BY a.published_at DESC 
          LIMIT 20
        `);
        const duration = Date.now() - qStart;
        latencies.push(duration);
      } catch (err) {
        errors.push({ workerId, iteration: i, error: err.message });
      }
    }
  };

  const workers = Array.from({ length: concurrency }, (_, idx) => worker(idx));
  await Promise.all(workers);

  const totalTimeSeconds = (Date.now() - startTime) / 1000;
  const stats = calculatePercentiles(latencies);
  const rps = (latencies.length / totalTimeSeconds).toFixed(1);
  const errorRate = ((errors.length / (latencies.length + errors.length)) * 100).toFixed(2);

  console.log(`Results for ${concurrency} Concurrency:`);
  console.log(`- Throughput: ${rps} queries/sec`);
  console.log(`- Latency (ms): p50=${stats.p50}ms | p90=${stats.p90}ms | p95=${stats.p95}ms | p99=${stats.p99}ms | max=${stats.max}ms`);
  console.log(`- Errors: ${errors.length} (${errorRate}%)`);

  return { concurrency, rps, stats, errorRate, errorsCount: errors.length };
}

async function runDirectDbPoolTest() {
  console.log(`Connecting directly to Supabase connection pool: ${connectionString.split('@')[1] || 'Supabase Pooler'}`);
  console.log(`Current Pool Max Connections: 10\n`);

  const concurrencyStages = [10, 25, 50, 100, 200, 300];
  const summary = [];

  for (const c of concurrencyStages) {
    const res = await runStage(c, 10);
    summary.push(res);
    // Brief cooldown between stages
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\n======================================================`);
  console.log(`            SUPABASE DB POOL BENCHMARK SUMMARY        `);
  console.log(`======================================================`);
  console.table(summary.map(s => ({
    'Concurrency': s.concurrency,
    'Throughput (QPS)': s.rps,
    'p50 (ms)': s.stats.p50,
    'p95 (ms)': s.stats.p95,
    'p99 (ms)': s.stats.p99,
    'Max (ms)': s.stats.max,
    'Error Rate': `${s.errorRate}%`
  })));

  await pool.end();
}

runDirectDbPoolTest().catch(console.error);
