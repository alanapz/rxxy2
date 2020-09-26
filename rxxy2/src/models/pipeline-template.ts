import { PipelineMetadata } from "src/models/pipeline-metadata";

export interface PipelineTemplate {
  slug: string;
  name: string;
  description: string;
  difficulty: number;
  source: string;
  metadata: Record<string, PipelineMetadata>;
}
