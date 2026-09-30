import type { APIRoute, GetStaticPaths } from 'astro';
import { type Project, getProjects, STATUS_LABELS } from '@/lib/content';
import { ogTemplate, renderPng, pngResponse } from '@/lib/og';

export const getStaticPaths = (async () =>
  (await getProjects()).map((project) => ({ params: { slug: project.id }, props: { project } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { project } = props as { project: Project };
  const d = project.data;
  return pngResponse(await renderPng(ogTemplate({ kicker: `Projekt · ${STATUS_LABELS[d.status]}`, title: d.title, meta: `Seit ${d.started.getFullYear()}${d.role ? ` · ${d.role}` : ''}` }), 1200, 630));
};
