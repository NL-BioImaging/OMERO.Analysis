import type { AiProfileStore, AnalysisSettingsBundle, CustomSkill, ProviderSettings } from './types';

export function settingsBundle(profileStore: AiProfileStore, settings: ProviderSettings,
  analysis: AnalysisSettingsBundle['analysis'], skills: CustomSkill[]): AnalysisSettingsBundle {
  return {
    schema: 'nl.bioimaging.analysis.settings.bundle.v1', analysis, skills,
    ai: { ...profileStore, profiles: profileStore.profiles.map(profile => profile.id === profileStore.activeProfileId
      ? { ...profile, settings } : profile) }
  };
}
