import { FileText, Linkedin, MessageCircle, Sparkles, LucideIcon } from "lucide-react";

export interface Suggestion {
  title: string;
  description: string;
  prompt: string;
}

export interface SuggestionCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  suggestions: Suggestion[];
}

export const DASHBOARD_SUGGESTIONS: SuggestionCategory[] = [
  {
    id: "curriculo",
    label: "Currículo",
    icon: FileText,
    title: "Transforme seu currículo",
    suggestions: [
      {
        title: "Otimizar para uma vaga específica",
        description: "Cole a descrição da vaga e eu ajusto seu currículo para aumentar suas chances de passar pelos sistemas ATS e chamar atenção dos recrutadores",
        prompt: "",
      },
      {
        title: "Criar currículo do zero",
        description: "Vou te guiar passo a passo para construir um currículo profissional completo e estratégico",
        prompt: "Quero criar um currículo profissional completo do zero. Me ajude passo a passo.",
      },
      {
        title: "Melhorar seções específicas",
        description: "Aprimore experiências profissionais, habilidades ou outras seções do seu currículo",
        prompt: "Quero melhorar as seções de experiência e habilidades do meu currículo para destacar melhor meu perfil.",
      },
      {
        title: "Análise completa do currículo",
        description: "Receba feedback detalhado sobre pontos fortes e áreas de melhoria do seu currículo atual",
        prompt: "Analise meu currículo completo e me dê feedback sobre pontos fortes e áreas que posso melhorar.",
      },
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    title: "Otimize seu LinkedIn",
    suggestions: [
      {
        title: "Criar resumo profissional impactante",
        description: "Desenvolva um 'Sobre' que conte sua história e atraia recrutadores",
        prompt: "Crie um resumo profissional impactante para meu LinkedIn baseado no meu perfil atual.",
      },
      {
        title: "Headline que chama atenção",
        description: "Elabore uma headline profissional que apareça em buscas e gere interesse",
        prompt: "Sugira uma headline profissional e atrativa para meu perfil do LinkedIn que melhore minha visibilidade.",
      },
      {
        title: "Otimizar descrições de experiências",
        description: "Transforme suas experiências profissionais em descrições que demonstrem impacto e resultados",
        prompt: "Me ajude a otimizar as descrições das minhas experiências profissionais no LinkedIn para destacar resultados e impacto.",
      },
      {
        title: "Estratégia de conteúdo LinkedIn",
        description: "Aprenda como criar posts que gerem engajamento e aumentem sua autoridade profissional",
        prompt: "Me dê estratégias e dicas para criar conteúdo no LinkedIn que gere engajamento e aumente minha autoridade profissional.",
      },
    ],
  },
  {
    id: "entrevistas",
    label: "Entrevistas",
    icon: MessageCircle,
    title: "Prepare-se para entrevistas",
    suggestions: [
      {
        title: "Responder 'fale sobre você'",
        description: "Elabore uma resposta estruturada e impactante que demonstre seu valor profissional",
        prompt: "Me ajude a criar uma resposta impactante para 'fale sobre você' que destaque minha experiência e valor profissional.",
      },
      {
        title: "Preparar para perguntas comportamentais",
        description: "Use o método STAR para criar respostas convincentes que demonstrem suas competências",
        prompt: "Prepare respostas estruturadas usando o método STAR para perguntas comportamentais comuns em entrevistas.",
      },
      {
        title: "Perguntas estratégicas para fazer",
        description: "Aprenda quais perguntas fazer ao entrevistador para demonstrar interesse e inteligência",
        prompt: "Quais perguntas estratégicas devo fazer ao entrevistador para demonstrar interesse genuíno e conhecimento sobre a empresa?",
      },
      {
        title: "Negociação de salário",
        description: "Estratégias práticas para negociar sua remuneração com confiança e preparação",
        prompt: "Me ajude a me preparar para negociar salário na entrevista. Quais estratégias devo usar?",
      },
    ],
  },
  {
    id: "carreira",
    label: "Carreira",
    icon: Sparkles,
    title: "Estratégias de carreira",
    suggestions: [
      {
        title: "Planejamento de carreira",
        description: "Defina objetivos profissionais e crie um plano estratégico para alcançá-los",
        prompt: "Me ajude a criar um plano estratégico de carreira baseado nos meus objetivos profissionais.",
      },
      {
        title: "Análise de vagas",
        description: "Aprenda a ler descrições de vagas e identificar o que realmente importa",
        prompt: "Me ensine como analisar uma descrição de vaga para identificar requisitos essenciais e oportunidades de destaque.",
      },
      {
        title: "Mudança de carreira",
        description: "Estratégias para fazer transição profissional mantendo valor e relevância",
        prompt: "Estou pensando em mudar de carreira. Me ajude a identificar transferable skills e como posicionar minha experiência.",
      },
    ],
  },
];
