import { zarrRenderRecipeFromCode } from './renderBundle';
import type { ExecutionPurpose, MethodRecord, MethodVersion, ZarrRenderRecipe } from './types';

export interface ExecutionOrigin { methodId?: string; pipelineId?: string }
export type ExecutionContext = { kind: 'chat'; chatId: string; promptId: string } | { kind: 'run'; runId: string };

export function createSavedMethodExecutor(
  execute: (code: string, context: ExecutionContext, force: boolean, purpose: ExecutionPurpose, origin: ExecutionOrigin) => Promise<string>,
  render: (result: string, context: ExecutionContext, name: string, recipe: ZarrRenderRecipe | undefined, origin: ExecutionOrigin) => Promise<string | null>
) {
  return async (method: MethodRecord, version: MethodVersion, code: string, context: ExecutionContext,
    origin: ExecutionOrigin = {}, force = false) => {
    const executionResult = await execute(code, context, force, origin.pipelineId ? 'pipeline' : 'method', origin);
    const renderResult = await render(executionResult, context, method.name, version.renderRecipe || zarrRenderRecipeFromCode(code), origin);
    return { executionResult, renderResult };
  };
}
