/** Source status for a skill discovery provider. */
export type SourceState =
  | "available"
  | "authentication_required"
  | "rate_limited"
  | "unavailable"
  | "error";

export type SourceResult = {
  source: string;
  state: SourceState;
  hits: import("./search-types.js").SkillHit[];
  error: string | null;
};

export type SkillSource = {
  readonly name: string;
  discover(query: string, options?: { limit?: number; fetchImpl?: typeof fetch }): Promise<SourceResult>;
};
