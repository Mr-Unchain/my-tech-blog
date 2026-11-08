#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const packagePath = resolve(root, 'package.json');

if (!existsSync(packagePath)) {
  console.error('package.json was not found. Run this script from the repository root.');
  process.exit(2);
}

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
const scripts = packageJson.scripts ?? {};
const npmCommand = 'npm';
const spawnOptions = {
  cwd: root,
  encoding: 'utf8',
  shell: process.platform === 'win32',
  maxBuffer: 20 * 1024 * 1024,
};
const checks = [
  { name: 'content-validation', script: 'validate:content', args: [] },
  { name: 'lint', script: 'lint', args: [] },
  { name: 'format', script: 'format:check', args: [] },
  { name: 'unit-tests', script: 'test', args: ['--', '--run'] },
  { name: 'production-build', script: 'build', args: [] },
];

const results = [];

for (const check of checks) {
  if (!scripts[check.script]) {
    results.push({ name: check.name, status: 'skipped', durationMs: 0, detail: `Missing npm script: ${check.script}` });
    continue;
  }

  const startedAt = Date.now();
  const result = spawnSync(npmCommand, ['run', check.script, ...check.args], spawnOptions);
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
  results.push({
    name: check.name,
    status: result.error ? 'inconclusive' : result.status === 0 ? 'passed' : 'failed',
    durationMs: Date.now() - startedAt,
    exitCode: result.status,
    detail: `${result.error?.message ?? ''}\n${output}`.trim().slice(-4000),
  });
}

const auditStartedAt = Date.now();
const audit = spawnSync(npmCommand, ['audit', '--json', '--audit-level=high'], spawnOptions);

let auditResult;
if (audit.error) {
  auditResult = {
    name: 'dependency-audit',
    status: 'inconclusive',
    durationMs: Date.now() - auditStartedAt,
    exitCode: audit.status,
    detail: audit.error.message,
  };
} else {
  try {
    const parsed = JSON.parse(audit.stdout || '{}');
    const vulnerabilities = parsed.metadata?.vulnerabilities;
    if (!vulnerabilities) {
      throw new Error('npm audit did not return vulnerability metadata');
    }
    const highOrCritical = (vulnerabilities.high ?? 0) + (vulnerabilities.critical ?? 0);
    auditResult = {
      name: 'dependency-audit',
      status: highOrCritical > 0 ? 'failed' : 'passed',
      durationMs: Date.now() - auditStartedAt,
      exitCode: audit.status,
      detail: JSON.stringify(vulnerabilities),
    };
  } catch (error) {
    auditResult = {
      name: 'dependency-audit',
      status: 'inconclusive',
      durationMs: Date.now() - auditStartedAt,
      exitCode: audit.status,
      detail: `${error.message}\n${audit.stderr || audit.stdout || 'npm audit returned no parseable output'}`.trim().slice(-2000),
    };
  }
}
results.push(auditResult);

const requiredFailures = results.filter((result) => result.status === 'failed');
const inconclusive = results.some((result) => result.status === 'inconclusive');
const overall = requiredFailures.length > 0 ? 'degraded' : inconclusive ? 'inconclusive' : 'healthy';

console.log(JSON.stringify({ overall, generatedAt: new Date().toISOString(), results }, null, 2));
process.exit(requiredFailures.length > 0 ? 1 : inconclusive ? 2 : 0);
