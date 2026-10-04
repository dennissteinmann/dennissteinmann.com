import type { APIRoute, GetStaticPaths } from 'astro';
import { type Project, getProjects, PROJECT_KIND_LABELS, projectYears } from '@/lib/content';
import { ogTemplate, renderPng, pngResponse } from '@/lib/og';

export const getStaticPaths = (async () =>
  (await getProjects()).map((project) => ({ params: { slug: project.id }, props: { project } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { project } = props as { project: Project };
  return pngResponse(await renderPng(ogTemplate({ title: project.data.title, meta: `${PROJECT_KIND_LABELS[project.data.kind]} · ${projectYears(project)}` }), 1200, 630));
};
