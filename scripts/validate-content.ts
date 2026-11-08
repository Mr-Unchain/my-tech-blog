import { formatValidationErrors } from '../src/lib/articles/errors';
import { validateContent } from '../src/lib/articles/validation';

const startedAt = performance.now();
const result = await validateContent();

if (!result.success) {
  console.error(
    `Article validation failed with ${result.errors.length} error(s).`
  );
  console.error(formatValidationErrors(result.errors));
  process.exitCode = 1;
} else {
  const elapsedMilliseconds = Math.round(performance.now() - startedAt);
  console.log(
    `Validated ${result.articles.length} article(s) in ${elapsedMilliseconds}ms.`
  );
}
