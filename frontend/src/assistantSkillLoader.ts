import type { WorkflowSkillPackage } from './types';

/** Cache immutable revisions and share in-flight requests; failed loads remain retryable. */
export class AssistantSkillLoader {
  private requests = new Map<string, Promise<WorkflowSkillPackage>>();
  async load(source: string, name: string, expectedHash: string | undefined, fetchPackage: () => Promise<WorkflowSkillPackage>) {
    const key = `${source}/${name}/${expectedHash || 'unversioned'}`;
    let request = this.requests.get(key);
    if (!request) {
      request = fetchPackage().then(value => {
        if (expectedHash && value.skill.sha256 !== expectedHash) throw new Error('Skill revision changed; refresh the catalog and retry.');
        return value;
      }).catch(error => { this.requests.delete(key); throw error; });
      this.requests.set(key, request);
    }
    return request;
  }
}
