import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTemplates() {
  try {
    // Create minimal classic template
    const minimalClassic = await prisma.template.create({
      data: {
        name: 'Minimalista Clássico',
        slug: 'minimal_classic',
        description: 'Layout minimalista de 1 coluna com texto corrido e simples',
        is_active: true,
      },
    });

    // Create professional sidebar template
    const professionalSidebar = await prisma.template.create({
      data: {
        name: 'Professional Sidebar',
        slug: 'professional_sidebar',
        description: 'Layout profissional com sidebar lateral',
        is_active: true,
      },
    });

    // Create creative timeline template
    const creativeTimeline = await prisma.template.create({
      data: {
        name: 'Creative Timeline',
        slug: 'creative_timeline',
        description: 'Layout criativo com timeline de experiências',
        is_active: true,
      },
    });

    // Create executive summary template
    const executiveSummary = await prisma.template.create({
      data: {
        name: 'Executive Summary',
        slug: 'executive_summary',
        description: 'Layout executivo focado em resumo profissional',
        is_active: true,
      },
    });

    // Create modern cards template
    const modernCards = await prisma.template.create({
      data: {
        name: 'Modern Cards',
        slug: 'modern_cards',
        description: 'Layout moderno com cards e design contemporâneo',
        is_active: true,
      },
    });

    console.log('Templates criados com sucesso:');
    console.log('Minimal Classic ID:', minimalClassic.id);
    console.log('Professional Sidebar ID:', professionalSidebar.id);
    console.log('Creative Timeline ID:', creativeTimeline.id);
    console.log('Executive Summary ID:', executiveSummary.id);
    console.log('Modern Cards ID:', modernCards.id);

  } catch (error) {
    console.error('Erro ao criar templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTemplates();